import { useEffect } from "react";
import { ProfileForm } from "@/components/auth/UserProfile";
import { ProfileData } from "@/components/auth/UserProfile";
import { useStepValidation, ValidationResult } from "@/hooks/useStepValidation";

// Simplified validation for profile - skippable step
const validateProfile = (data: ProfileData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Only validate fields that have values
  if (data.name && data.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  
  if (data.age) {
    const age = parseInt(data.age);
    if (isNaN(age) || age < 12 || age > 120) {
      errors.age = "Age must be between 12 and 120";
    }
  }
  
  if (data.height) {
    const height = parseInt(data.height);
    if (isNaN(height) || height < 50 || height > 300) {
      errors.height = "Height must be between 50 and 300 cm";
    }
  }
  
  if (data.weight) {
    const weight = parseInt(data.weight);
    if (isNaN(weight) || weight < 20 || weight > 500) {
      errors.weight = "Weight must be between 20 and 500 kg";
    }
  }
  
  if (data.nutritionalGoal === 'other' && !data.nutritionalGoalOther) {
    errors.nutritionalGoalOther = "Please specify your nutritional goal";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

type ProfileStepProps = {
  profile: ProfileData;
  updateData: (updates: Partial<ProfileData>) => void;
  onValidationChange: (isValid: boolean) => void;
};

export function ProfileStep({
  profile,
  updateData,
  onValidationChange
}: ProfileStepProps) {
  const { 
    data, 
    errors, 
    updateFields,
    touchedFields, 
    isValid 
  } = useStepValidation<ProfileData>(
    profile,
    validateProfile
  );
  
  // Update parent when local data changes
  useEffect(() => {
    if (data !== profile) {
      updateData(data);
    }
  }, [data, profile, updateData]);
  
  // Inform parent about validation status
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);
  
  // Handle ProfileForm onChange
  const handleProfileChange = (newData: ProfileData) => {
    // Find which fields changed
    const updates: Partial<ProfileData> = {};
    Object.keys(newData).forEach((key) => {
      const k = key as keyof ProfileData;
      if (data[k] !== newData[k]) {
        updates[k] = newData[k];
      }
    });
    
    if (Object.keys(updates).length > 0) {
      updateFields(updates);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        This information helps us provide better nutrition advice based on your profile.
      </p>
      
      <ProfileForm 
        profile={data}
        onChange={handleProfileChange}
        errors={errors}
        touchedFields={touchedFields}
        defaultAccordionValue="basic-info"
      />
    </div>
  );
}
