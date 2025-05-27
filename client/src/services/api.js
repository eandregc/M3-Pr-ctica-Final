import axios from 'axios';

// Use environment-based API URL
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, the API is served from the same domain
    return '/api';
  }
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

export default api;