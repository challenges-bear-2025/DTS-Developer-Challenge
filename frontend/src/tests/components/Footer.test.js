import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer'; 

describe('Footer Component', () => {

  test('renders footer correctly', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    const licenceLink = screen.getByText(/Open Government Licence v3.0/);
    expect(licenceLink).toBeInTheDocument();
    expect(licenceLink).toHaveAttribute('href', 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/');
    
    const copyrightLink = screen.getByText(/© Crown copyright/);
    expect(copyrightLink).toBeInTheDocument();
    expect(copyrightLink).toHaveAttribute('href', 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/');
  });
});