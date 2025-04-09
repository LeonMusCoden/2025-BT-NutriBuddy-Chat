import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FormData } from "../types";

type AccountStepProps = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AccountStep({ formData, handleInputChange }: AccountStepProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
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
            value={formData.password}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
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
