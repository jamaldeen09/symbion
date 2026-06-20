"use client"
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCompleteOnboarding } from "@/app/hooks/auth/use-complete-onboarding";

export default function OnboardingForm() {
    const { user } = useUser();
    const router = useRouter();
    const [completing, setCompleting] = useState(false);
    const { mutate } = useCompleteOnboarding();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setCompleting(true)

        mutate(formData, {
            onSuccess: async () => {
                await user?.reload();
                router.push("/home");
                setCompleting(false)
            },
            onError: (error) => {
                alert(error.message);
                setCompleting(false);
            }
        });
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                name="username"
                placeholder="Enter username"
                className="border p-2 rounded text-black"
                required
            />
            <button
                type="submit"
                disabled={completing}
                className="bg-blue-500 text-white p-2 rounded"
            >
                {completing ? "Saving..." : "Complete Setup"}
            </button>
        </form>
    )
}