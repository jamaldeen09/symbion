"use client"
import { useQuery } from "@tanstack/react-query"
import { fetchSavedArtifactWindowsMeta } from "../../surface/[surfaceId]/_actions";

export default function useSavedArtifactWindowsMeta(surfaceId: string) {
    return useQuery({
        queryKey: ["saved-artifact-windows-meta", surfaceId],
        queryFn: async () => {
            return await fetchSavedArtifactWindowsMeta(surfaceId);
        },
    });
}

