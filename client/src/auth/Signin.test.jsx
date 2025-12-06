import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signin from './Signin.jsx';
import { signin } from '../lib/api-auth.js';
import auth from '../lib/auth-helper.js';

// Router mocks
const mockNavigate = jest.fn();
let mockLocation = { pathname: '/signin', state: null };

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  // simple Link mock – no refs needed here
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

// API + auth mocks
jest.mock('../lib/api-auth.js', () => ({
  __esModule: true,
  signin: jest.fn(),
}));

jest.mock('../lib/auth-helper.js', () => ({
  __esModule: true,
  default: {
    authenticate: jest.fn(),
    isAuthenticated: jest.fn(),
    clearJWT: jest.fn(),
  },
}));

describe('Signin', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLocation = { pathname: '/signin', state: null };
    signin.mockReset();
    auth.authenticate.mockReset();

    // mimic real behaviour (call callback so navigate() runs)
    auth.authenticate.mockImplementation((data, cb) => cb && cb());
  });

  test('lets the user type email and password', () => {
    render(<Signin />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    expect(emailInput).toHaveValue('user@example.com');
    expect(passwordInput).toHaveValue('secret');
  });

  test('submits credentials and redirects to "/" by default', async () => {
    signin.mockResolvedValueOnce({
      token: 'jwt-123',
      user: {
        _id: '1',
        employeeId: 'E001',
        name: 'Test User',
        email: 'user@example.com',
        role: 'employee',
      },
    });

    render(<Signin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret',
      });
    });

    expect(auth.authenticate).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'jwt-123' }),
      expect.any(Function)
    );
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  test('shows an error message when API returns an error', async () => {
    signin.mockResolvedValueOnce({ error: 'User not found' });

    render(<Signin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'bad@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('redirects back to "from" location when provided in location.state', async () => {
    mockLocation = {
      pathname: '/signin',
      state: { from: { pathname: '/tasks' } },
    };

    signin.mockResolvedValueOnce({
      token: 'jwt-123',
      user: {
        _id: '1',
        employeeId: 'E001',
        name: 'Test User',
        email: 'user@example.com',
        role: 'employee',
      },
    });

    render(<Signin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks', { replace: true });
    });
  });
});