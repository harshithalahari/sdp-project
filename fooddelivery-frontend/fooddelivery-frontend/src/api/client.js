import axios from 'axios';
import { setCsrfHeader } from '../utils/csrfToken';

cgit status

  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add token and CSRF protection to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request - Token from localStorage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Authorization header set');
  } else {
    console.log('API Request - No token found');
  }
  
  console.log('API Request URL:', config.url);
  console.log('API Request Headers:', config.headers);
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


