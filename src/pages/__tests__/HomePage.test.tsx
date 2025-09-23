import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('should render the main heading', () => {
    renderHomePage();
    expect(screen.getByText(/Link with service providers/)).toBeInTheDocument();
    expect(screen.getByText(/in just one click/)).toBeInTheDocument();
  });

  it('should render Book now button', () => {
    renderHomePage();
    const bookNowButton = screen.getByText('Book now');
    expect(bookNowButton).toBeInTheDocument();
    expect(bookNowButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should render What furlink is section', () => {
    renderHomePage();
    expect(screen.getByText('What furlink is')).toBeInTheDocument();
    expect(screen.getByText(/furlink offers a hassle-free experience/)).toBeInTheDocument();
  });

  it('should render How to use furlink section', () => {
    renderHomePage();
    expect(screen.getByText('How to use furlink')).toBeInTheDocument();
    expect(screen.getByText('pet owner')).toBeInTheDocument();
    expect(screen.getByText('service provider')).toBeInTheDocument();
  });

  it('should render hero image', () => {
    renderHomePage();
    const heroImage = screen.getByAltText('Cat and dog getting groomed');
    expect(heroImage).toBeInTheDocument();
  });

  it('should render navbar and footer', () => {
    renderHomePage();
    expect(screen.getByText('furlink')).toBeInTheDocument(); // Logo in navbar
    expect(screen.getByText('© 2025 furlink')).toBeInTheDocument(); // Copyright in footer
  });
});