import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { STEPS, ValidationStatus, RetailerType } from "./types";
import { SignupProgress } from "./components/SignupProgress";
import { FormControls } from "./components/FormControls";
import { ProfileForm, ProfileData, defaultProfile } from "@/components/auth/UserProfile";

// Account-specific components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RetailerCredentials } from "./components/RetailerCredentials";
import { nutriBuddyApi } from "@/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  
  // Profile data using the shared component
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);

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

  const handleToggleChange = (retailer: RetailerType, isChecked: boolean) => {
    if (retailer === 'migros') {
      setConnectMigros(isChecked);
      // Reset validation when toggling off
      if (!isChecked) {
        setMigrosValidationStatus('idle');
        setMigrosEmail("");
        setMigrosPassword("");
      }
    } else {
      setConnectCoop(isChecked);
      // Reset validation when toggling off
      if (!isChecked) {
        setCoopValidationStatus('idle');
        setCoopEmail("");
        setCoopPassword("");
      }
    }
  };

  const validateCredentials = async (retailer: RetailerType) => {
    const isForMigros = retailer === 'migros';
    const statusSetter = isForMigros ? setMigrosValidationStatus : setCoopValidationStatus;
    const email = isForMigros ? migrosEmail : coopEmail;
    const password = isForMigros ? migrosPassword : coopPassword;
    
    if (!email || !password) {
      toast.error(`Please enter your ${retailer} credentials`);
      return;
    }

    statusSetter('validating');
    
    try {
      const isValid = await nutriBuddyApi.validateCredentials(retailer, email, password);
      
      if (isValid) {
        statusSetter('valid');
        toast.success(`${retailer.charAt(0).toUpperCase() + retailer.slice(1)} credentials validated successfully`);
      } else {
        statusSetter('invalid');
        toast.error(`Invalid ${retailer} credentials`);
      }
    } catch (error) {
      statusSetter('invalid');
      toast.error(`Failed to validate ${retailer} credentials`);
      console.error(`${retailer} validation error:`, error);
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
        <Accordion type="single" collapsible defaultValue="account-info" className="w-full">
          <AccordionItem value="account-info" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Account Information
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Step 2: Loyalty Cards */}
      {currentStep === 1 && (
        <Accordion type="single" collapsible defaultValue="loyalty-cards" className="w-full">
          <AccordionItem value="loyalty-cards" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Loyalty Cards
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base mb-1 block">Migros Cumulus</Label>
                    <p className="text-muted-foreground text-sm">Connect your Migros purchase history</p>
                  </div>
                  <Switch
                    checked={connectMigros}
                    onCheckedChange={(checked) => handleToggleChange('migros', checked)}
                  />
                </div>
                
                {connectMigros && (
                  <RetailerCredentials
                    retailer="migros"
                    email={migrosEmail}
                    password={migrosPassword}
                    validationStatus={migrosValidationStatus}
                    onEmailChange={setMigrosEmail}
                    onPasswordChange={setMigrosPassword}
                    onValidate={() => validateCredentials('migros')}
                  />
                )}
                
                <div className="border-t my-2"></div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base mb-1 block">Coop Supercard</Label>
                    <p className="text-muted-foreground text-sm">Connect your Coop purchase history</p>
                  </div>
                  <Switch
                    checked={connectCoop}
                    onCheckedChange={(checked) => handleToggleChange('coop', checked)}
                  />
                </div>
                
                {connectCoop && (
                  <RetailerCredentials
                    retailer="coop"
                    email={coopEmail}
                    password={coopPassword}
                    validationStatus={coopValidationStatus}
                    onEmailChange={setCoopEmail}
                    onPasswordChange={setCoopPassword}
                    onValidate={() => validateCredentials('coop')}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Step 3: User Information */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <ProfileForm 
            profile={profileData}
            onChange={setProfileData}
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
