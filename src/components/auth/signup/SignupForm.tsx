import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { FormData, STEPS, ValidationStatus } from "./types";
import { AccountStep } from "./steps/AccountStep";
import { LoyaltyCardsStep } from "./steps/LoyaltyCardsStep";
import { UserInfoStep } from "./steps/UserInfoStep";
import { SignupProgress } from "./components/SignupProgress";
import { FormControls } from "./components/FormControls";

type SignupFormProps = {
  onStepChange: (step: number) => void;
};

export function SignupForm({ onStepChange }: SignupFormProps) {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Form data for all steps
  const [formData, setFormData] = useState<FormData>({
    // Account info
    email: "",
    password: "",
    
    // Loyalty cards
    connectedLoyaltyCard: null,
    migrosEmail: "",
    migrosPassword: "",
    coopEmail: "",
    coopPassword: "",
    
    // User info
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    dietaryType: "",
    allergens: [],
    favoriteCuisines: [],
    dislikedCuisines: [],
    nutritionalGoal: "",
    nutritionalGoalOther: "",
    sportsFrequency: "",
    medicalConditions: [],
    otherMedicalCondition: "",
  });

  // Validation states
  const [migrosValidationStatus, setMigrosValidationStatus] = useState<ValidationStatus>('idle');
  const [coopValidationStatus, setCoopValidationStatus] = useState<ValidationStatus>('idle');
  
  // Connect options
  const [connectMigros, setConnectMigros] = useState(false);
  const [connectCoop, setConnectCoop] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

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
    if (currentStep === STEPS.length - 1) {
      void handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (currentStep < STEPS.length - 1) {
      nextStep();
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        connectedLoyaltyCard: formData.connectedLoyaltyCard,
        migrosEmail: connectMigros ? formData.migrosEmail : undefined,
        migrosPassword: connectMigros ? formData.migrosPassword : undefined,
        coopEmail: connectCoop ? formData.coopEmail : undefined,
        coopPassword: connectCoop ? formData.coopPassword : undefined,
      });
      
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

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AccountStep 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        );
      case 1:
        return (
          <LoyaltyCardsStep 
            formData={formData}
            updateFormData={updateFormData}
            migrosValidationStatus={migrosValidationStatus}
            coopValidationStatus={coopValidationStatus}
            setMigrosValidationStatus={setMigrosValidationStatus}
            setCoopValidationStatus={setCoopValidationStatus}
            connectMigros={connectMigros}
            connectCoop={connectCoop}
            setConnectMigros={setConnectMigros}
            setConnectCoop={setConnectCoop}
          />
        );
      case 2:
        return (
          <UserInfoStep 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  // Check if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 0) {
      return !!formData.email && !!formData.password;
    }
    return true;
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="flex flex-col gap-6">
      {renderStep()}
      
      <div className="flex flex-col gap-4 mt-2">
        <SignupProgress 
          steps={STEPS.length} 
          currentStep={currentStep} 
        />
        
        <FormControls 
          currentStep={currentStep}
          totalSteps={STEPS.length}
          isLoading={isLoading}
          canProceed={canProceed()}
          prevStep={prevStep}
          nextStep={nextStep}
          skipStep={skipStep}
          handleSubmit={handleSubmit}
        />
      </div>
    </form>
  );
}
