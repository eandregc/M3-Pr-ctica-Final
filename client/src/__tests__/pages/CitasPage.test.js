import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CitasPage from '../../pages/CitasPage';
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
const CitasPageWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('CitasPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage properly
    const localStorageMock = {
      getItem: jest.fn((key) => {
        const items = {
          'token': 'test-token',
          'rol': 'cliente',
          'username': 'Test User'
        };
        return items[key] || null;
      }),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });
  it('should render citas page with loading state', async () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    // Should show loading skeletons (check by class name instead of testid)
    await waitFor(() => {
      expect(screen.getByText('Citas Veterinarias')).toBeInTheDocument();
    });
    
    // Check for skeleton elements by their MUI class
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
  it('should fetch and display citas on load', async () => {
    const mockCitas = [
      {
        id: 1,
        fecha: '2024-12-01T10:00:00.000Z',
        motivo: 'Consulta general',
        mascota_nombre: null, // This makes it show "Mascota sin nombre"
        nombre_cliente: 'John Doe',
        telefono: '123456789',
        estado: 'programada'
      }
    ];
    
    const mockMascotas = [
      {
        id: 1,
        nombre: 'Buddy',
        especie: 'Perro',
        raza: 'Golden Retriever'
      }
    ];
    
    mockedApi.get.mockImplementation((url) => {
      if (url === '/citas') {
        return Promise.resolve({ data: mockCitas });
      }
      if (url === '/mascotas/user') {
        return Promise.resolve({ data: mockMascotas });
      }
    });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Mascota sin nombre')).toBeInTheDocument();
      expect(screen.getByText('Consulta general')).toBeInTheDocument();
    });
  });
  it('should redirect to login if unauthorized', async () => {
    mockedApi.get.mockRejectedValueOnce({
      response: { status: 401 }
    });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      expect(window.localStorage.clear).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  it('should show add appointment button for clients', async () => {
    // Update localStorage for this test
    window.localStorage.getItem = jest.fn((key) => {
      const items = {
        'token': 'test-token',
        'rol': 'cliente',
        'username': 'Test User'
      };
      return items[key] || null;
    });
    
    mockedApi.get.mockImplementation((url) => {
      if (url === '/citas') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/mascotas/user') {
        return Promise.resolve({ data: [] });
      }
    });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      const addButton = screen.getByText('Programar Cita');
      expect(addButton).toBeInTheDocument();
    });
  });
  it('should open dialog when add button is clicked', async () => {
    // Update localStorage for this test
    window.localStorage.getItem = jest.fn((key) => {
      const items = {
        'token': 'test-token',
        'rol': 'cliente',
        'username': 'Test User'
      };
      return items[key] || null;
    });
    
    const mockMascotas = [
      {
        id: 1,
        nombre: 'Buddy',
        especie: 'Perro'
      }
    ];
    
    mockedApi.get.mockImplementation((url) => {
      if (url === '/citas') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/mascotas/user') {
        return Promise.resolve({ data: mockMascotas });
      }
    });
    
    const user = userEvent.setup();
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      const addButton = screen.getByText('Programar Cita');
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Programar Cita');
    await user.click(addButton);
    
    // Should open dialog
    await waitFor(() => {
      expect(screen.getByText('Programar Nueva Cita')).toBeInTheDocument();
    });
  });
  it('should display welcome message', async () => {
    // Update localStorage for this test
    window.localStorage.getItem = jest.fn((key) => {
      const items = {
        'token': 'test-token',
        'rol': 'veterinario',
        'username': 'Dr. Smith'
      };
      return items[key] || null;
    });
    
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Citas Veterinarias')).toBeInTheDocument();
      expect(screen.getByText('Gestiona las citas pendientes con tus pacientes')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    // Should not crash and should stop loading
    await waitFor(() => {
      // The component should handle the error and stop loading
      expect(mockedApi.get).toHaveBeenCalledWith('/citas');
    });
  });
  it('should format dates correctly', async () => {
    const mockCitas = [
      {
        id: 1,
        fecha: '2024-12-01T10:00:00.000Z',
        motivo: 'Consulta',
        mascota_nombre: 'Buddy',
        nombre_cliente: 'John',
        telefono: '123456789',
        estado: 'programada'
      }
    ];
    
    mockedApi.get.mockImplementation((url) => {
      if (url === '/citas') {
        return Promise.resolve({ data: mockCitas });
      }
      if (url === '/mascotas/user') {
        return Promise.resolve({ data: [] });
      }
    });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      // Should display some date format - look for Sunday in Spanish
      expect(screen.getByText(/domingo.*diciembre.*2024/i)).toBeInTheDocument();
    });
  });
  it('should fetch user mascotas for clients', async () => {
    // Update localStorage for this test
    window.localStorage.getItem = jest.fn((key) => {
      const items = {
        'token': 'test-token',
        'rol': 'cliente',
        'username': 'Test User'
      };
      return items[key] || null;
    });
    
    mockedApi.get.mockImplementation((url) => {
      if (url === '/citas') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/mascotas/user') {
        return Promise.resolve({ data: [] });
      }
    });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/mascotas/user');
    });
  });
  it('should not fetch mascotas for veterinarios', async () => {
    // Update localStorage for this test
    window.localStorage.getItem = jest.fn((key) => {
      const items = {
        'token': 'test-token',
        'rol': 'veterinario',
        'username': 'Dr. Smith'
      };
      return items[key] || null;
    });
    
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <CitasPageWrapper>
        <CitasPage />
      </CitasPageWrapper>
    );
    
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/citas');
      expect(mockedApi.get).not.toHaveBeenCalledWith('/mascotas/user');
    });
  });
});
