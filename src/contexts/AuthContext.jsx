// AuthContext.js
// This file contains the authentication context and provider
// It manages the global authentication state and provides auth functions

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
// This will be used to share auth state across components
const AuthContext = createContext();

/**
 * AuthProvider Component
 * This component wraps the entire app and provides authentication state
 * and functions to all child components
 */
export const AuthProvider = ({ children }) => {
  // State management for authentication
  const [user, setUser] = useState(null);        // Current logged-in user data
  const [loading, setLoading] = useState(true);  // Loading state for async operations
  const [error, setError] = useState(null);      // Error messages from auth operations

  /**
   * useEffect hook to check authentication status on app load
   * This simulates checking if user has an existing session
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would be an API call to validate session/token
        // For demo purposes, we simulate checking stored user data
        const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (savedUser) {
          // If user data exists, restore the user session
          setUser(savedUser);
        }
      } catch (err) {
        // Handle any errors during auth check
        console.error('Auth check failed:', err);
      } finally {
        // Always set loading to false when check is complete
        setLoading(false);
      }
    };

    // Execute the auth check when component mounts
    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Login function
   * Authenticates user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Object} - Success status and error message if any
   */
  const login = async (email, password) => {
    setLoading(true);  // Show loading state
    setError(null);    // Clear any previous errors
    
    try {
      // Simulate API call delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      // In a real app, this would be an API call to your backend
      if (email === 'user@example.com' && password === 'password') {
        // Create user data object
        const userData = {
          id: 1,
          email: email,
          name: 'John Doe',
          role: 'user'
        };
        
        // Update state with user data
        setUser(userData);
        // Store user data (in real app, you'd store JWT token)
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        // Invalid credentials
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      // Handle login errors
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      // Always hide loading state when done
      setLoading(false);
    }
  };

  /**
   * Register function
   * Creates a new user account
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Object} - Success status and error message if any
   */
  const register = async (name, email, password) => {
    setLoading(true);  // Show loading state
    setError(null);    // Clear any previous errors
    
    try {
      // Simulate API call delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration logic
      // In a real app, this would be an API call to create user
      const userData = {
        id: Date.now(), // Generate unique ID (use proper UUID in production)
        email: email,
        name: name,
        role: 'user'
      };
      
      // Update state with new user data
      setUser(userData);
      // Store user data (in real app, you'd store JWT token)
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      // Handle registration errors
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      // Always hide loading state when done
      setLoading(false);
    }
  };

  /**
   * Logout function
   * Clears user session and removes stored data
   */
  const logout = () => {
    setUser(null);                              // Clear user from state
    localStorage.removeItem('user');            // Remove stored user data
    setError(null);                             // Clear any errors
  };

  /**
   * Context value object
   * This contains all the data and functions that will be available
   * to components that use the useAuth hook
   */
  const value = {
    user,                           // Current user data
    login,                          // Login function
    register,                       // Register function
    logout,                         // Logout function
    loading,                        // Loading state
    error,                          // Error messages
    isAuthenticated: !!user         // Boolean indicating if user is logged in
  };

  // Provide the auth context to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth custom hook
 * This hook provides easy access to authentication context
 * Use this in any component that needs authentication functionality
 * @returns {Object} - Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Ensure hook is used within AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};