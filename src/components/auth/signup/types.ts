// Shared types for signup components

export type FormData = {
  // Account info
  email: string;
  password: string;
  
  // Loyalty cards
  connectedLoyaltyCard: 'migros' | 'coop' | 'both' | null;
  migrosEmail: string;
  migrosPassword: string;
  coopEmail: string;
  coopPassword: string;
  
  // User info
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: 'female' | 'male' | 'other' | '';
  dietaryType: 'no-restrictions' | 'vegetarian' | 'vegan' | '';
  
  // Arrays for multi-select options
  allergens: string[];
  favoriteCuisines: string[];
  dislikedCuisines: string[];
  
  // Health info
  nutritionalGoal: 'lose-weight' | 'stay-healthy' | 'gain-muscle' | 'other' | '';
  nutritionalGoalOther: string;
  sportsFrequency: '4+' | '2-3' | 'once' | 'less' | '';
  
  // Medical conditions (multi-select)
  medicalConditions: string[];
  otherMedicalCondition: string;
};

export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export type RetailerType = 'migros' | 'coop';

export type StepConfig = {
  title: string;
  description: string;
};

export const STEPS: StepConfig[] = [
  {
    title: "Create Account",
    description: "Sign up for NutriBuddy to start improving your nutrition habits!",
  },
  {
    title: "Connect Loyalty Cards",
    description: "Connect your loyalty cards to get personalized recommendations based on your purchases. You can skip this step.",
  },
  {
    title: "User Information",
    description: "Tell us a bit about yourself so we can personalize your experience. You can skip this step.",
  },
];

// Pre-defined options for select fields
export const ALLERGENS = [
  "Dairy", "Eggs", "Peanuts", "Tree Nuts", "Fish", "Shellfish", 
  "Wheat", "Soy", "Gluten", "Sesame", "Mustard", "Celery", 
  "Lupin", "Sulphites", "Lactose"
];

export const CUISINES = [
  "Swiss", "Italian", "French", "Chinese", "Japanese", "Thai", "Indian", 
  "Mexican", "American", "Mediterranean", "Middle Eastern", 
  "Greek", "Spanish", "Korean", "Vietnamese"
];

export const MEDICAL_CONDITIONS = [
  "Obesity", "Diabetes", "Elevated blood lipids", "Arterial hypertension",
  "Atherosclerotic cardiovascular disease"
];
