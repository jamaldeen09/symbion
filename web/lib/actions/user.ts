"use server"
import { checkAuth } from "./auth"
import { prisma } from "@/config/prisma";
import { Prisma } from "@/generated/prisma";
import { getPrismaErrorMessage } from "../utils";

export type FetchUserDataFieldsToSelect = Omit<(keyof Prisma.UserSelect), "surface"  | "projects" | "windows" | "_count">
export const fetchUserData = async (fieldsToSelect?: FetchUserDataFieldsToSelect[]) => {
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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                ...select,
            }
        });

        if (!user) return {
            success: false,
            message: "Your account was not found in our database. Please create an account",
            error: {
                code: "NOT_FOUND",
                userId,
            }
        }

        return {
            success: true,
            message: "Successfully fetched the requested user's data",
            data: { user },
        }
    } catch (err) {
        return {
            success: false,
            message: getPrismaErrorMessage(err),
        }
    }
}