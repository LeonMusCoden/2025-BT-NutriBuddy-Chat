import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStepValidation, ValidationResult } from "@/hooks/useStepValidation";

type AccountStepData = {
  email: string;
  password: string;
};

const validateAccount = (data: AccountStepData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Email validation
  if (!!data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  
  // Password validation
  if (!!data.password && data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  
  return {
    isValid: (Object.keys(errors).length === 0 && !!data.email && !!data.password),
    errors
  };
};

type AccountStepProps = {
  email: string;
  password: string;
  updateData: (updates: Partial<{ email: string; password: string }>) => void;
  onValidationChange: (isValid: boolean) => void;
};

export function AccountStep({ 
  email,
  password,
  updateData,
  onValidationChange
}: AccountStepProps) {
  const navigate = useNavigate();
  
  const { 
    data, 
    updateField, 
    isValid, 
    hasError, 
    getError, 
    touchAllFields 
  } = useStepValidation<AccountStepData>(
    { email, password },
    validateAccount
  );
  
  // When local form data changes, update the parent component
  useEffect(() => {
    if (data.email !== email || data.password !== password) {
      updateData({ 
        email: data.email, 
        password: data.password 
      });
    }
  }, [data, email, password, updateData]);
  
  // Inform parent about validation status
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);
  
  // Touch all fields when user tries to proceed
  useEffect(() => {
    return () => {
      touchAllFields();
    };
  }, [touchAllFields]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className={hasError('email') ? "text-destructive" : ""}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`bg-background ${hasError('email') ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
            required
          />
          {hasError('email') && (
            <p className="text-destructive text-sm mt-1">{getError('email')}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className={hasError('password') ? "text-destructive" : ""}>
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => updateField('password', e.target.value)}
            className={`bg-background ${hasError('password') ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
            required
          />
          {hasError('password') && (
            <p className="text-destructive text-sm mt-1">{getError('password')}</p>
          )}
        </div>
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
    </>
  );
}
