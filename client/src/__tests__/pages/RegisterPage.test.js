import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage';
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

// Mock setTimeout
jest.useFakeTimers();

// Wrapper component with Router
const RegisterPageWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('RegisterPage Component', () => {
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

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should render registration form with all fields', () => {
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de usuario/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('should render login link', () => {
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    expect(screen.getByText(/¿ya tienes una cuenta\?/i)).toBeInTheDocument();
    expect(screen.getByText(/inicia sesión aquí/i)).toBeInTheDocument();
  });

  it('should update form fields when typing', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should change user role when dropdown is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const roleSelect = screen.getByLabelText(/tipo de usuario/i);
    
    // Click on the select to open dropdown
    await user.click(roleSelect);
    
    // Select veterinario option
    const veterinarioOption = screen.getByText(/médico veterinario/i);
    await user.click(veterinarioOption);
    
    // Check if the value changed
    expect(roleSelect).toHaveDisplayValue('Médico veterinario');
  });

  it('should submit form with correct data and show success message', async () => {
    const user = userEvent.setup();
    
    mockedApi.post.mockResolvedValueOnce({});
    
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/register', {
        nombre: 'John Doe',
        correo: 'john@example.com',
        contrasena: 'password123',
        rol: 'cliente'
      });
    });
    
    // Check success message appears
    await waitFor(() => {
      expect(screen.getByText(/usuario registrado\. redirigiendo\.\.\./i)).toBeInTheDocument();
    });
    
    // Fast-forward time to trigger navigation
    jest.advanceTimersByTime(2000);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show error message on registration failure', async () => {
    const user = userEvent.setup();
    
    mockedApi.post.mockRejectedValueOnce(new Error('Registration failed'));
    
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error al registrar usuario/i)).toBeInTheDocument();
    });
  });

  it('should default to cliente role', () => {
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const roleSelect = screen.getByLabelText(/tipo de usuario/i);
    expect(roleSelect).toHaveDisplayValue('Dueño de mascota');
  });
  it('should prevent form submission with empty fields', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    await user.click(submitButton);
    
    // Wait a bit to see if any API call would happen
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // API should not be called with empty required fields due to HTML5 validation
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('should render pets icon and title', () => {
    render(
      <RegisterPageWrapper>
        <RegisterPage />
      </RegisterPageWrapper>
    );
    
    expect(screen.getByText(/registro de usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/únete a nuestra comunidad/i)).toBeInTheDocument();
  });
});
