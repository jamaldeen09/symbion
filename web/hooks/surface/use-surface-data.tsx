"use client"
import { useQuery } from '@tanstack/react-query';
import { fetchSurfaceData, FetchSurfaceDataFieldsToSelect } from '@/lib/actions/surface';

export function useSurfaceData(fieldsToSelect?: FetchSurfaceDataFieldsToSelect[]) {
    return useQuery({
        queryKey: ["surface", fieldsToSelect ? [...fieldsToSelect].sort() : []],
        queryFn: async () => {
            const result = await fetchSurfaceData(fieldsToSelect);
            return result.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    })
}
