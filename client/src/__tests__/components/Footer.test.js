import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

// Wrapper component with Router
const FooterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Footer Component', () => {
  it('should render footer with copyright text', () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    expect(screen.getByText(/© 2025 Patas & Colas Veterinaria/)).toBeInTheDocument();
  });

  it('should render footer with all rights reserved text', () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
  });

  it('should have proper footer role', () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('MuiBox-root');
  });
});
