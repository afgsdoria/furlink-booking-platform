import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Link with service providers/)).toBeInTheDocument();
  });

  it('should render the home page by default', () => {
    render(<App />);
    expect(screen.getByText('Book now')).toBeInTheDocument();
  });
});