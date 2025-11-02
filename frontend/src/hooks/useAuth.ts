// frontend/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  login as authLogin, 
  logout as authLogout, 
  checkAuth as authCheckAuth, 
  clearError as authClearError,
  setUpdateCallback,
  getAuthState
} from '../features/auth';

export const useAuth = () => {
  const [state, setState] = useState(getAuthState);

  useEffect(() => {
    console.log('useAuth mounted');
    
    const handleUpdate = () => {
      console.log('State updated');
      setState(getAuthState());
    };

    setUpdateCallback(handleUpdate);

    return () => {
      setUpdateCallback(null);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('Login called');
    await authLogin(email, password);
  }, []);

  const logout = useCallback(() => {
    authLogout();
  }, []);

  const checkAuth = useCallback(async () => {
    console.log('checkAuth called');
    await authCheckAuth();
  }, []);

  const clearError = useCallback(() => {
    authClearError();
  }, []);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
  };
};