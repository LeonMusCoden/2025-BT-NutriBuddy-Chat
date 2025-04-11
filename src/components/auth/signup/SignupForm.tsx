// src/components/auth/signup/SignupForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { STEPS, SignupFormData } from "./types";
import { SignupProgress } from "./components/SignupProgress";
import { FormControls } from "./components/FormControls";
import { AccountStep } from "./steps/AccountStep";
import { LoyaltyCardsStep } from "./steps/LoyaltyCardsStep";
import { ProfileStep } from "./steps/ProfileStep";
import { defaultProfile } from "../UserProfile";

type SignupFormProps = {
  onStepChange: (step: number) => void;
};

export function SignupForm({ onStepChange }: SignupFormProps) {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Step validation state
  const [isStepValid, setIsStepValid] = useState(false);

  // Initialize form data
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    connectedLoyaltyCard: null,
    migros: {
      email: "",
      password: "",
      validationStatus: 'idle',
      isConnected: false
    },
    coop: {
      email: "",
      password: "",
      validationStatus: 'idle',
      isConnected: false
    },
    profile: defaultProfile
  });

  // Helper to update form data
  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange(newStep);
    }
  };

  const skipStep = () => {
    // Set default values for the current step being skipped
    if (currentStep === 1) {
      updateFormData({
        connectedLoyaltyCard: null,
        migros: {
          email: "",
          password: "",
          validationStatus: 'idle',
          isConnected: false
        },
        coop: {
          email: "",
          password: "",
          validationStatus: 'idle',
          isConnected: false
        }
      });
    } else if (currentStep === 2) {
      console.log("DEBUG");
      updateFormData({
        profile: { ...defaultProfile }
      });
    }

    if (currentStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setIsStepValid(true);
      nextStep();
    }
  };

  // Form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Prepare signup data
      const signupData = {
        email: formData.email,
        password: formData.password,
        connectedLoyaltyCard: formData.connectedLoyaltyCard,
        profile_data: formData.profile
      };

      // Add retailer credentials if connected
      if (formData.migros.isConnected) {
        Object.assign(signupData, {
          migrosEmail: formData.migros.email,
          migrosPassword: formData.migros.password
        });
      }

      if (formData.coop.isConnected) {
        Object.assign(signupData, {
          coopEmail: formData.coop.email,
          coopPassword: formData.coop.password
        });
      }

      // await signup(signupData);
      console.log(signupData);

      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account", {
        description: "Please try again or use a different email",
        richColors: true,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step validation change
  const handleValidationChange = (isValid: boolean) => {
    setIsStepValid(isValid);
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-6"
    >
      {/* Step 1: Account Information */}
      {currentStep === 0 && (
        <AccountStep
          email={formData.email}
          password={formData.password}
          updateData={(updates) => updateFormData(updates)}
          onValidationChange={handleValidationChange}
        />
      )}

      {/* Step 2: Loyalty Cards */}
      {currentStep === 1 && (
        <LoyaltyCardsStep
          migros={formData.migros}
          coop={formData.coop}
          updateData={(updates) => updateFormData(updates)}
          onValidationChange={handleValidationChange}
        />
      )}

      {/* Step 3: User Profile */}
      {currentStep === 2 && (
        <ProfileStep
          profile={formData.profile}
          updateData={(profileUpdates) => updateFormData({ profile: { ...formData.profile, ...profileUpdates } })}
          onValidationChange={handleValidationChange}
        />
      )}

      <div className="flex flex-col gap-4 mt-2">
        <SignupProgress
          steps={STEPS.length}
          currentStep={currentStep}
        />

        <FormControls
          isLoading={isLoading}
          isStepValid={isStepValid}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSkip={skipStep}
          onSubmit={handleSubmit}
        />
      </div>
    </form>
  );
}
