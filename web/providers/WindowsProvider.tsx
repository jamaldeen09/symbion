"use client"
import useSavedWindows from "@/hooks/windows/use-windows";
import { useWindowStore } from "@/hooks/windows/use-window-store";
import { useWindowsMeta } from "@/hooks/windows/use-windows-meta";
import { useEffect, useState } from "react";

export default function WindowsProvider({ surfaceId, children }: {
    surfaceId: string,
    children: React.ReactNode
}) {
    const [windowIds, setWindowIds] = useState<string[]>([]);
    const [isCountMismatched, setIsCountMismatched] = useState(false);
    const { data: windowsMeta } = useWindowsMeta(surfaceId);
    const { data: savedWindows } = useSavedWindows(surfaceId, windowIds, isCountMismatched)
    const { clearWindows, setHasHydrated, hydrateWindows } = useWindowStore();
    const _hasHydrated = useWindowStore.getState()._hasHydrated;

    useEffect(() => {
        if (!_hasHydrated || !windowsMeta) return;

        const localWindows = useWindowStore.getState().windows;
        const localHash = localStorage.getItem("surface_hash");

        const isSameCount = windowsMeta.count === localWindows.size;
        const isSameHash = localHash !== null && localHash === windowsMeta.surfaceHash;

        if (isSameCount && isSameHash) {
            setIsCountMismatched(false);
            setWindowIds([]);
            return;
        }

        if (!isSameCount) {
            if (windowsMeta.count <= 0) {
                clearWindows();
            } else {
                setIsCountMismatched(true);
            }
            return;
        }
        setIsCountMismatched(true);
    }, [windowsMeta, _hasHydrated]);

    useEffect(() => {
        if (!savedWindows || savedWindows.length === 0) return;

        const store = useWindowStore.getState();
        const localHash = localStorage.getItem("surface_hash");
        const serverHash = windowsMeta?.surfaceHash;

        if (store.windows.size > 0 && localHash === serverHash) {
            if (!store._hasHydrated) setHasHydrated(true);
            return;
        }

        hydrateWindows(savedWindows);
        if (serverHash) localStorage.setItem("surface_hash", serverHash);
        
        setHasHydrated(true);
    }, [savedWindows, windowsMeta, hydrateWindows, setHasHydrated]);
    return <>{children}</>
}; 