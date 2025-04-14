import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelector } from "@/components/ui/MultiSelector";
import { ALLERGENS, CUISINES, MEDICAL_CONDITIONS } from "@/components/auth/signup/types";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// This interface defines the user profile data structure
export interface ProfileData {
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

export const defaultProfile: ProfileData = {
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

interface ProfileFormProps {
  profile: ProfileData;
  isLoading?: boolean;
  defaultAccordionValue?: string;
  onChange: (profile: ProfileData) => void;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
}

export function ProfileForm({ 
  profile, 
  isLoading = false, 
  defaultAccordionValue = "basic-info",
  onChange,
  errors = {},
  touchedFields = {}
}: ProfileFormProps) {
  const [showOtherNutritionalGoal, setShowOtherNutritionalGoal] = useState(
    profile.nutritionalGoal === 'other'
  );

  useEffect(() => {
    setShowOtherNutritionalGoal(profile.nutritionalGoal === 'other');
  }, [profile.nutritionalGoal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...profile, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...profile, [name]: value });
  };

  const updateProfileData = (updates: Partial<ProfileData>) => {
    onChange({ ...profile, ...updates });
  };

  const handleNutritionalGoalChange = (value: string) => {
    const isOther = value === 'other';
    setShowOtherNutritionalGoal(isOther);
    updateProfileData({ nutritionalGoal: value as any });
  };

  // Helper to display error messages
  const getErrorMessage = (field: keyof ProfileData) => {
    if (touchedFields[field] && errors[field]) {
      return (
        <p className="text-destructive text-sm mt-1">{errors[field]}</p>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full">
        {/* Basic Information */}
        <AccordionItem value="basic-info" className="border rounded-lg px-4 border-muted bg-muted/20 mb-4">
          <AccordionTrigger className="hover:no-underline font-medium text-base py-3">
            Basic Information
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className={errors.name && touchedFields.name ? "text-destructive" : ""}>
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className={`bg-background ${errors.name && touchedFields.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                placeholder="Enter your name"
              />
              {getErrorMessage('name')}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="age" className={errors.age && touchedFields.age ? "text-destructive" : ""}>
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleInputChange}
                  className={`bg-background ${errors.age && touchedFields.age ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  placeholder="Years"
                />
                {getErrorMessage('age')}
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
                <Label htmlFor="height" className={errors.height && touchedFields.height ? "text-destructive" : ""}>
                  Height
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={profile.height}
                  onChange={handleInputChange}
                  className={`bg-background ${errors.height && touchedFields.height ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  placeholder="Centimeters"
                />
                {getErrorMessage('height')}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="weight" className={errors.weight && touchedFields.weight ? "text-destructive" : ""}>
                  Weight
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={profile.weight}
                  onChange={handleInputChange}
                  className={`bg-background ${errors.weight && touchedFields.weight ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  placeholder="Kilograms"
                />
                {getErrorMessage('weight')}
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
                allowCustomOptions={true}
                customOptionPlaceholder="Add other allergen..."
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
                allowCustomOptions={true}
                customOptionPlaceholder="Add other cuisine you like..."
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <Label>Cuisines You Dislike</Label>
              <MultiSelector
                options={CUISINES}
                selectedOptions={profile.dislikedCuisines}
                onChange={(selected) => updateProfileData({ dislikedCuisines: selected })}
                allowCustomOptions={true}
                customOptionPlaceholder="Add other cuisine you dislike..."
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
                <div className="mt-2">
                  <Input
                    id="nutritionalGoalOther"
                    name="nutritionalGoalOther"
                    value={profile.nutritionalGoalOther}
                    onChange={handleInputChange}
                    className={`bg-background ${errors.nutritionalGoalOther && touchedFields.nutritionalGoalOther ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                    placeholder="Please specify your goal"
                  />
                  {getErrorMessage('nutritionalGoalOther')}
                </div>
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
            <p className="">
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
    </div>
  );
}
