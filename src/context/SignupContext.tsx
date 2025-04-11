import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/providers/Auth';
import { defaultProfile } from '@/components/auth/UserProfile';
import { 
  STEPS, 
  SignupFormData, 
} from '@/components/auth/signup/types';

// Default values for the form data
const initialFormData: SignupFormData = {
  email: "",
  password: "",
  connectedLoyaltyCard: null,
  migros: {
    email: "",
    password: "",
    validationStatus: 'idle',
    isConnected: false
  },
  coop: {
    email: "",
    password: "",
    validationStatus: 'idle',
    isConnected: false
  },
  profile: defaultProfile
};

// Define validation rules for each step
type ValidationErrors = {
  [key: string]: string;
};

interface SignupContextType {
  // Form data state
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  
  // Step management
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  skipCurrentStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  
  // Validation state
  validateCurrentStep: () => boolean;
  errors: ValidationErrors;
  touchedFields: Record<string, boolean>;
  isStepValid: boolean;
  setFieldTouched: (field: string, touched?: boolean) => void;
  touchAllFields: () => void;
  
  // Submission
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ 
  children: ReactNode, 
  onStepChange?: (step: number) => void 
}> = ({ children, onStepChange }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Form state management
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data updater
  const updateFormData = useCallback((updates: Partial<SignupFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Set a field as touched
  const setFieldTouched = useCallback((field: string, touched: boolean = true) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: touched
    }));
  }, []);

  // Touch all fields - useful for validation on submit
  const touchAllFields = useCallback(() => {
    const allFields: Record<string, boolean> = {};
    
    // Account step fields
    if (currentStep === 0) {
      allFields['email'] = true;
      allFields['password'] = true;
    } 
    // Loyalty card step fields
    else if (currentStep === 1) {
      if (formData.migros.isConnected) {
        allFields['migros.email'] = true;
        allFields['migros.password'] = true;
      }
      if (formData.coop.isConnected) {
        allFields['coop.email'] = true;
        allFields['coop.password'] = true;
      }
    }
    // Profile step fields - only touch fields with values
    else if (currentStep === 2) {
      Object.entries(formData.profile).forEach(([key, value]) => {
        if (value && (typeof value === 'string' ? value.trim() !== '' : true)) {
          allFields[`profile.${key}`] = true;
        }
      });
    }
    
    setTouchedFields(prev => ({
      ...prev,
      ...allFields
    }));
  }, [currentStep, formData.migros.isConnected, formData.coop.isConnected, formData.profile]);

  // Validate the current step
  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Account step validation (email & password)
    if (currentStep === 0) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    } 
    // Loyalty card step validation
    else if (currentStep === 1) {
      // Only validate if the user has connected a loyalty card
      if (formData.migros.isConnected) {
        if (!formData.migros.email) {
          newErrors['migros.email'] = "Migros email is required";
        }
        if (!formData.migros.password) {
          newErrors['migros.password'] = "Migros password is required";
        }
        if (formData.migros.validationStatus === 'invalid') {
          newErrors['migros.credentials'] = "Migros credentials are invalid";
        }
      }
      
      if (formData.coop.isConnected) {
        if (!formData.coop.email) {
          newErrors['coop.email'] = "Coop email is required";
        }
        if (!formData.coop.password) {
          newErrors['coop.password'] = "Coop password is required";
        }
        if (formData.coop.validationStatus === 'invalid') {
          newErrors['coop.credentials'] = "Coop credentials are invalid";
        }
      }
    } 
    // Profile step validation
    else if (currentStep === 2) {
      // Only validate fields that have values
      if (formData.profile.name && formData.profile.name.length < 2) {
        newErrors['profile.name'] = "Name must be at least 2 characters";
      }
      
      if (formData.profile.age) {
        const age = parseInt(formData.profile.age);
        if (isNaN(age) || age < 12 || age > 120) {
          newErrors['profile.age'] = "Age must be between 12 and 120";
        }
      }
      
      if (formData.profile.height) {
        const height = parseInt(formData.profile.height);
        if (isNaN(height) || height < 50 || height > 300) {
          newErrors['profile.height'] = "Height must be between 50 and 300 cm";
        }
      }
      
      if (formData.profile.weight) {
        const weight = parseInt(formData.profile.weight);
        if (isNaN(weight) || weight < 20 || weight > 500) {
          newErrors['profile.weight'] = "Weight must be between 20 and 500 kg";
        }
      }
      
      if (formData.profile.nutritionalGoal === 'other' && !formData.profile.nutritionalGoalOther) {
        newErrors['profile.nutritionalGoalOther'] = "Please specify your nutritional goal";
      }
    }
    
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsStepValid(valid);
    return valid;
  }, [currentStep, formData]);
  
  // Handle step transitions
  const goToNextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        if (onStepChange) onStepChange(newStep);
      } else {
        // Touch all fields to show validation errors
        touchAllFields();
      }
    }
  }, [currentStep, validateCurrentStep, touchAllFields, onStepChange]);
  
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onStepChange) onStepChange(newStep);
    }
  }, [currentStep, onStepChange]);
  
  // Set default values for skipped steps
  const getDefaultStepValues = useCallback((stepIndex: number): Partial<SignupFormData> => {
    switch (stepIndex) {
      case 1: // Loyalty cards step
        return {
          connectedLoyaltyCard: null,
          migros: {
            email: "",
            password: "",
            validationStatus: 'idle',
            isConnected: false
          },
          coop: {
            email: "",
            password: "",
            validationStatus: 'idle',
            isConnected: false
          }
        };
      case 2: // Profile step
        return {
          profile: { ...defaultProfile }
        };
      default:
        return {};
    }
  }, []);

    // Form submission
  const handleSubmit = useCallback(async () => {
    // Check if the current step is valid
    if (!validateCurrentStep() && currentStep !== STEPS.length - 1) {
      touchAllFields();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare signup data
      const signupData = {
        email: formData.email,
        password: formData.password,
        connectedLoyaltyCard: formData.connectedLoyaltyCard,
        profile_data: formData.profile
      } as any;
      
      // Add retailer credentials if connected
      if (formData.migros.isConnected) {
        signupData.migrosEmail = formData.migros.email;
        signupData.migrosPassword = formData.migros.password;
      }
      
      if (formData.coop.isConnected) {
        signupData.coopEmail = formData.coop.email;
        signupData.coopPassword = formData.coop.password;
      }
      
      // Submit form to API
      await signup(signupData);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account", {
        description: "Please try again or use a different email",
        richColors: true,
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCurrentStep, touchAllFields, currentStep, navigate, signup]);
  
  // Skip the current step
  const skipCurrentStep = useCallback(() => {
    if (currentStep === 0) {
      // First step cannot be skipped
      return;
    }
    
    // Apply default values for the skipped step
    const defaultValues = getDefaultStepValues(currentStep);
    setFormData(prev => ({
      ...prev,
      ...defaultValues
    }));
    
    // If it's the last step, submit the form, otherwise go to next step
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (onStepChange) onStepChange(newStep);
    }
  }, [currentStep, getDefaultStepValues, onStepChange, handleSubmit]);
   
  // Check if we're on the first or last step
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  
  // Run validation when data changes
  React.useEffect(() => {
    validateCurrentStep();
  }, [formData, validateCurrentStep]);
  
  const contextValue: SignupContextType = {
    formData,
    updateFormData,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    skipCurrentStep,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
    errors,
    touchedFields,
    isStepValid,
    setFieldTouched,
    touchAllFields,
    isSubmitting,
    handleSubmit
  };
  
  return (
    <SignupContext.Provider value={contextValue}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};
