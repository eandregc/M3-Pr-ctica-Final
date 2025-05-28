import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock react-router-dom to replace BrowserRouter with a test-friendly version
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => children, // Just render children without router wrapping
}));

// Mock the child components
jest.mock('../pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../pages/RegisterPage', () => {
  return function MockRegisterPage() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('../pages/CitasPage', () => {
  return function MockCitasPage() {
    return <div data-testid="citas-page">Citas Page</div>;
  };
});

jest.mock('../components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Custom render function that wraps App with MemoryRouter
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  it('should render navbar and footer on all routes', () => {
    renderWithRouter(['/']);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render login page on root route', () => {
    renderWithRouter(['/']);
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render register page on /register route', () => {
    renderWithRouter(['/register']);
    
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  it('should render citas page on /citas route', () => {
    renderWithRouter(['/citas']);
    
    expect(screen.getByTestId('citas-page')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    renderWithRouter(['/']);
    
    // Should render all components
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render 404 for unknown routes', () => {
    renderWithRouter(['/unknown-route']);
    
    // Should still render navbar and footer
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Should not render any page component for unknown route
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('register-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('citas-page')).not.toBeInTheDocument();
  });
});
