import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Check, XCircle, Loader2 } from "lucide-react";
import { RetailerCredentials } from "../types";

type RetailerCredentialsFormProps = {
  retailer: 'migros' | 'coop';
  credentials: RetailerCredentials;
  updateCredentials: (updates: Partial<RetailerCredentials>) => void;
  onValidate: () => Promise<void>;
  error?: string;
};

export function RetailerCredentialsForm({
  retailer,
  credentials,
  updateCredentials,
  onValidate,
  error
}: RetailerCredentialsFormProps) {
  const retailerName = retailer.charAt(0).toUpperCase() + retailer.slice(1);
  const emailId = `${retailer}Email`;
  const passwordId = `${retailer}Password`;
  
  const { email, password, validationStatus } = credentials;

  return (
    <div className="mt-4 p-4 bg-background rounded-lg border">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={emailId}>{retailerName} Email</Label>
          <Input
            id={emailId}
            name={emailId}
            type="email"
            value={email}
            onChange={(e) => updateCredentials({ email: e.target.value })}
            className="bg-background"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor={passwordId}>{retailerName} Password</Label>
          <PasswordInput
            id={passwordId}
            name={passwordId}
            value={password}
            onChange={(e) => updateCredentials({ password: e.target.value })}
            className="bg-background"
          />
        </div>
        
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        
        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onValidate}
            disabled={validationStatus === 'validating'}
          >
            {validationStatus === 'validating' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : 'Validate Credentials'}
          </Button>
          
          {validationStatus === 'valid' && (
            <div className="flex items-center text-green-600">
              <Check className="mr-1 h-4 w-4" />
              <span>Valid</span>
            </div>
          )}
          
          {validationStatus === 'invalid' && (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-1 h-4 w-4" />
              <span>Invalid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
