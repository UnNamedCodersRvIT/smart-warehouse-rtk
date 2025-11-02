// frontend/src/features/auth.ts
import { API_BASE_URL } from '../config/api';

// Объявляем интерфейсы прямо здесь, если файл types/auth.ts не создан
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Остальной код без изменений...
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

let updateCallback: (() => void) | null = null;

export const setUpdateCallback = (callback: () => void) => {
  updateCallback = callback;
};

const updateState = () => {
  if (updateCallback) {
    updateCallback();
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  authState.isLoading = true;
  authState.error = null;
  updateState();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка авторизации');
    }

    const data = await response.json();
    
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    authState = {
      user: data.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Ошибка сети',
    };
    throw error;
  } finally {
    updateState();
  }
};

export const checkAuth = async (): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        authState = {
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      } else {
        logout();
      }
    } catch {
      logout();
    }
  } else {
    logout();
  }
  updateState();
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  authState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
  updateState();
};

export const clearError = (): void => {
  authState.error = null;
  updateState();
};

// Геттеры
export const getAuthState = (): AuthState => ({ ...authState });
export const getIsAuthenticated = (): boolean => authState.isAuthenticated;
export const getIsLoading = (): boolean => authState.isLoading;
export const getError = (): string | null => authState.error;
export const getUser = (): User | null => authState.user;