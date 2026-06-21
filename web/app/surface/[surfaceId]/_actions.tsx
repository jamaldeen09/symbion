"use server"

import { WindowData } from "@/hooks/windows/use-window-store";

export const fetchSavedWindows = async (surfaceId: string, windowIds?: string[]) => {
    return [] as WindowData[]
};

export const removeWindowFromSaved = async (windowId: string) => {
    return "OK";
};

export const fetchSavedWindowsMeta = async (surfaceId: string) => {
    return {
        surfaceHash: "this is a hash",
        count: 0,
        manifest: [] as { updatedAt: number, id: string }[],
    }
}