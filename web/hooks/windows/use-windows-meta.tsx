"use client"
import { fetchWindowsMeta } from "@/app/surface/[surfaceId]/_actions";
import { useQuery } from "@tanstack/react-query"


export function useWindowsMeta(surfaceId: string) {
    return useQuery({
        queryKey: ["windows-meta", surfaceId],
        queryFn: async () => {
            const result = await fetchWindowsMeta(surfaceId);

            if (!result.success && result.error || !result.data) 
                throw result;
            
            return result.data.meta;
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        enabled: !!surfaceId,
        retry: 1,
    });
}