import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const renderNavbar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Navbar {...props} />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  describe('when user is not authenticated', () => {
    it('should render furlink logo', () => {
      renderNavbar();
      expect(screen.getByText('furlink')).toBeInTheDocument();
    });

    it('should render About furlink link', () => {
      renderNavbar();
      expect(screen.getByText('About furlink')).toBeInTheDocument();
    });

    it('should render Become a service provider link', () => {
      renderNavbar();
      expect(screen.getByText('Become a service provider')).toBeInTheDocument();
    });

    it('should render Login and Signup links', () => {
      renderNavbar();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Signup')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated as pet owner', () => {
    it('should render Become a Service Provider link', () => {
      renderNavbar({ isAuthenticated: true, userRole: 'pet_owner' });
      expect(screen.getByText('Become a Service Provider')).toBeInTheDocument();
    });

    it('should render profile icon', () => {
      renderNavbar({ isAuthenticated: true, userRole: 'pet_owner' });
      expect(screen.getByText('👤')).toBeInTheDocument();
    });

    it('should not render Login and Signup links', () => {
      renderNavbar({ isAuthenticated: true, userRole: 'pet_owner' });
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Signup')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated as service provider', () => {
    it('should not render Become a Service Provider link', () => {
      renderNavbar({ isAuthenticated: true, userRole: 'service_provider' });
      expect(screen.queryByText('Become a Service Provider')).not.toBeInTheDocument();
    });

    it('should render profile icon', () => {
      renderNavbar({ isAuthenticated: true, userRole: 'service_provider' });
      expect(screen.getByText('👤')).toBeInTheDocument();
    });
  });
});