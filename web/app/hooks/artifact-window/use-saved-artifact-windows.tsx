"use client"
import { useQuery } from "@tanstack/react-query";
import { fetchSavedArtifactWindows } from "../../surface/[surfaceId]/_actions";

export default function useSavedArtifactWindows(surfaceId: string, artifactIds?: string[]) {
    return useQuery({
        queryKey: ["saved-artifact-windows", surfaceId, { artifactIds }],
        queryFn: async () => {
            const result = await fetchSavedArtifactWindows(surfaceId, artifactIds);
            return result
        },
        enabled: !!artifactIds && artifactIds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
}