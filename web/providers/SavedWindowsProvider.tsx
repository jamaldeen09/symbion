"use client"
import useSavedWindows from "@/hooks/windows/use-saved-windows";
import useSavedWindowsMeta from "@/hooks/windows/use-saved-windows-meta";
import { useWindowStore } from "@/hooks/windows/use-window-store";
import { useEffect, useState } from "react";

export default function SavedWindowsProvider({ surfaceId, children }: {
    surfaceId: string,
    children: React.ReactNode
}) {
    const [windowIds, setWindowIds] = useState<string[]>([]);
    const { data: savedWindowsMeta } = useSavedWindowsMeta(surfaceId);
    const { data: savedWindows } = useSavedWindows(surfaceId, windowIds)
    const { registerWindow } = useWindowStore();

    useEffect(() => {
        if (!savedWindowsMeta) return;
        const localWindows = useWindowStore.getState().windows;
        const localHash = localStorage.getItem("surface_hash");

        const isSameCount = savedWindowsMeta.count === localWindows.size;
        const isSameHash = localHash !== null && localHash === savedWindowsMeta.surfaceHash;

        // Check if our local window storage
        // has the same amount of windows
        if (isSameCount || isSameHash || savedWindowsMeta.count <= 0) return;
        const staleWindowIds = savedWindowsMeta.manifest
            .filter(({ updatedAt, id }) => {
                const local = localWindows.get(id);
                return !local || updatedAt !== local.updatedAt;
            }).map(item => item.id);


        if (staleWindowIds.length > 0) 
            setWindowIds(staleWindowIds);
    }, [savedWindowsMeta]);

    useEffect(() => {
        if (!savedWindows || savedWindows.length <= 0) return;

        savedWindows.forEach((win) => {
            if (!useWindowStore.getState().windows.has(win.id))
                registerWindow(win.id, win);
        });
    }, [savedWindows, registerWindow]);
    return <>{children}</>
}; 