import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WindowData } from '../windows/use-window-store';
import { syncSurfaceState } from '@/app/surface/[surfaceId]/_actions';

interface SyncSurfaceStateParams {
    surfaceId: string;
    hash: string;
    windows: WindowData[];
}

export function useSyncSurfaceState() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ surfaceId, hash, windows }: SyncSurfaceStateParams) => {
            const result = await syncSurfaceState(surfaceId, hash, windows);
            if (!result.success)
                throw result

            return result;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["windows-meta", variables.surfaceId] });
        },
    });
}