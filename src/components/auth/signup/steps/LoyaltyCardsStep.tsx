import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nutriBuddyApi } from "@/lib/api";
import { RetailerCredentials, ConnectedLoyaltyCardState } from "../types";
import { useStepValidation, ValidationResult } from "@/hooks/useStepValidation";
import { RetailerCredentialsForm } from "../components/RetailerCredentialsForm";

type LoyaltyCardsData = {
  migros: RetailerCredentials;
  coop: RetailerCredentials;
};

const validateLoyaltyCards = (data: LoyaltyCardsData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Only validate when a retailer is connected
  if (data.migros.isConnected) {
    if (!data.migros.email) {
      errors['migros.email'] = "Migros email is required";
    }
    if (!data.migros.password) {
      errors['migros.password'] = "Migros password is required";
    }
    if (data.migros.validationStatus === 'invalid') {
      errors['migros.credentials'] = "Migros credentials are invalid";
    }
  }
  
  if (data.coop.isConnected) {
    if (!data.coop.email) {
      errors['coop.email'] = "Coop email is required";
    }
    if (!data.coop.password) {
      errors['coop.password'] = "Coop password is required";
    }
    if (data.coop.validationStatus === 'invalid') {
      errors['coop.credentials'] = "Coop credentials are invalid";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

type LoyaltyCardsStepProps = {
  migros: RetailerCredentials;
  coop: RetailerCredentials;
  updateData: (updates: {
    migros?: Partial<RetailerCredentials>;
    coop?: Partial<RetailerCredentials>;
    connectedLoyaltyCard?: ConnectedLoyaltyCardState;
  }) => void;
  onValidationChange: (isValid: boolean) => void;
};

export function LoyaltyCardsStep({
  migros,
  coop,
  updateData,
  onValidationChange
}: LoyaltyCardsStepProps) {
  const { 
    data,
    isValid,
    updateFields,
    hasError,
    getError
  } = useStepValidation<LoyaltyCardsData>(
    { migros, coop },
    validateLoyaltyCards
  );
  
  // Update parent component when local data changes
  useEffect(() => {
    const updates: any = {};
    if (data.migros !== migros) {
      updates.migros = data.migros;
    }
    if (data.coop !== coop) {
      updates.coop = data.coop;
    }
    
    if (Object.keys(updates).length > 0) {
      // Determine connected loyalty card value
      let connectedLoyaltyCard: ConnectedLoyaltyCardState = null;
      if (data.migros.isConnected && data.coop.isConnected) {
        connectedLoyaltyCard = 'both';
      } else if (data.migros.isConnected) {
        connectedLoyaltyCard = 'migros';
      } else if (data.coop.isConnected) {
        connectedLoyaltyCard = 'coop';
      }
      
      updateData({
        ...updates,
        connectedLoyaltyCard
      });
    }
  }, [data, migros, coop, updateData]);
  
  // Inform parent about validation status
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);
  
  const handleToggleChange = (retailer: 'migros' | 'coop', isChecked: boolean) => {
    if (retailer === 'migros') {
      updateFields({
        migros: {
          ...data.migros,
          isConnected: isChecked,
          // Reset validation when toggling off
          ...(isChecked ? {} : { validationStatus: 'idle', email: '', password: '' })
        }
      });
    } else {
      updateFields({
        coop: {
          ...data.coop,
          isConnected: isChecked,
          // Reset validation when toggling off
          ...(isChecked ? {} : { validationStatus: 'idle', email: '', password: '' })
        }
      });
    }
  };
  
  const validateCredentials = async (retailer: 'migros' | 'coop') => {
    const retailerData = data[retailer];
    const { email, password } = retailerData;
    
    if (!email || !password) {
      toast.error(`Please enter your ${retailer} credentials`);
      return;
    }

    // Update validation status to 'validating'
    updateFields({
      [retailer]: {
        ...retailerData,
        validationStatus: 'validating'
      }
    });
    
    try {
      const isValid = await nutriBuddyApi.validateCredentials(retailer, email, password);
      
      updateFields({
        [retailer]: {
          ...retailerData,
          validationStatus: isValid ? 'valid' : 'invalid'
        }
      });
      
      if (isValid) {
        toast.success(`${retailer.charAt(0).toUpperCase() + retailer.slice(1)} credentials validated successfully`);
      } else {
        toast.error(`Invalid ${retailer} credentials`);
      }
    } catch (error) {
      updateFields({
        [retailer]: {
          ...retailerData,
          validationStatus: 'invalid'
        }
      });
      toast.error(`Failed to validate ${retailer} credentials`);
      console.error(`${retailer} validation error:`, error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base mb-1 block">Migros Cumulus</Label>
            <p className="text-muted-foreground text-sm">Connect your Migros purchase history</p>
          </div>
          <Switch
            checked={data.migros.isConnected}
            onCheckedChange={(checked) => handleToggleChange('migros', checked)}
          />
        </div>
        
        {data.migros.isConnected && (
          <RetailerCredentialsForm
            retailer="migros"
            credentials={data.migros}
            updateCredentials={(updates) => updateFields({ 
              migros: { ...data.migros, ...updates } 
            })}
            onValidate={() => validateCredentials('migros')}
            error={hasError('migros.credentials') ? getError('migros.credentials') : undefined}
          />
        )}
        
        <div className="border-t my-2"></div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base mb-1 block">Coop Supercard</Label>
            <p className="text-muted-foreground text-sm">Connect your Coop purchase history</p>
          </div>
          <Switch
            checked={data.coop.isConnected}
            onCheckedChange={(checked) => handleToggleChange('coop', checked)}
          />
        </div>
        
        {data.coop.isConnected && (
          <RetailerCredentialsForm
            retailer="coop"
            credentials={data.coop}
            updateCredentials={(updates) => updateFields({ 
              coop: { ...data.coop, ...updates } 
            })}
            onValidate={() => validateCredentials('coop')}
            error={hasError('coop.credentials') ? getError('coop.credentials') : undefined}
          />
        )}
      </div>
    </div>
  );
}
