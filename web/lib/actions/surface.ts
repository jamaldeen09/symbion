"use server"
import { Prisma } from "@/generated/prisma"
import { checkAuth } from "./auth";
import { getPrismaErrorMessage } from "../utils";
import { prisma } from "@/config/prisma";

export type FetchSurfaceDataFieldsToSelect = Omit<(keyof Prisma.SurfaceSelect), "nodes" | "windows" | "userId" | "user" | "agentMessages">
export async function fetchSurfaceData(fieldsToSelect?: FetchSurfaceDataFieldsToSelect[]) {
    try {
        const result = await checkAuth();
        if ((!result.success && result.error) || !result.data?.userId) return {
            success: false,
            message: "An unexpected error occured with our auth provider while attempting to fetch your data",
        }

        const userId = result.data.userId;
        const select: Record<any, any> = {};

        if (fieldsToSelect && fieldsToSelect.length > 0)
            fieldsToSelect.forEach((field) => select[field as string] = true)

        const surface = await prisma.surface.findUnique({
            where: { userId },
            select: {
                id: true,
                ...select,
            },
        });

        if (!surface) return {
            success: false,
            message: "Surface was not found",
            error: { code: "NOT_FOUND" }
        }

        return {
            success: true,
            message: "Surface data has been successfully fetched",
            data: { surface }
        }
    } catch (err) {
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
}