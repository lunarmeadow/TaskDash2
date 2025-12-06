import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup.jsx';
import { signup } from '../lib/api-auth.js';

// Mock react-router-dom so that Link is just an "a" element
jest.mock('react-router-dom', () => ({
  __esModule: true,
  Link: 'a',
}));

jest.mock('../lib/api-auth.js', () => ({
  __esModule: true,
  signup: jest.fn(),
}));

describe('Signup', () => {
  beforeEach(() => {
    signup.mockReset();
  });

  test('lets the user fill in main fields', () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/employee id/i), {
      target: { value: 'E100' },
    });
    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByLabelText(/^location$/i), {
      target: { value: 'Warehouse 1' },
    });

    // Role control exists (default "employee" but we don't poke it)
    expect(screen.getByLabelText(/^role$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/employee id/i)).toHaveValue('E100');
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('Alice');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('alice@example.com');
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('secret');
    expect(screen.getByLabelText(/^location$/i)).toHaveValue('Warehouse 1');
  });

  test('calls signup API and shows success dialog', async () => {
    signup.mockResolvedValueOnce({
      _id: '1',
      employeeId: 'E100',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'employee',
      location: 'Warehouse 1',
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/employee id/i), {
      target: { value: 'E100' },
    });
    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByLabelText(/^location$/i), {
      target: { value: 'Warehouse 1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        employeeId: 'E100',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
        role: 'employee', // default from component
        location: 'Warehouse 1',
      });
    });

    // success dialog appears
    expect(
      await screen.findByText(/your taskdash account has been created/i)
    ).toBeInTheDocument();

    // form fields reset
    expect(screen.getByLabelText(/employee id/i)).toHaveValue('');
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^location$/i)).toHaveValue('');
  });

  test('shows an error message when signup fails', async () => {
    signup.mockResolvedValueOnce({ error: 'Email already exists' });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/employee id/i), {
      target: { value: 'E100' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/email already exists/i)
    ).toBeInTheDocument();
  });
});