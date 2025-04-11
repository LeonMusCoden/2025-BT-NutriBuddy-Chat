import { useState, useEffect } from "react";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileForm, ProfileData, defaultProfile } from "@/components/auth/UserProfile";

export function UserProfileForm({ onClose }: { onClose?: () => void }) {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // In a real implementation, we'd fetch the profile data from the API
        // For now, use what we have in the user object if available
        if (user.profile_data) {
          setProfile({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(profile);
      toast.success("Profile updated successfully");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfileForm 
        profile={profile}
        isLoading={isLoading}
        onChange={setProfile}
      />
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
          {isSaving ? (
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
