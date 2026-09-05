import { useState } from 'react';
import type { FormEvent } from 'react';

import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onLogin: () => void;
}

function RegisterPage({ onLogin }: RegisterPageProps) {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await signUp(email.trim(), password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(getAuthErrorMessage(error));
      } else {
        setError(
          'Unable to create your account.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your tasks today."
      footer={
        <p>
          Already have an account?{' '}
          <button
            className="auth-link"
            type="button"
            onClick={onLogin}
          >
            Sign in
          </button>
        </p>
      }
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="At least 6 characters"
            autoComplete="new-password"
            disabled={loading}
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="register-confirm-password">
            Confirm Password
          </label>

          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Enter your password again"
            autoComplete="new-password"
            disabled={loading}
            required
            minLength={6}
          />
        </div>

        {error && (
          <div
            className="auth-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating account...'
            : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}

function getAuthErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('email-already-in-use')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('weak-password')) {
    return 'Password is too weak. Use at least 6 characters.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection.';
  }

  return 'Unable to create your account. Please try again.';
}

export default RegisterPage;
