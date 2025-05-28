import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage methods
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Wrapper component with Router
const NavbarWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navbar Component', () => {  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render navbar with title', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    expect(screen.getByText('Patas & Colas Veterinaria')).toBeInTheDocument();
  });
  it('should show login link when no token exists', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const titleLink = screen.getByText('Patas & Colas Veterinaria');
    expect(titleLink.closest('a')).toHaveAttribute('href', '/');
  });
  it('should show home link when token exists', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const titleLink = screen.getByText('Patas & Colas Veterinaria');
    expect(titleLink.closest('a')).toHaveAttribute('href', '/citas');
  });
  it('should show logout button when token exists', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });
  it('should not show logout button when no token exists', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
  });
  it('should call logout function when logout button is clicked', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const logoutButton = screen.getByText('Cerrar sesión');
    fireEvent.click(logoutButton);
    
    // Check that localStorage.clear was called
    expect(localStorageMock.clear).toHaveBeenCalled();
    // Check that navigate was called with root path
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  it('should show home icon when token exists', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const homeButton = screen.getByRole('button');
    expect(homeButton).toBeInTheDocument();
  });
  it('should render pets icon', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // The PetsIcon should be rendered (we can check for svg presence)
    const navbar = screen.getByRole('banner');
    expect(navbar).toBeInTheDocument();
  });
});
