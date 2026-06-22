import { WindowMode } from '@/generated/prisma';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
let _isHydrating = false;
export const getIsHydrating = () => _isHydrating;

export interface WindowData {
    id: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    zIndex: number;
    updatedAt: Date;
    mode: WindowMode;
};

interface WindowStore {
    windows: Map<string, WindowData>;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    updateWindow:
    (id: string, data: Partial<WindowData>) => void;
    registerWindow:
    (id: string, initialData: WindowData) => void;
    removeWindow: (id: string) => void;
    bringToFront: (id: string) => void;
    clearWindows: () => void;
    hydrateWindows: (windows: WindowData[]) => void;
}

export const useWindowStore = create<WindowStore>()(
    persist(
        (set) => ({
            windows: new Map(),
            _hasHydrated: false,
            _isHydrating: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            hydrateWindows: (incoming) => {
                _isHydrating = true;
                set(() => {
                    const newWindows = new Map<string, WindowData>();
                    incoming.forEach((w) => newWindows.set(w.id, w));
                    return { windows: newWindows };
                });
                // Reset synchronously after set() — Zustand flushes subscribers
                // synchronously in the same tick, so the guard fires before this line
                _isHydrating = false;
            },

            registerWindow: (id, initialData) =>
                set((state) => {
                    let newZIndex = initialData.zIndex;
                    if (state.windows.size > 0) {
                        const maxZ = Math.max(...Array.from(state.windows.values()).map(w => w.zIndex), 0);
                        newZIndex = maxZ + 1;
                    }
                    const newWindows = new Map(state.windows);
                    newWindows.set(id, { ...initialData, zIndex: newZIndex });
                    return { windows: newWindows };
                }),

            removeWindow: (id) =>
                set((state) => {
                    const newWindows = new Map(state.windows);
                    newWindows.delete(id);
                    return { windows: newWindows };
                }),

            updateWindow: (id, data) =>
                set((state) => {
                    const existing = state.windows.get(id);
                    if (!existing) return state;

                    const newWindows = new Map(state.windows);
                    const cleanData = Object.keys(data).includes("updatedAt") ? data : {
                        ...data,
                        updatedAt: new Date(),
                    };

                    newWindows.set(id, { ...existing, ...cleanData });
                    return { windows: newWindows };
                }),

            clearWindows: () =>
                set(() => {
                    const newWindows = new Map();
                    return { windows: newWindows }
                }),

            bringToFront: (id) =>
                set((state) => {
                    const maxZ = Math.max(...Array.from(state.windows.values()).map(w => w.zIndex), 0);
                    const newMap = new Map(state.windows);
                    newMap.set(id, { ...newMap.get(id)!, zIndex: maxZ + 1 });
                    return { windows: newMap };
                }),
        }),
        {
            name: "window-storage",
            onRehydrateStorage: () => (state) => {
                if (state) state.setHasHydrated(true)
            },
            storage: createJSONStorage(() => localStorage, {
                replacer: (_, value) => {
                    // Convert Map to Array for storage
                    if (value instanceof Map) return Array.from(value.entries());
                    return value;
                },
                reviver: (key, value) => {
                    if (key === "windows") return new Map(value as [string, WindowData][]);
                    return value;
                },
            }),
        }
    )
);