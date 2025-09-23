import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer', () => {
  it('should render copyright text', () => {
    renderFooter();
    expect(screen.getByText('© 2025 furlink')).toBeInTheDocument();
  });

  it('should render Terms and Conditions link', () => {
    renderFooter();
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
  });

  it('should render Privacy Policy link', () => {
    renderFooter();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('should render social media links', () => {
    renderFooter();
    const socialLinks = screen.getAllByRole('link');
    const socialMediaLinks = socialLinks.filter(link => 
      link.getAttribute('aria-label') === 'Facebook' ||
      link.getAttribute('aria-label') === 'Instagram' ||
      link.getAttribute('aria-label') === 'Email'
    );
    expect(socialMediaLinks).toHaveLength(3);
  });
});