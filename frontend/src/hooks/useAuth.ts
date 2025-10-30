// frontend/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  login as authLogin, 
  logout as authLogout, 
  checkAuth as authCheckAuth, 
  clearError,
  setUpdateCallback,
  getAuthState,
  getIsAuthenticated,
  getIsLoading,
  getError,
  getUser
} from '../features/auth';

export const useAuth = () => {
  const [state, setState] = useState(getAuthState);

  useEffect(() => {
    // Устанавливаем callback для обновления состояния
    setUpdateCallback(() => {
      setState(getAuthState());
    });

    // Проверяем авторизацию при монтировании
    authCheckAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authLogin(email, password);
  }, []);

  const logout = useCallback(() => {
    authLogout();
  }, []);

  const checkAuth = useCallback(() => {
    authCheckAuth();
  }, []);

  const clearAuthError = useCallback(() => {
    clearError();
  }, []);

  return {
    user: getUser(),
    isAuthenticated: getIsAuthenticated(),
    isLoading: getIsLoading(),
    error: getError(),
    login,
    logout,
    checkAuth,
    clearError: clearAuthError,
  };
};