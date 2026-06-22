"use client"
import { fetchWindows } from "@/app/surface/[surfaceId]/_actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useWindows(surfaceId: string, windowIds?: string[], isCountMismatched?: boolean) { 
    useEffect(() => {
        console.log("useWindows() is running!");
        console.log("Enabled:", (!!windowIds && windowIds.length > 0) || (isCountMismatched !== undefined && isCountMismatched === true));
    }, [isCountMismatched, surfaceId, windowIds]);

    return useQuery({
        queryKey: ["windows", surfaceId, { 
            windowIds,
            isCountMismatched,
        }],
        queryFn: async () => {
            const result = await fetchWindows(surfaceId, windowIds);
            if (!result.success || !result.data)
                throw result;

            return result.data.windows
        },
        enabled: (!!windowIds && windowIds.length > 0) || (!!isCountMismatched && isCountMismatched === true),
        staleTime: 5 * 60 * 1000,
    });
}