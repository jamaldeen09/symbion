"use server"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function checkAuth () {
    try {
        const { userId, isAuthenticated } = await auth();
        if (!isAuthenticated || !userId) redirect("/");
        return { success: true, data: { userId } };
    } catch (err) {
        console.error("checkAuth() server action error:", err);
        return { success: false, error: err };
    }
}