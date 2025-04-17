import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nutriBuddyApi } from "@/lib/api";
import { RetailerCredentials, ConnectedLoyaltyCardState, SignupFormData } from "../types";
import { RetailerCredentialsForm } from "../components/RetailerCredentialsForm";
import { useSignup } from "@/context/SignupContext";

export function LoyaltyCardsStep() {
  const { 
    formData, 
    updateFormData, 
    errors, 
    touchedFields 
  } = useSignup();
  
  const { migros, coop } = formData;

  // Update connected loyalty card status when retailer connections change
  useEffect(() => {
    let connectedLoyaltyCard: ConnectedLoyaltyCardState = null;
    
    if (migros.isConnected && coop.isConnected) {
      connectedLoyaltyCard = 'Both';
    } else if (migros.isConnected) {
      connectedLoyaltyCard = 'Migros';
    } else if (coop.isConnected) {
      connectedLoyaltyCard = 'Coop';
    }
    
    updateFormData({ connectedLoyaltyCard });
  }, [migros.isConnected, coop.isConnected, updateFormData]);

  // Toggle retailer connection
  const handleToggleChange = (retailer: 'migros' | 'coop', isChecked: boolean) => {
    if (retailer === 'migros') {
      updateFormData({
        migros: {
          ...migros,
          isConnected: isChecked,
          // Reset validation when toggling off
          ...(isChecked ? {} : { validationStatus: 'idle', email: '', password: '' })
        }
      });
    } else {
      updateFormData({
        coop: {
          ...coop,
          isConnected: isChecked,
          // Reset validation when toggling off
          ...(isChecked ? {} : { validationStatus: 'idle', email: '', password: '' })
        }
      });
    }
  };
  
  // Validate retailer credentials
  const validateCredentials = async (retailer: 'migros' | 'coop') => {
    const retailerData = retailer === 'migros' ? migros : coop;
    const { email, password } = retailerData;
    
    if (!email || !password) {
      toast.error(`Please enter your ${retailer} credentials`);
      return;
    }

    // Update validation status to 'validating'
    const updates: Partial<SignupFormData> = retailer === 'migros' 
      ? { migros: { ...migros, validationStatus: 'validating' } }
      : { coop: { ...coop, validationStatus: 'validating' } };
    
    updateFormData(updates);
    
    try {
      const isValid = await nutriBuddyApi.validateCredentials(retailer, email, password);
      
      // Update validation status based on result
      const statusUpdates: Partial<SignupFormData> = retailer === 'migros'
        ? { migros: { ...migros, validationStatus: isValid ? 'valid' : 'invalid' } }
        : { coop: { ...coop, validationStatus: isValid ? 'valid' : 'invalid' } };
      
      updateFormData(statusUpdates);
      
      if (isValid) {
        toast.success(`${retailer.charAt(0).toUpperCase() + retailer.slice(1)} credentials validated successfully`);
      } else {
        toast.error(`Invalid ${retailer} credentials`);
      }
    } catch (error) {
      // Update validation status to 'invalid' on error
      const errorUpdates: Partial<SignupFormData> = retailer === 'migros'
        ? { migros: { ...migros, validationStatus: 'invalid' } }
        : { coop: { ...coop, validationStatus: 'invalid' } };
      
      updateFormData(errorUpdates);
      toast.error(`Failed to validate ${retailer} credentials`);
      console.error(`${retailer} validation error:`, error);
    }
  };

  // Update retailer credentials
  const updateRetailerCredentials = (retailer: 'migros' | 'coop', updates: Partial<RetailerCredentials>) => {
    if (retailer === 'migros') {
      updateFormData({
        migros: { ...migros, ...updates }
      });
    } else {
      updateFormData({
        coop: { ...coop, ...updates }
      });
    }
  };

  // Check if a field has an error
  const hasError = (field: string): boolean => {
    return touchedFields[field] && !!errors[field];
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
            checked={migros.isConnected}
            onCheckedChange={(checked) => handleToggleChange('migros', checked)}
          />
        </div>
        
        {migros.isConnected && (
          <RetailerCredentialsForm
            retailer="migros"
            credentials={migros}
            updateCredentials={(updates) => updateRetailerCredentials('migros', updates)}
            onValidate={() => validateCredentials('migros')}
            error={hasError('migros.credentials') ? errors['migros.credentials'] : undefined}
          />
        )}
        
        <div className="border-t my-2"></div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base mb-1 block">Coop Supercard</Label>
            <p className="text-muted-foreground text-sm">Connect your Coop purchase history</p>
          </div>
          <Switch
            checked={coop.isConnected}
            onCheckedChange={(checked) => handleToggleChange('coop', checked)}
          />
        </div>
        
        {coop.isConnected && (
          <RetailerCredentialsForm
            retailer="coop"
            credentials={coop}
            updateCredentials={(updates) => updateRetailerCredentials('coop', updates)}
            onValidate={() => validateCredentials('coop')}
            error={hasError('coop.credentials') ? errors['coop.credentials'] : undefined}
          />
        )}
      </div>
    </div>
  );
}
