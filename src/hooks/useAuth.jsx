import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Hook for form validation
export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name, value) => {
    if (!validationRules[name]) return '';
    
    for (const rule of validationRules[name]) {
      const error = rule(value);
      if (error) return error;
    }
    return '';
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationRules]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setIsValid(false);
  };

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    reset,
    setValues
  };
};

// Hook for login functionality
export const useLogin = () => {
  const { login, loading, error, clearError } = useAuth();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const validationRules = {
    email: [
      (value) => !value ? 'Email is required' : '',
      (value) => !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : ''
    ],
    password: [
      (value) => !value ? 'Password is required' : '',
      (value) => value.length < 6 ? 'Password must be at least 6 characters' : ''
    ]
  };

  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    reset
  } = useFormValidation({ email: '', password: '' }, validationRules);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      return { success: false, error: 'Too many login attempts. Please try again later.' };
    }

    if (!isValid) {
      return { success: false, error: 'Please fix the errors in the form.' };
    }

    const result = await login(values.email, values.password);
    
    if (result.success) {
      setLoginAttempts(0);
      reset();
    } else {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts >= 4) {
        setIsLocked(true);
        setTimeout(() => setIsLocked(false), 15 * 60 * 1000); // 15 minutes
      }
    }

    return result;
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return {
    values,
    errors,
    isValid,
    loading,
    error,
    isLocked,
    loginAttempts,
    handleChange,
    handleBlur,
    handleLogin,
    reset
  };
};

// Hook for registration functionality
export const useRegister = () => {
  const { register, loading, error, clearError } = useAuth();

  const validationRules = {
    firstName: [
      (value) => !value ? 'First name is required' : '',
      (value) => value.length < 2 ? 'First name must be at least 2 characters' : ''
    ],
    lastName: [
      (value) => !value ? 'Last name is required' : '',
      (value) => value.length < 2 ? 'Last name must be at least 2 characters' : ''
    ],
    email: [
      (value) => !value ? 'Email is required' : '',
      (value) => !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : ''
    ],
    password: [
      (value) => !value ? 'Password is required' : '',
      (value) => value.length < 8 ? 'Password must be at least 8 characters' : '',
      (value) => !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number' : ''
    ],
    confirmPassword: [
      (value) => !value ? 'Please confirm your password' : ''
    ]
  };

  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    reset,
    setValues
  } = useFormValidation({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }, validationRules);

  // Custom validation for password confirmation
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (values.confirmPassword && values.password !== values.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [values.password, values.confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!isValid || confirmPasswordError) {
      return { success: false, error: 'Please fix the errors in the form.' };
    }

    const { confirmPassword, ...userData } = values;
    const result = await register(userData);
    
    if (result.success) {
      reset();
    }

    return result;
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return {
    values,
    errors: { ...errors, confirmPassword: confirmPasswordError },
    isValid: isValid && !confirmPasswordError,
    loading,
    error,
    handleChange,
    handleBlur,
    handleRegister,
    reset
  };
};

// Hook for protected routes
export const useProtectedRoute = (requiredRole = null) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthorized(false);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, requiredRole, hasRole]);

  return {
    isAuthenticated,
    isAuthorized,
    user
  };
};

// Hook for API calls with authentication
export const useAuthenticatedAPI = () => {
  const { getToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      // If token is expired or invalid, logout user
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => makeRequest(url);
  const post = (url, data) => makeRequest(url, { method: 'POST', body: JSON.stringify(data) });
  const put = (url, data) => makeRequest(url, { method: 'PUT', body: JSON.stringify(data) });
  const del = (url) => makeRequest(url, { method: 'DELETE' });

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    makeRequest
  };
};

// Hook for user profile management
export const useUserProfile = () => {
  const { user } = useAuth();
  const { loading, error, put } = useAuthenticatedAPI();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const updateProfile = async (updates) => {
    const result = await put('/api/user/profile', updates);
    if (result.success) {
      setProfile(result.data);
    }
    return result;
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};