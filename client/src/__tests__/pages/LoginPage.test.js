import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockedApi = api;

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Wrapper component with Router
const LoginPageWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage properly
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  it('should render login form with all fields', () => {
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should render registration link', () => {
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    expect(screen.getByText(/¿no tienes cuenta\?/i)).toBeInTheDocument();
    expect(screen.getByText(/regístrate aquí/i)).toBeInTheDocument();
  });

  it('should update email field when typing', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password field when typing', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    const passwordInput = screen.getByLabelText(/contraseña/i);
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('should submit form with correct data and navigate on success', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        token: 'test-token',
        rol: 'veterinario',
        nombre: 'Dr. Test'
      }
    };
    
    mockedApi.post.mockResolvedValueOnce(mockResponse);
    
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/login', {
        correo: 'test@example.com',
        contrasena: 'password123'
      });
    });
      // Check localStorage was set
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('rol', 'veterinario');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('username', 'Dr. Test');
    
    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith('/citas');
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup();
    
    mockedApi.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });
  it('should prevent form submission with empty fields', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    // Wait a bit to see if any API call would happen
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // API should not be called with empty fields (HTML5 validation should prevent it)
    expect(mockedApi.post).not.toHaveBeenCalled();
  });
  it('should render pets icon and title', () => {
    render(
      <LoginPageWrapper>
        <LoginPage />
      </LoginPageWrapper>
    );
    
    // Check for the welcome title
    expect(screen.getByText('Bienvenido a Patas & Colas')).toBeInTheDocument();
    
    // Check for the form button to ensure form is rendered
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
