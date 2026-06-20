"use server"
import { prisma } from "@/config/prisma";
import { getPrismaErrorMessage } from "@/lib/utils";
import { usernameSchema } from "@/lib/validation-schemas/username-schema";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
    const { userId, isAuthenticated } = await auth();
    const client = await clerkClient();

    if (!isAuthenticated || !userId) return ({
        success: false,
        message: "No active session found. Please sign in and try again",
    });

    const username = formData.get("username");
    const result = usernameSchema.safeParse({ username });

    if (!result.success) {
        const firstErrorMessage = result.error.issues[0]?.message || "Invalid username.";
        return {
            success: false,
            message: "Invalid username. Please make sure it passes all the requirements before trying again",
            error: {
                validationError: {
                    detectiveName: firstErrorMessage,
                    issues: result.error.issues.map(issue => issue.message)
                }
            }
        };
    };

    const cleanUsername = (username as string).trim().toLowerCase()
    try {

        // Check if the username is already in use
        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: cleanUsername,
                    mode: 'insensitive',
                }
            },
            select: { id: true }
        });

        if (existingUser) return {
            success: false,
            message: "A user with this username already exists",
        }

        await prisma.user.update({
            where: { id: userId },
            data: { username: cleanUsername }
        });

        try {
            await client.users.updateUser(userId, {
                publicMetadata: { onboardingComplete: true }
            });
        } catch (clerkError) {
            // If Clerk fails, roll back the database update so both
            // stay in sync — user remains on onboarding and can retry
            await prisma.user.update({
                where: { id: userId },
                data: { username: cleanUsername }
            });
            throw new Error("Failed to complete onboarding. Please try again.");
        }

        return {
            success: true,
            message: "Onboarding completed successfully",
        }
    } catch (err) {
        console.error("Onboarding server action error:", err);
        return {
            success: false,
            message: getPrismaErrorMessage(err, (err as Error).message),
        };
    }
}