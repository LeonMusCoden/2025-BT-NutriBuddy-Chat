import { useState, useEffect, useRef } from 'react';
import { ProfileData } from '@/components/auth/UserProfile';

// Define validation rules for each field
type ValidationRules = {
  [K in keyof ProfileData]?: {
    required?: boolean | ((data: ProfileData) => boolean);
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any, data: ProfileData) => boolean;
    errorMessage?: string;
  };
};

// Define error messages
type FormErrors = {
  [K in keyof ProfileData]?: string;
};

// Define which fields have been touched
type TouchedFields = {
  [K in keyof ProfileData]?: boolean;
};

export function useProfileFormValidation(
  initialData: ProfileData, 
  onSubmit: (data: ProfileData) => Promise<void>,
  onValidationChange?: (isValid: boolean) => void
) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevFormDataRef = useRef<ProfileData>(initialData);
  
  // Define validation rules
  const validationRules: ValidationRules = {
    name: {
      required: false,
      minLength: 2,
      errorMessage: 'Name must be at least 2 characters'
    },
    age: {
      required: false,
      pattern: /^\d+$/,
      min: 18,
      max: 100,
      errorMessage: 'Age must be a number between 18 and 100'
    },
    height: {
      required: false,
      pattern: /^\d+$/,
      min: 100,
      max: 250,
      errorMessage: 'Height must be a number between 100 and 250 cm'
    },
    weight: {
      required: false, 
      pattern: /^\d+$/,
      min: 40,
      max: 300,
      errorMessage: 'Weight must be a number between 40 and 300 kg'
    },
    nutritionalGoalOther: {
      required: (data) => data.nutritionalGoal === 'other',
      minLength: 3,
      errorMessage: 'Please specify your nutritional goal'
    }
  };
  
  // Validate a single field
  const validateField = (name: keyof ProfileData, value: any): string | undefined => {
    const rules = validationRules[name];
    if (!rules) return undefined;
    
    // Check if required
    if (rules.required === true && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rules.errorMessage || `${name} is required`;
    }
    
    // Check if required conditionally
    if (typeof rules.required === 'function' && rules.required(formData) && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rules.errorMessage || `${name} is required`;
    }
    
    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return undefined;
    }
    
    // Check min length
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return rules.errorMessage || `${name} must be at least ${rules.minLength} characters`;
    }
    
    // Check max length
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return rules.errorMessage || `${name} must be less than ${rules.maxLength} characters`;
    }
    
    // Check pattern
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.errorMessage || `${name} has an invalid format`;
    }
    
    // Check min value for numeric fields
    if (rules.min !== undefined && !isNaN(Number(value)) && Number(value) < rules.min) {
      return rules.errorMessage || `${name} must be at least ${rules.min}`;
    }
    
    // Check max value for numeric fields
    if (rules.max !== undefined && !isNaN(Number(value)) && Number(value) > rules.max) {
      return rules.errorMessage || `${name} must be less than ${rules.max}`;
    }
    
    // Custom validation
    if (rules.custom && !rules.custom(value, formData)) {
      return rules.errorMessage || `${name} is invalid`;
    }
    
    return undefined;
  };
  
  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Check each field with validation rules
    Object.keys(validationRules).forEach((fieldName) => {
      const name = fieldName as keyof ProfileData;
      const error = validateField(name, formData[name]);
      
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle field change
  const handleChange = (name: keyof ProfileData, value: any) => {
    // Update form data
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Store the new form data for future comparison
      prevFormDataRef.current = newData;
      
      return newData;
    });
    
    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the single field
    const error = validateField(name, value);
    
    // Update errors and check if all fields are valid now
    setErrors(prev => {
      const newErrors = { ...prev, [name]: error };
      const isValid = !Object.values(newErrors).some(err => err !== undefined);
      
      // Notify about validation state change
      if (onValidationChange) {
        onValidationChange(isValid);
      }
      
      return newErrors;
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: TouchedFields = {};
    Object.keys(validationRules).forEach((field) => {
      allTouched[field as keyof ProfileData] = true;
    });
    setTouchedFields(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Update formData when initialData changes
  useEffect(() => {
    // Only update if initialData has actually changed
    if (JSON.stringify(initialData) !== JSON.stringify(prevFormDataRef.current)) {
      setFormData(initialData);
      prevFormDataRef.current = initialData;
      
      // Re-validate with new data
      const newErrors: FormErrors = {};
      let isValid = true;
      
      Object.keys(validationRules).forEach((fieldName) => {
        const name = fieldName as keyof ProfileData;
        const error = validateField(name, initialData[name]);
        
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      });
      
      setErrors(newErrors);
      
      // Notify about validation state
      if (onValidationChange) {
        onValidationChange(isValid);
      }
    }
  }, [initialData]);
  
  return {
    formData,
    errors,
    touchedFields,
    isSubmitting,
    handleChange,
    setFormData,
    validateForm,
    validateField,
    handleSubmit,
    isValid: Object.keys(errors).length === 0
  };
}
