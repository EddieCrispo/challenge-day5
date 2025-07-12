import { useState } from 'react';

// In-memory storage to replace localStorage/sessionStorage
const memoryStorage = {
  data: {},
  setItem: (key, value) => {
    memoryStorage.data[key] = value;
  },
  getItem: (key) => {
    return memoryStorage.data[key] || null;
  },
  removeItem: (key) => {
    delete memoryStorage.data[key];
  },
  clear: () => {
    memoryStorage.data = {};
  }
};

// Custom hook to replace useLocalStorage
export const useMemoryStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = memoryStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      memoryStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to memory storage:', error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook to replace useSessionStorage
export const useSessionMemoryStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = memoryStorage.getItem(`session_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      memoryStorage.setItem(`session_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to session memory storage:', error);
    }
  };

  return [storedValue, setValue];
};

// Clear session data function
export const clearSessionData = () => {
  Object.keys(memoryStorage.data).forEach(key => {
    if (key.startsWith('session_')) {
      memoryStorage.removeItem(key);
    }
  });
};