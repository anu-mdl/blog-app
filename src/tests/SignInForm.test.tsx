import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from '@/components/auth/SignInForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

jest.mock('@/api/auth/sign-in', () => ({
  authenticateUser: jest.fn()
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  ))
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn(props => <input {...props} />)
}));

jest.mock('@/components/ui/label', () => ({
  Label: jest.fn(({ children, ...props }) => (
    <label {...props}>{children}</label>
  ))
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: jest.fn(props => <input type="checkbox" {...props} />)
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: jest.fn(() => <hr />)
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: jest.fn(({ children }) => <div role="alert">{children}</div>),
  AlertDescription: jest.fn(({ children }) => <div>{children}</div>)
}));

jest.mock('lucide-react', () => ({
  Eye: () => <span>EyeIcon</span>,
  EyeOff: () => <span>EyeOffIcon</span>,
  Github: () => <span>GithubIcon</span>,
  Mail: () => <span>MailIcon</span>,
  Loader2: () => <span>LoaderIcon</span>,
  AlertCircle: () => <span>AlertCircleIcon</span>
}));

describe('SignInForm', () => {
  const mockAuthenticateUser =
    jest.requireMock('@/api/auth/sign-in').authenticateUser;

  beforeEach(() => {
    mockAuthenticateUser.mockReset();
  });

  it('renders correctly', () => {
    const { container } = render(<SignInForm />);
    expect(container).toMatchSnapshot();
  });

  it('shows validation errors', async () => {
    render(<SignInForm />);

    await userEvent.click(screen.getByText('Sign in'));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<SignInForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter your password'),
      'test'
    );
    await userEvent.click(
      screen.getByRole('button', { name: /show password/i })
    );

    expect(screen.getByPlaceholderText('Enter your password')).toHaveAttribute(
      'type',
      'text'
    );
  });

  it('submits successfully', async () => {
    mockAuthenticateUser.mockResolvedValue({ success: true });
    render(<SignInForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter your email'),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter your password'),
      'password123'
    );
    await userEvent.click(screen.getByText('Sign in'));

    expect(await screen.findByText('Signing in...')).toBeInTheDocument();
  });

  it('shows API errors', async () => {
    mockAuthenticateUser.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    render(<SignInForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter your email'),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter your password'),
      'wrongpass'
    );
    await userEvent.click(screen.getByText('Sign in'));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
