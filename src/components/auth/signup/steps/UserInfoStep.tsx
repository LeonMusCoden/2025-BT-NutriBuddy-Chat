import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FormData, 
  ALLERGENS, 
  CUISINES, 
  MEDICAL_CONDITIONS 
} from "../types";
import { MultiSelector } from "@/components/ui/MultiSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type UserInfoStepProps = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  updateFormData: (updates: Partial<FormData>) => void;
};

export function UserInfoStep({ 
  formData, 
  handleInputChange, 
  handleSelectChange,
  updateFormData 
}: UserInfoStepProps) {
  // State to conditionally show "Other" text fields
  const [showOtherNutritionalGoal, setShowOtherNutritionalGoal] = useState(
    formData.nutritionalGoal === 'other'
  );
  
  // Handler for nutritional goal radio change
  const handleNutritionalGoalChange = (value: string) => {
    const isOther = value === 'other';
    setShowOtherNutritionalGoal(isOther);
    updateFormData({ nutritionalGoal: value as any });
  };
  
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground mb-2">
        This information helps us provide better nutrition advice based on your profile.
      </p>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-base">Basic Information</h3>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-background"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
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
              value={formData.gender}
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
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
              value={formData.weight}
              onChange={handleInputChange}
              className="bg-background"
              placeholder="Kilograms"
            />
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Dietary Preferences */}
      <div className="space-y-4">
        <h3 className="font-medium text-base">Dietary Preferences</h3>
        
        <div className="flex flex-col gap-2">
          <Label>Dietary Type</Label>
          <RadioGroup 
            value={formData.dietaryType} 
            onValueChange={(value) => updateFormData({ dietaryType: value as any })}
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
        
        <div className="flex flex-col gap-2">
          <Label>Allergens & Intolerances</Label>
          <MultiSelector
            options={ALLERGENS}
            selectedOptions={formData.allergens}
            onChange={(selected) => updateFormData({ allergens: selected })}
          />
        </div>
      </div>

      <Separator />
      
      {/* Cuisine Preferences */}
      <div className="space-y-4">
        <h3 className="font-medium text-base">Cuisine Preferences</h3>
        
        <div className="flex flex-col gap-2">
          <Label>Cuisines You Like</Label>
          <MultiSelector
            options={CUISINES}
            selectedOptions={formData.favoriteCuisines}
            onChange={(selected) => updateFormData({ favoriteCuisines: selected })}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Label>Cuisines You Dislike</Label>
          <MultiSelector
            options={CUISINES}
            selectedOptions={formData.dislikedCuisines}
            onChange={(selected) => updateFormData({ dislikedCuisines: selected })}
          />
        </div>
      </div>

      <Separator />
      
      {/* Health & Fitness */}
      <div className="space-y-4">
        <h3 className="font-medium text-base">Health & Fitness</h3>
        
        <div className="flex flex-col gap-2">
          <Label>Nutritional Goals</Label>
          <RadioGroup 
            value={formData.nutritionalGoal} 
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
              value={formData.nutritionalGoalOther}
              onChange={handleInputChange}
              className="bg-background mt-2"
              placeholder="Please specify your goal"
            />
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <Label>How often do you do sports (30min at least)</Label>
          <select
            id="sportsFrequency"
            name="sportsFrequency"
            value={formData.sportsFrequency}
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
      </div>

      <Separator />
      
      {/* Medical Conditions */}
      <div className="space-y-4">
        <h3 className="font-medium text-base">Medical Conditions</h3>
        <p className="text-sm text-muted-foreground">
          Are you affected by any of the following disorders?
        </p>
        
        <div className="flex flex-col gap-2">
          <MultiSelector
            options={MEDICAL_CONDITIONS}
            selectedOptions={formData.medicalConditions}
            onChange={(selected) => updateFormData({ medicalConditions: selected })}
          />
          
          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="otherMedicalCondition">Other medical conditions</Label>
            <Input
              id="otherMedicalCondition"
              name="otherMedicalCondition"
              value={formData.otherMedicalCondition}
              onChange={handleInputChange}
              className="bg-background"
              placeholder="Please specify if any"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
