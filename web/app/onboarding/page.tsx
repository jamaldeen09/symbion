import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl mb-4">Choose your username</h1>
           <OnboardingForm />
        </div>
    );
}