"use client"
import { useQuery } from "@tanstack/react-query"
import { fetchSavedWindowsMeta } from "@/app/surface/[surfaceId]/_actions";

export default function useSavedWindowsMeta(surfaceId: string) {
    return useQuery({
        queryKey: ["saved-windows-meta", surfaceId],
        queryFn: async () => {
            return await fetchSavedWindowsMeta(surfaceId);
        },
    });
}

