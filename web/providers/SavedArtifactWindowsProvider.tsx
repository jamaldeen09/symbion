"use client"
import { useArtifactWindowStore } from "@/app/hooks/artifact-window/use-artifact-window-store";
import useSavedArtifactWindows from "@/app/hooks/artifact-window/use-saved-artifact-windows";
import useSavedArtifactWindowsMeta from "@/app/hooks/artifact-window/use-saved-artifact-windows-meta";
import { useEffect, useState } from "react";

export default function SavedArtifactWindowsProvider({ surfaceId, children }: {
    surfaceId: string,
    children: React.ReactNode
}) {
    const [artifactIds, setArtifactIds] = useState<string[]>([]);
    const { data: savedArtifactWindowsMeta } = useSavedArtifactWindowsMeta(surfaceId);
    const { data: savedArtifactWindows } = useSavedArtifactWindows(surfaceId, artifactIds)
    const { registerArtifactWindow } = useArtifactWindowStore();

    useEffect(() => {
        if (!savedArtifactWindowsMeta) return;
        const localArtifactWindows = useArtifactWindowStore.getState().windows;
        const localHash = localStorage.getItem("surface_hash");

        const isSameCount = savedArtifactWindowsMeta.count === localArtifactWindows.size;
        const isSameHash = localHash !== null && localHash === savedArtifactWindowsMeta.surfaceHash;

        // Check if our local artifact window storage
        // has the same amount of artifact windows
        if (isSameCount || isSameHash || savedArtifactWindowsMeta.count <= 0) return;
        const staleArtifactIds = savedArtifactWindowsMeta.manifest
            .filter(({ updatedAt, id }) => {
                const local = localArtifactWindows.get(id);
                return !local || updatedAt !== local.updatedAt;
            }).map(item => item.id);

        if (staleArtifactIds.length > 0) 
            setArtifactIds(staleArtifactIds);
    }, [savedArtifactWindowsMeta]);

    useEffect(() => {
        if (!savedArtifactWindows || savedArtifactWindows.length <= 0) return;

        savedArtifactWindows.forEach((win) => {
            if (!useArtifactWindowStore.getState().windows.has(win.id))
                registerArtifactWindow(win.id, win);
        });
    }, [savedArtifactWindows, registerArtifactWindow]);
    return <>{children}</>
}; 