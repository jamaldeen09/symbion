import { completeOnboarding } from "@/app/onboarding/_actions";
import { useMutation } from "@tanstack/react-query";

export const useCompleteOnboarding = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await completeOnboarding(formData);
            if (!result.success) {
                throw new Error(result.message);
            };
            
            return result;
        },
    });
};