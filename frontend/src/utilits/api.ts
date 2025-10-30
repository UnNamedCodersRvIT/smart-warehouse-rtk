// frontend/src/utils/api.ts

const API_BASE_URL = 'http://localhost:8000';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Если 401 Unauthorized - очищаем токен
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Специализированные методы
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data?: any) => 
    apiRequest(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  put: (endpoint: string, data?: any) => 
    apiRequest(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: 'DELETE' }),
};

export default api;