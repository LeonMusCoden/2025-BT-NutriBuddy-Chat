import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nutriBuddyApi } from "@/lib/api";
import { RetailerCredentials } from "../components/RetailerCredentials";
import { FormData, ValidationStatus, RetailerType } from "../types";

type LoyaltyCardsStepProps = {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  migrosValidationStatus: ValidationStatus;
  coopValidationStatus: ValidationStatus;
  setMigrosValidationStatus: (status: ValidationStatus) => void;
  setCoopValidationStatus: (status: ValidationStatus) => void;
  connectMigros: boolean;
  connectCoop: boolean;
  setConnectMigros: (connect: boolean) => void;
  setConnectCoop: (connect: boolean) => void;
};

export function LoyaltyCardsStep({
  formData,
  updateFormData,
  migrosValidationStatus,
  coopValidationStatus,
  setMigrosValidationStatus,
  setCoopValidationStatus,
  connectMigros,
  connectCoop,
  setConnectMigros,
  setConnectCoop
}: LoyaltyCardsStepProps) {
  const handleToggleChange = (retailer: RetailerType, isChecked: boolean) => {
    if (retailer === 'migros') {
      setConnectMigros(isChecked);
      // Reset validation when toggling off
      if (!isChecked) {
        setMigrosValidationStatus('idle');
        updateFormData({ 
          migrosEmail: "", 
          migrosPassword: "" 
        });
      }
    } else {
      setConnectCoop(isChecked);
      // Reset validation when toggling off
      if (!isChecked) {
        setCoopValidationStatus('idle');
        updateFormData({ 
          coopEmail: "", 
          coopPassword: "" 
        });
      }
    }

    // Update the connectedLoyaltyCard value
    updateConnectedLoyaltyCard(retailer === 'migros' ? isChecked : connectMigros, retailer === 'coop' ? isChecked : connectCoop);
  };

  const updateConnectedLoyaltyCard = (migrosConnected: boolean, coopConnected: boolean) => {
    let connectedCard = null;
    if (migrosConnected && coopConnected) {
      connectedCard = 'both';
    } else if (migrosConnected) {
      connectedCard = 'migros';
    } else if (coopConnected) {
      connectedCard = 'coop';
    }
    
    updateFormData({ connectedLoyaltyCard: connectedCard });
  };

  const validateCredentials = async (retailer: RetailerType) => {
    const isForMigros = retailer === 'migros';
    const statusSetter = isForMigros ? setMigrosValidationStatus : setCoopValidationStatus;
    const email = isForMigros ? formData.migrosEmail : formData.coopEmail;
    const password = isForMigros ? formData.migrosPassword : formData.coopPassword;
    
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

  return (
    <div className="flex flex-col gap-6">
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
            email={formData.migrosEmail}
            password={formData.migrosPassword}
            validationStatus={migrosValidationStatus}
            onEmailChange={(value) => updateFormData({ migrosEmail: value })}
            onPasswordChange={(value) => updateFormData({ migrosPassword: value })}
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
            email={formData.coopEmail}
            password={formData.coopPassword}
            validationStatus={coopValidationStatus}
            onEmailChange={(value) => updateFormData({ coopEmail: value })}
            onPasswordChange={(value) => updateFormData({ coopPassword: value })}
            onValidate={() => validateCredentials('coop')}
          />
        )}
      </div>
    </div>
  );
}
