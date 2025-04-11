import { ProfileForm } from "@/components/auth/UserProfile";
import { ProfileData } from "@/components/auth/UserProfile";
import { useSignup } from "@/context/SignupContext";

export function ProfileStep() {
  const { 
    formData, 
    updateFormData,
    errors,
    touchedFields,
    setFieldTouched
  } = useSignup();

  // Handle ProfileForm onChange
  const handleProfileChange = (newData: ProfileData) => {
    // Update profile data
    updateFormData({ 
      profile: newData 
    });
    
    // Mark fields as touched for validation
    Object.keys(newData).forEach(key => {
      if (newData[key as keyof ProfileData] !== formData.profile[key as keyof ProfileData]) {
        setFieldTouched(`profile.${key}`, true);
      }
    });
  };

  // Convert flat errors to profile-specific format
  const getProfileErrors = (): Record<string, string> => {
    const profileErrors: Record<string, string> = {};
    
    Object.entries(errors).forEach(([key, value]) => {
      if (key.startsWith('profile.')) {
        const fieldName = key.replace('profile.', '');
        profileErrors[fieldName] = value;
      }
    });
    
    return profileErrors;
  };
  
  // Convert flat touched fields to profile-specific format
  const getProfileTouchedFields = (): Record<string, boolean> => {
    const profileTouched: Record<string, boolean> = {};
    
    Object.entries(touchedFields).forEach(([key, value]) => {
      if (key.startsWith('profile.')) {
        const fieldName = key.replace('profile.', '');
        profileTouched[fieldName] = value;
      }
    });
    
    return profileTouched;
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
