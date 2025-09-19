import { useState, useEffect } from 'react';
import { useCheckUsername } from './useApi';
import useDebounce from './useDebounce';

interface UsernameValidationResult {
  isValid: boolean;
  errorMessage: string;
  isChecking: boolean;
  isAvailable: boolean | null;
}

export const useUsernameValidation = (username: string) => {
  const [validationResult, setValidationResult] = useState<UsernameValidationResult>({
    isValid: false,
    errorMessage: '',
    isChecking: false,
    isAvailable: null,
  });

  const checkUsernameMutation = useCheckUsername();
  const debouncedUsername = useDebounce(username, 500); // 500ms debounce

  // Client-side validation function
  const validateUsername = (value: string): { isValid: boolean; errorMessage: string } => {
    const u = value.trim();
    
    if (!u) {
      return { isValid: false, errorMessage: 'Please enter a username' };
    }
    
    if (u.length < 4) {
      return { isValid: false, errorMessage: 'Username must be at least 4 characters' };
    }
    
    if (/\s/.test(u)) {
      return { isValid: false, errorMessage: 'No spaces allowed' };
    }
    
    if (!/^[a-z]/.test(u)) {
      return { isValid: false, errorMessage: 'Must start with a letter' };
    }
    
    if (!/^[a-z0-9]+$/.test(u)) {
      return { isValid: false, errorMessage: 'Use only lowercase letters and numbers' };
    }
    
    return { isValid: true, errorMessage: '' };
  };

  // Effect to handle username validation and availability checking
  useEffect(() => {
    const trimmedUsername = debouncedUsername.trim();
    
    // Reset state when username is empty
    if (!trimmedUsername) {
      setValidationResult({
        isValid: false,
        errorMessage: '',
        isChecking: false,
        isAvailable: null,
      });
      return;
    }

    // First, do client-side validation
    const clientValidation = validateUsername(trimmedUsername);
    
    if (!clientValidation.isValid) {
      setValidationResult({
        isValid: false,
        errorMessage: clientValidation.errorMessage,
        isChecking: false,
        isAvailable: null,
      });
      return;
    }

    // If client validation passes, check availability
    setValidationResult(prev => ({
      ...prev,
      isValid: true,
      errorMessage: '',
      isChecking: true,
      isAvailable: null,
    }));

    const username = trimmedUsername.toLowerCase();

    // Check username availability
    checkUsernameMutation.mutate(username, {
      onSuccess: (response) => {
        // API returns { username_exist: boolean }
        const usernameExists = response.data?.username_exist ?? false;
        const isAvailable = !usernameExists; // If username exists, it's not available
        
        setValidationResult({
          isValid: isAvailable,
          errorMessage: isAvailable ? '' : 'Username is already taken',
          isChecking: false,
          isAvailable,
        });
      },
      onError: (error: any) => {
        setValidationResult({
          isValid: true, // Allow proceeding if API fails
          errorMessage: '',
          isChecking: false,
          isAvailable: null,
        });
      },
    });
  }, [debouncedUsername]); // Removed checkUsernameMutation from dependencies

  return {
    ...validationResult,
    isLoading: checkUsernameMutation.isPending,
  };
};
