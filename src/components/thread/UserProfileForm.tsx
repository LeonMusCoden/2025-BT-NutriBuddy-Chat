import { useState, useEffect } from "react";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileForm, ProfileData, defaultProfile } from "@/components/auth/UserProfile";
import { useProfileFormValidation } from "@/hooks/useProfileValidation";

export function UserProfileForm({ onClose }: { onClose?: () => void }) {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [initialProfile, setInitialProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // In a real implementation, we'd fetch the profile data from the API
        // For now, use what we have in the user object if available
        if (user.profile_data) {
          setInitialProfile({
            ...defaultProfile,
            ...user.profile_data,
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);
  
  // Use the validation hook
  const { 
    formData, 
    errors,
    touchedFields,
    isSubmitting, 
    handleChange, 
    handleSubmit 
  } = useProfileFormValidation(initialProfile, async (data: ProfileData) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  });

  const handleProfileChange = (newData: ProfileData) => {
    // Find which field changed
    Object.keys(newData).forEach((key) => {
      const k = key as keyof ProfileData;
      if (formData[k] !== newData[k]) {
        handleChange(k, newData[k]);
      }
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <ProfileForm 
        profile={formData}
        isLoading={isLoading}
        onChange={handleProfileChange}
        errors={errors}
        touchedFields={touchedFields}
      />
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || isLoading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
