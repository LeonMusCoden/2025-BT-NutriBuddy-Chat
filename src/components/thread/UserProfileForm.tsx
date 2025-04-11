import { useState, useEffect } from "react";
import { useAuth } from "@/providers/Auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelector } from "@/components/ui/MultiSelector";
import { ALLERGENS, CUISINES, MEDICAL_CONDITIONS } from "@/components/auth/signup/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProfileData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: 'female' | 'male' | 'other' | '';
  dietaryType: 'no-restrictions' | 'vegetarian' | 'vegan' | '';
  allergens: string[];
  favoriteCuisines: string[];
  dislikedCuisines: string[];
  nutritionalGoal: 'lose-weight' | 'stay-healthy' | 'gain-muscle' | 'other' | '';
  nutritionalGoalOther: string;
  sportsFrequency: '4+' | '2-3' | 'once' | 'less' | '';
  medicalConditions: string[];
  otherMedicalCondition: string;
}

const defaultProfile: ProfileData = {
  name: "",
  age: "",
  height: "",
  weight: "",
  gender: "",
  dietaryType: "",
  allergens: [],
  favoriteCuisines: [],
  dislikedCuisines: [],
  nutritionalGoal: "",
  nutritionalGoalOther: "",
  sportsFrequency: "",
  medicalConditions: [],
  otherMedicalCondition: "",
};

export function UserProfileForm({ onClose }: { onClose?: () => void }) {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOtherNutritionalGoal, setShowOtherNutritionalGoal] = useState(
    profile.nutritionalGoal === 'other'
  );

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

          if (user.profile_data.nutritionalGoal === 'other') {
            setShowOtherNutritionalGoal(true);
          }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleNutritionalGoalChange = (value: string) => {
    const isOther = value === 'other';
    setShowOtherNutritionalGoal(isOther);
    updateProfileData({ nutritionalGoal: value as any });
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="basic-info" className="w-full">
          {/* Basic Information */}
          <AccordionItem value="basic-info" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Basic Information
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="bg-background"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={profile.age}
                    onChange={handleInputChange}
                    className="bg-background"
                    placeholder="Years"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleSelectChange}
                    className="h-9 rounded-md border bg-background px-3 py-1 text-base shadow-xs"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={profile.height}
                    onChange={handleInputChange}
                    className="bg-background"
                    placeholder="Centimeters"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={profile.weight}
                    onChange={handleInputChange}
                    className="bg-background"
                    placeholder="Kilograms"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dietary Preferences */}
          <AccordionItem value="dietary" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Dietary Preferences
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-2">
                <Label>Dietary Type</Label>
                <RadioGroup
                  value={profile.dietaryType}
                  onValueChange={(value) => updateProfileData({ dietaryType: value as any })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-restrictions" id="no-restrictions" />
                    <Label htmlFor="no-restrictions" className="font-normal cursor-pointer">No Restrictions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian" className="font-normal cursor-pointer">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan" className="font-normal cursor-pointer">Vegan</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Label>Allergens & Intolerances</Label>
                <MultiSelector
                  options={ALLERGENS}
                  selectedOptions={profile.allergens}
                  onChange={(selected) => updateProfileData({ allergens: selected })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Cuisine Preferences */}
          <AccordionItem value="cuisine" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Cuisine Preferences
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-2">
                <Label>Cuisines You Like</Label>
                <MultiSelector
                  options={CUISINES}
                  selectedOptions={profile.favoriteCuisines}
                  onChange={(selected) => updateProfileData({ favoriteCuisines: selected })}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Label>Cuisines You Dislike</Label>
                <MultiSelector
                  options={CUISINES}
                  selectedOptions={profile.dislikedCuisines}
                  onChange={(selected) => updateProfileData({ dislikedCuisines: selected })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Health & Fitness */}
          <AccordionItem value="health" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Health & Fitness
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <div className="flex flex-col gap-2">
                <Label>Nutritional Goals</Label>
                <RadioGroup
                  value={profile.nutritionalGoal}
                  onValueChange={handleNutritionalGoalChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose-weight" id="lose-weight" />
                    <Label htmlFor="lose-weight" className="font-normal cursor-pointer">Lose weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stay-healthy" id="stay-healthy" />
                    <Label htmlFor="stay-healthy" className="font-normal cursor-pointer">Stay healthy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain-muscle" id="gain-muscle" />
                    <Label htmlFor="gain-muscle" className="font-normal cursor-pointer">Gain muscle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other-goal" />
                    <Label htmlFor="other-goal" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>

                {showOtherNutritionalGoal && (
                  <Input
                    id="nutritionalGoalOther"
                    name="nutritionalGoalOther"
                    value={profile.nutritionalGoalOther}
                    onChange={handleInputChange}
                    className="bg-background mt-2"
                    placeholder="Please specify your goal"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Label>How often do you do sports (30min at least)</Label>
                <select
                  id="sportsFrequency"
                  name="sportsFrequency"
                  value={profile.sportsFrequency}
                  onChange={handleSelectChange}
                  className="h-9 rounded-md border bg-background px-3 py-1 text-base shadow-xs"
                >
                  <option value="" disabled>Select frequency</option>
                  <option value="4+">4 times or more a week</option>
                  <option value="2-3">2-3 times a week</option>
                  <option value="once">Once a week</option>
                  <option value="less">Less than once per week</option>
                </select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Medical Conditions */}
          <AccordionItem value="medical" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
            <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
              Medical Conditions
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <p className="text-sm text-muted-foreground">
                Are you affected by any of the following conditions?
              </p>

              <div className="flex flex-col gap-2">
                <MultiSelector
                  options={MEDICAL_CONDITIONS}
                  selectedOptions={profile.medicalConditions}
                  onChange={(selected) => updateProfileData({ medicalConditions: selected })}
                />

                <div className="flex flex-col gap-2 mt-2">
                  <Label htmlFor="otherMedicalCondition">Other medical conditions</Label>
                  <Input
                    id="otherMedicalCondition"
                    name="otherMedicalCondition"
                    value={profile.otherMedicalCondition}
                    onChange={handleInputChange}
                    className="bg-background"
                    placeholder="Please specify if any"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
      </div>
    </form>
  );
}
