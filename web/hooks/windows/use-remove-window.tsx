import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeWindow } from '@/app/surface/[surfaceId]/_actions';
import { useWindowStore } from '../windows/use-window-store';

export function useRemoveWindow(surfaceId: string) {
    const queryClient = useQueryClient();
    const removeWindowFromStore = useWindowStore((s) => s.removeWindow);

    return useMutation({
        mutationFn: async (windowId: string) => {
            const result = await removeWindow(windowId);
            if (!result.success)
                throw result;

            return result;
        },
        onMutate: (windowId) => {
            // Snapshot before removing
            const snapshot = useWindowStore.getState().windows.get(windowId);
            removeWindowFromStore(windowId);
            return { snapshot };
        },

        onError: (_, windowId, context) => {
            if (context?.snapshot) 
                useWindowStore.getState().registerWindow(windowId, context.snapshot);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["windows-meta", surfaceId] });
        },
    });
}