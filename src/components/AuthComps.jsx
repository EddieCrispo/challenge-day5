import React, { useState } from 'react';
import { useLogin, useRegister, useProtectedRoute } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';

// Login Component
export const LoginForm = ({ onSuccess, onToggleMode }) => {
  const {
    values,
    errors,
    isValid,
    loading,
    error,
    isLocked,
    loginAttempts,
    handleChange,
    handleBlur,
    handleLogin
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    const result = await handleLogin(e);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isLocked && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Account temporarily locked due to too many failed attempts. Please try again later.
        </div>
      )}
      
      {loginAttempts > 0 && loginAttempts < 5 && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-400 text-orange-700 rounded">
          Login attempt {loginAttempts} of 5. Account will be locked after 5 failed attempts.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || isLocked}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || isLocked}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading || isLocked}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {onToggleMode && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
};

// Registration Component
export const RegisterForm = ({ onSuccess, onToggleMode }) => {
  const {
    values,
    errors,
    isValid,
    loading,
    error,
    handleChange,
    handleBlur,
    handleRegister
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    const result = await handleRegister(e);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      {onToggleMode && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
};

// Combined Auth Modal Component
export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  if (!isOpen) return null;

  const handleSuccess = (user) => {
    if (onSuccess) onSuccess(user);
    if (onClose) onClose();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children, requiredRole, fallback }) => {
  const { isAuthenticated, isAuthorized } = useProtectedRoute(requiredRole);

  if (!isAuthenticated) {
    return fallback || <div className="text-center p-8">Please log in to access this page.</div>;
  }

  if (!isAuthorized) {
    return fallback || <div className="text-center p-8">You don't have permission to access this page.</div>;
  }

  return children;
};

// User Avatar Component
export const UserAvatar = ({ size = 'md' }) => {
  const { user } = useAuth();
  
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className={`${sizes[size]} bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold`}>
      {user.avatar ? (
        <img 
          src={user.avatar} 
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// User Menu Component
export const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
      >
        <UserAvatar size="sm" />
        <span className="hidden md:block">{user.firstName} {user.lastName}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
          
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </a>
          
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </a>
          
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

// Auth Status Component
export const AuthStatus = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-red-500">Not authenticated</div>;
  }

  return (
    <div className="text-green-500">
      Authenticated as {user.firstName} {user.lastName}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};