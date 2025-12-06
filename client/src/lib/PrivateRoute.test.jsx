import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import auth from './auth-helper.js';

jest.mock('./auth-helper.js', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(),
    authenticate: jest.fn(),
    clearJWT: jest.fn(),
  },
}));

describe('PrivateRoute', () => {
  afterEach(() => {
    auth.isAuthenticated.mockReset();
  });

  test('redirects unauthenticated users to /signin', () => {
    auth.isAuthenticated.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <div>Protected content</div>
              </PrivateRoute>
            }
          />
          <Route path="/signin" element={<div>Sign in page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/sign in page/i)).toBeInTheDocument();
  });

  test('renders children when user is authenticated', () => {
    auth.isAuthenticated.mockReturnValue({
      t: 'token-1',
      user: { _id: '1', role: 'employee' },
    });

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <div>Protected content</div>
              </PrivateRoute>
            }
          />
          <Route path="/signin" element={<div>Sign in page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});