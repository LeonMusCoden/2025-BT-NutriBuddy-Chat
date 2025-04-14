import { ProfileData } from "../UserProfile";

export type RetailerCredentials = {
  email: string;
  password: string;
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  isConnected: boolean;
};

export type ConnectedLoyaltyCardState = 'Migros' | 'Coop' | 'Both' | null;

export type SignupFormData = {
  // Basic account data
  email: string;
  password: string;
  
  // Loyalty card data
  connectedLoyaltyCard: ConnectedLoyaltyCardState;
  migros: RetailerCredentials;
  coop: RetailerCredentials;
  
  // User profile data
  profile: ProfileData;
};

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
