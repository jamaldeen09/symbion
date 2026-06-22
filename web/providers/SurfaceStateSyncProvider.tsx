"use client"
import { generateSurfaceHash } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash"
import { getIsHydrating, useWindowStore } from "@/hooks/windows/use-window-store";
import { useSyncSurfaceState } from "@/hooks/surface/use-sync-surface-state";

export default function SurfaceStateSyncProvider({ surfaceId }: { surfaceId: string; }) {
    const { mutate } = useSyncSurfaceState()
    const isFirstSyncRef = useRef(false);
    const lastSyncedHashRef = useRef<string | null>(
        typeof window !== "undefined" ?
            localStorage.getItem("last_synced_hash") : null
    );

    const debouncedSync = useMemo(() => {
        return debounce(async (windows) => {
            const newHash = await generateSurfaceHash({ windows });

            // Skip if no changes (if hashes are the same then windows are the same, no in-between)
            if (newHash === lastSyncedHashRef.current)
                return;

            // Perform sync
            mutate({
                surfaceId,
                hash: newHash,
                windows: Array.from(windows.values()),
            }, {
                onSuccess: () => {
                    lastSyncedHashRef.current = newHash;
                    localStorage.setItem("last_synced_hash", newHash);
                    localStorage.setItem("surface_hash", newHash);
                }
            });
        }, 1000);
    }, [surfaceId, mutate]);


    useEffect(() => {
        isFirstSyncRef.current = true;

        const unsub = useWindowStore.subscribe(async (state) => {
            if (!state._hasHydrated || getIsHydrating()) return;

            if (isFirstSyncRef.current) {
                isFirstSyncRef.current = false;
                return;
            }

            debouncedSync(state.windows);
        });


        return () => {
            unsub();
            debouncedSync.cancel();
        };
    }, [debouncedSync]);
    return null;
}