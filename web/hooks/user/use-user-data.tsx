"use client"
import { fetchUserData, FetchUserDataFieldsToSelect } from '@/lib/actions/user';
import { useQuery } from '@tanstack/react-query';

export function useUserData(fieldsToSelect?: FetchUserDataFieldsToSelect[]) {
    return useQuery({
        queryKey: ["user", fieldsToSelect ? [...fieldsToSelect].sort() : []],
        queryFn: async () => {
            const result = await fetchUserData(fieldsToSelect);
            return result.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: true,
        retry: 1,
    });
}