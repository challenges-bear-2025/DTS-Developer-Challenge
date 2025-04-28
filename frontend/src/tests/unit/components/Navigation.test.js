import { render, screen } from '@testing-library/react';
import Navigation from '../../../components/Navigation';  

describe('Navigation Component', () => {
  it('renders the navigation component correctly', () => {
    render(<Navigation />);

    const navContainer = screen.getByRole('navigation');
    expect(navContainer).toBeInTheDocument();
  });

  it('renders the breadcrumb links correctly', () => {
    render(<Navigation />);

    const breadcrumbLinks = screen.getAllByRole('link');
    expect(breadcrumbLinks).toHaveLength(3); 

    expect(breadcrumbLinks[0]).toHaveTextContent('HMCTS Employee Portal');
    expect(breadcrumbLinks[1]).toHaveTextContent('Your work and cases');
    expect(breadcrumbLinks[2]).toHaveTextContent('Task manager');
  });

  it('renders the correct href attributes for each breadcrumb', () => {
    render(<Navigation />);

    const breadcrumbLinks = screen.getAllByRole('link');
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/');
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/');
    expect(breadcrumbLinks[2]).toHaveAttribute('href', '/');
  });
});