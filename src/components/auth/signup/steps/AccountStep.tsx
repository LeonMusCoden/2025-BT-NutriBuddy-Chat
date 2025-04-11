import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/context/SignupContext";

export function AccountStep() {
  const navigate = useNavigate();
  const { 
    formData, 
    updateFormData,
    errors,
    touchedFields,
    setFieldTouched
  } = useSignup();

  // Touch all fields when component unmounts
  useEffect(() => {
    return () => {
      setFieldTouched('email', true);
      setFieldTouched('password', true);
    };
  }, [setFieldTouched]);

  // Update form data
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value });
    setFieldTouched('email', true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ password: e.target.value });
    setFieldTouched('password', true);
  };

  // Check if field has an error
  const hasError = (field: string): boolean => {
    return touchedFields[field] && !!errors[field];
  };

  // Get error message for a field
  const getError = (field: string): string | undefined => {
    return hasError(field) ? errors[field] : undefined;
  };

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
            value={formData.email}
            onChange={handleEmailChange}
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
            value={formData.password}
            onChange={handlePasswordChange}
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
