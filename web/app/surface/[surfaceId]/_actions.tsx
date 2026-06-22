"use server"
import { prisma } from "@/config/prisma";
import { WindowData } from "@/hooks/windows/use-window-store";
import { getPrismaErrorMessage } from "@/lib/utils";


export const fetchWindows = async (surfaceId: string, windowIds?: string[], howMany?: number) => {
    try {
        const windows = await prisma.window.findMany({
            where: {
                surfaceId, id: windowIds && windowIds.length > 0
                    ? { in: windowIds }
                    : undefined
            },

            take: howMany,
            select: {
                id: true,
                xPos: true,
                yPos: true,
                width: true,
                height: true,
                zIndex: true,
                updatedAt: true,
                mode: true,
            }
        });

        return {
            success: true,
            message: `Successfully fetched windows for surface: ${surfaceId}`,
            data: { windows }
        }
    } catch (err) {
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
};

export const removeWindow = async (windowId: string) => {
    try {
        await prisma.window.delete({
            where: { id: windowId },
            select: { id: true }
        });

        return {
            success: true,
            message: "Window has been successfully deleted"
        }
    } catch (err) {
        console.error("removeWindow sever action error:", err);
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
};


export const fetchWindowsMeta = async (surfaceId: string) => {
    try {
        const result = await prisma.surface.findUnique({
            where: { id: surfaceId },
            select: {
                _count: {
                    select: { windows: true }
                },

                windows: { select: { updatedAt: true, id: true } },
                hash: true
            }
        });

        if (!result) return {
            success: false,
            message: "Surface was not found",
            error: {
                code: "NOT_FOUND",
                surfaceId,
            }
        }

        const meta = {
            surfaceHash: result.hash,
            count: result._count.windows,
            manifest: result.windows
        };

        return {
            success: true,
            message: "Successfully fetched windows meta",
            data: { meta }
        }
    } catch (err) {
        console.error("fetchWindowMeta sever action error:", err)
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
};

export const syncSurfaceState = async (surfaceId: string, hash: string, windows: WindowData[]) => {
    try {
        await prisma.$transaction([
            prisma.window.deleteMany({ where: { surfaceId } }),
            prisma.window.createMany({
                data: windows.map((window) => ({
                    id: window.id,
                    surfaceId,
                    xPos: window.xPos,
                    yPos: window.yPos,
                    width: window.width,
                    height: window.height,
                    zIndex: window.zIndex,
                    mode: window.mode,
                }))
            }),
            prisma.surface.update({
                where: { id: surfaceId },
                data: { hash }
            })
        ]);

        return {
            success: true,
            message: "Surface state has been successfully synced"
        }
    } catch (err) {
        console.error("syncSurfaceState() sever action error:", err)
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
}