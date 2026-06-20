"use client"
import { useArtifactWindowStore } from "@/app/hooks/artifact-window/use-artifact-window-store";
import { generateSurfaceHash } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash"

export default function SurfaceStateSyncProvider({ surfaceId }: { surfaceId: string; }) {
    const lastSyncedHashRef = useRef<string | null>(
        typeof window !== "undefined" ?
            localStorage.getItem("last_synced_hash") : null
    );

    const debouncedSync = useMemo(() => {
        return debounce(async (windows) => {
            const newHash = await generateSurfaceHash({ windows });

            // Update the local tracking hash for the UI
            localStorage.setItem("surface_hash", newHash);

            // Has the hash changed since the LAST SYNC?
            if (newHash !== lastSyncedHashRef.current) {
                // Perform db sync
                // await syncToDatabase(windows, hash); // TODO: create this server action after setting up database

                // Update the ref so we don't sync again until the next change
                lastSyncedHashRef.current = newHash;
                localStorage.setItem("last_synced_hash", newHash);

                console.log("Saved last synced hash....")
            }
        }, 1000);
    }, [surfaceId]);

    useEffect(() => {
        const unsub = useArtifactWindowStore.subscribe(async (state) => {
            if (!state._hasHydrated) return;
            debouncedSync(state.windows);
        });

        return () => {
            unsub();
            debouncedSync.cancel();
        };
    }, []);



    return null;
}