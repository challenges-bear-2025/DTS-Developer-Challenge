import { render, screen } from '@testing-library/react';
import Header from '../../../components/Header';

describe('Header Component', () => {
  
    test('renders the header with the correct logo', () => {
    render(<Header />);

    const logo = screen.getByRole('img', { name: /GOV\.UK/i });
    expect(logo).toBeInTheDocument();
  });

  test('should contain a link to the homepage', () => {
    render(<Header />);

    const homepageLink = screen.getByRole('link', { name: /GOV\.UK/i });
    expect(homepageLink).toHaveAttribute('href', '/');
  });

});