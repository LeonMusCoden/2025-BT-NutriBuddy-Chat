import { useState, useEffect, useCallback } from 'react';

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export type ValidationFn<T> = (data: T) => ValidationResult;

export function useStepValidation<T>(initialData: T, validateFn: ValidationFn<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);
  
  // Validate when data changes
  useEffect(() => {
    const { isValid, errors } = validateFn(data);
    setErrors(errors);
    setIsValid(isValid);
  }, [data, validateFn]);
  
  // Update a single field and mark it as touched
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    setTouchedFields(prev => ({
      ...prev,
      [field as string]: true
    }));
  }, []);
  
  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<T>) => {
    setData(prevData => ({
      ...prevData,
      ...updates
    }));
    
    // Mark all updated fields as touched
    const updatedTouchedFields: Record<string, boolean> = {};
    Object.keys(updates).forEach(key => {
      updatedTouchedFields[key] = true;
    });
    
    setTouchedFields(prev => ({
      ...prev,
      ...updatedTouchedFields
    }));
  }, []);
  
  // Check if a field has an error and has been touched
  const hasError = useCallback((field: keyof T) => {
    return touchedFields[field as string] && !!errors[field as string];
  }, [touchedFields, errors]);
  
  // Get error message for a field
  const getError = useCallback((field: keyof T): string | undefined => {
    return hasError(field) ? errors[field as string] : undefined;
  }, [hasError, errors]);
  
  // Mark all fields as touched (useful for form submission)
  const touchAllFields = useCallback(() => {
    const allFields: Record<string, boolean> = {};
    Object.keys(data).forEach(key => {
      allFields[key] = true;
    });
    setTouchedFields(allFields);
  }, [data]);
  
  return {
    data,
    setData,
    errors,
    touchedFields,
    isValid,
    updateField,
    updateFields,
    hasError,
    getError,
    touchAllFields
  };
}
