import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/header/ThemeToggle';

jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}));

jest.mock('lucide-react', () => ({
  Sun: () => <svg data-testid="sun-icon" />,
  Moon: () => <svg data-testid="moon-icon" />
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  )
}));

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches light theme snapshot', () => {
    require('next-themes').useTheme.mockImplementation(() => ({
      theme: 'light',
      setTheme: mockSetTheme
    }));

    const { asFragment } = render(<ThemeToggle />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches dark theme snapshot', () => {
    require('next-themes').useTheme.mockImplementation(() => ({
      theme: 'dark',
      setTheme: mockSetTheme
    }));

    const { asFragment } = render(<ThemeToggle />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('toggles theme on click', async () => {
    require('next-themes').useTheme.mockImplementation(() => ({
      theme: 'light',
      setTheme: mockSetTheme
    }));

    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
