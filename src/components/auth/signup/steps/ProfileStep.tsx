import { ProfileForm } from "@/components/auth/UserProfile";
import { ProfileData } from "@/components/auth/UserProfile";
import { useSignup } from "@/context/SignupContext";
import { useProfileFormValidation } from "@/hooks/useProfileValidation";

export function ProfileStep() {
  const { 
    formData, 
    updateFormData,
    setProfileStepValid
  } = useSignup();

  // Use the useProfileFormValidation hook with validation change callback
  const { 
    errors: profileErrors,
    touchedFields: profileTouchedFields,
    handleChange: profileHandleChange
  } = useProfileFormValidation(
    formData.profile,
    async () => {}, // No-op for submission since we handle it in SignupContext
    (isValid) => setProfileStepValid(isValid)
  );

  // Handle ProfileForm onChange
  const handleProfileChange = (newData: ProfileData) => {
    // Update profile data in SignupContext
    updateFormData({ 
      profile: newData 
    });
    
    // Mark fields as touched
    Object.keys(newData).forEach(key => {
      if (newData[key as keyof ProfileData] !== formData.profile[key as keyof ProfileData]) {
        // Update fields in the hook directly
        profileHandleChange(key as keyof ProfileData, newData[key as keyof ProfileData]);
      }
    });
  };

  // Convert errors to format expected by ProfileForm
  const getProfileErrors = (): Record<string, string> => {
    return profileErrors as Record<string, string>;
  };
  
  // Convert touched fields to format expected by ProfileForm
  const getProfileTouchedFields = (): Record<string, boolean> => {
    return profileTouchedFields;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        This information helps us provide better nutrition advice based on your profile.
      </p>
      
      <ProfileForm 
        profile={formData.profile}
        onChange={handleProfileChange}
        errors={getProfileErrors()}
        touchedFields={getProfileTouchedFields()}
        defaultAccordionValue="basic-info"
      />
    </div>
  );
}
