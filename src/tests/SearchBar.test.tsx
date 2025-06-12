import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/header/SearchBar';

jest.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ children, ...props }: any) => (
    <input {...props} role="textbox">
      {children}
    </input>
  )
}));

const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { ...originalLocation, href: '' },
    writable: true
  });
});
afterAll(() => {
  Object.defineProperty(window, 'location', originalLocation);
});

describe('SearchBar', () => {
  const handleLocationMock = jest.fn();

  beforeEach(() => {
    window.location.href = '';
    jest.clearAllMocks();
  });

  it('matches mobile snapshot', () => {
    const { asFragment } = render(<SearchBar isMobile={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches desktop snapshot', () => {
    const { asFragment } = render(<SearchBar isMobile={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches focused state snapshot', () => {
    const { asFragment } = render(<SearchBar isMobile={false} />);
    fireEvent.focus(screen.getByPlaceholderText('Search articles...'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('updates search query on input', async () => {
    render(<SearchBar isMobile={true} />);
    const input = screen.getByPlaceholderText('Search articles...');
    await userEvent.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('navigates on enter press with query (mobile)', async () => {
    render(<SearchBar isMobile={true} />);
    const input = screen.getByPlaceholderText('Search articles...');

    await userEvent.type(input, 'react hooks');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(window.location.href).toContain('/blog?search=react%20hooks');
  });

  it('navigates on enter press with query (desktop)', async () => {
    render(<SearchBar isMobile={false} />);
    const input = screen.getByPlaceholderText('Search articles...');

    await userEvent.type(input, 'next js');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(window.location.href).toContain('/blog?search=next%20js');
  });

  it('does not navigate with empty query', async () => {
    render(<SearchBar isMobile={false} />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(window.location.href).toBe('');
  });

  it('handles focus/blur events (desktop)', async () => {
    render(<SearchBar isMobile={false} />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.focus(input);
    expect(screen.getByTestId('search-icon').parentElement).toHaveClass(
      'relative'
    ); // Verify focus state

    fireEvent.blur(input);
    setTimeout(() => {
      expect(screen.getByTestId('search-icon').parentElement).not.toHaveClass(
        'relative'
      ); // Verify blur effect
    }, 250);
  });
});
