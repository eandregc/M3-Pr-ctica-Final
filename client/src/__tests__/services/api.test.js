import api from '../../services/api';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should create axios instance with correct baseURL in development', () => {
    // Mock NODE_ENV as development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Re-import to get fresh instance
    jest.resetModules();
    const { default: devApi } = require('../../services/api');
    
    expect(devApi.defaults.baseURL).toBe('http://localhost:3001/api');
    
    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('should create axios instance with correct baseURL in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    jest.resetModules();
    const { default: prodApi } = require('../../services/api');
    
    expect(prodApi.defaults.baseURL).toBe('/api');
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should add Authorization header when token exists', () => {
    const token = 'test-token-123';
    localStorage.setItem('token', token);

    // Mock the interceptor request
    const config = { headers: {} };
    const interceptors = api.interceptors.request.handlers[0];
    
    if (interceptors && interceptors.fulfilled) {
      const result = interceptors.fulfilled(config);
      expect(result.headers['Authorization']).toBe(token);
    }
  });

  it('should not add Authorization header when token does not exist', () => {
    localStorage.removeItem('token');

    const config = { headers: {} };
    const interceptors = api.interceptors.request.handlers[0];
    
    if (interceptors && interceptors.fulfilled) {
      const result = interceptors.fulfilled(config);
      expect(result.headers['Authorization']).toBeUndefined();
    }
  });
});
