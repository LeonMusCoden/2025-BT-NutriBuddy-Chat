import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { STEPS, ValidationStatus } from "./types";
import { SignupProgress } from "./components/SignupProgress";
import { FormControls } from "./components/FormControls";
import { useProfileFormValidation } from "@/hooks/useProfileValidation";
import { ProfileForm, defaultProfile, ProfileData } from "@/components/auth/UserProfile";
import { AccountStep } from "./steps/AccountStep";
import { LoyaltyCardsStep } from "./steps/LoyaltyCardsStep";

type SignupFormProps = {
  onStepChange: (step: number) => void;
};

export function SignupForm({ onStepChange }: SignupFormProps) {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Basic account data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Loyalty card data
  const [connectMigros, setConnectMigros] = useState(false);
  const [connectCoop, setConnectCoop] = useState(false);
  const [migrosEmail, setMigrosEmail] = useState("");
  const [migrosPassword, setMigrosPassword] = useState("");
  const [coopEmail, setCoopEmail] = useState("");
  const [coopPassword, setCoopPassword] = useState("");
  const [migrosValidationStatus, setMigrosValidationStatus] = useState<ValidationStatus>('idle');
  const [coopValidationStatus, setCoopValidationStatus] = useState<ValidationStatus>('idle');
  
  // We'll use our validation hook for the profile data part
  const { 
    formData: profileData, 
    errors, 
    touchedFields,
    handleChange,
    validateForm,
  } = useProfileFormValidation(defaultProfile, async () => {
    // This will be used just for validation, not actual submission
    // The actual submission happens in handleSubmit
  });
  
  // Create a wrapper for ProfileForm's onChange to use our validation
  const handleProfileChange = (newData: ProfileData) => {
    // Find which field changed
    Object.keys(newData).forEach((key) => {
      const k = key as keyof ProfileData;
      if (profileData[k] !== newData[k]) {
        handleChange(k, newData[k]);
      }
    });
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
      // Validate current step
      if (currentStep === 0) {
        // Validate email/password
        if (!email || !password) {
          toast.error("Please fill in all required fields");
          return;
        }
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }
      }
      
      nextStep();
      return;
    }
    
    // Validate final step if we're submitting the form
    if (currentStep === 2) {
      const isFormValid = validateForm();
      
      if (!isFormValid) {
        toast.error("Please correct the errors in the form");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Determine connected loyalty card
      let connectedLoyaltyCard: 'migros' | 'coop' | 'both' | null = null;
      if (connectMigros && connectCoop) {
        connectedLoyaltyCard = 'both';
      } else if (connectMigros) {
        connectedLoyaltyCard = 'migros';
      } else if (connectCoop) {
        connectedLoyaltyCard = 'coop';
      }
      
      await signup({
        email,
        password,
        connectedLoyaltyCard,
        migrosEmail: connectMigros ? migrosEmail : undefined,
        migrosPassword: connectMigros ? migrosPassword : undefined,
        coopEmail: connectCoop ? coopEmail : undefined,
        coopPassword: connectCoop ? coopPassword : undefined,
        profile_data: profileData
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

  // Check if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 0) {
      return !!email && !!password;
    }
    // For other steps, we allow proceeding even with errors
    return true;
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If Enter is pressed, prevent default submission and handle step navigation
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (currentStep === STEPS.length - 1) {
        void handleSubmit();
      } else if (canProceed()) {
        nextStep();
      }
    }
  };

  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        handleSubmit(e); 
      }} 
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-6"
    >
      {/* Step 1: Account Information */}
      {currentStep === 0 && (
        <AccountStep 
          formData={{ ...profileData, email, password }}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            if (name === 'email') setEmail(value);
            if (name === 'password') setPassword(value);
          }}
        />
      )}
      
      {/* Step 2: Loyalty Cards */}
      {currentStep === 1 && (
        <LoyaltyCardsStep 
          formData={{ 
            ...profileData,
            migrosEmail,
            migrosPassword,
            coopEmail,
            coopPassword,
            connectedLoyaltyCard: connectMigros && connectCoop ? 'both' : 
                                  connectMigros ? 'migros' : 
                                  connectCoop ? 'coop' : null
          }}
          updateFormData={(updates) => {
            if ('migrosEmail' in updates) setMigrosEmail(updates.migrosEmail || '');
            if ('migrosPassword' in updates) setMigrosPassword(updates.migrosPassword || '');
            if ('coopEmail' in updates) setCoopEmail(updates.coopEmail || '');
            if ('coopPassword' in updates) setCoopPassword(updates.coopPassword || '');
          }}
          migrosValidationStatus={migrosValidationStatus}
          coopValidationStatus={coopValidationStatus}
          setMigrosValidationStatus={setMigrosValidationStatus}
          setCoopValidationStatus={setCoopValidationStatus}
          connectMigros={connectMigros}
          connectCoop={connectCoop}
          setConnectMigros={setConnectMigros}
          setConnectCoop={setConnectCoop}
        />
      )}
      
      {/* Step 3: User Information - Use ProfileForm directly instead of UserInfoStep */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-2">
            This information helps us provide better nutrition advice based on your profile.
          </p>
          
          <ProfileForm 
            profile={profileData}
            onChange={handleProfileChange}
            errors={errors}
            touchedFields={touchedFields}
            defaultAccordionValue="basic-info"
          />
        </div>
      )}
      
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
