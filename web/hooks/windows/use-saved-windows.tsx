"use client"
import { useQuery } from "@tanstack/react-query";
import { fetchSavedWindows } from "@/app/surface/[surfaceId]/_actions";

export default function useSavedWindows(surfaceId: string, windowIds?: string[]) {
    return useQuery({
        queryKey: ["saved-windows", surfaceId, { windowIds }],
        queryFn: async () => {
            const result = await fetchSavedWindows(surfaceId, windowIds);
            return result
        },
        enabled: !!windowIds && windowIds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
}