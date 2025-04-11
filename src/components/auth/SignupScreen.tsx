import { useState } from "react";
import { SignupForm } from "./signup/SignupForm";
import { SignupHeader } from "./signup/components/SignupHeader";
import { STEPS } from "./signup/types";
import { SignupProvider } from "@/context/SignupContext";

export function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="animate-in fade-in-0 zoom-in-95 flex flex-col border bg-background shadow-lg rounded-lg max-w-md w-full">
        <SignupHeader stepConfig={STEPS[currentStep]} />

        <div className="flex flex-col gap-6 p-6 bg-muted/50">
          <SignupProvider onStepChange={setCurrentStep}>
            <SignupForm />
          </SignupProvider>
        </div>
      </div>
    </div>
  );
}
