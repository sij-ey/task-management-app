import { useState } from 'react';
import type { FormEvent } from 'react';

import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onRegister: () => void;
}

function LoginPage({ onRegister }: LoginPageProps) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    try {
      setLoading(true);

      await signIn(email.trim(), password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(getAuthErrorMessage(error));
      } else {
        setError(
          'Unable to sign in. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your tasks."
      footer={
        <p>
          Don't have an account?{' '}
          <button
            className="auth-link"
            type="button"
            onClick={onRegister}
          >
            Create one
          </button>
        </p>
      }
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
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
          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            required
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}

function getAuthErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (
    message.includes('invalid-credential') ||
    message.includes('invalid login')
  ) {
    return 'Incorrect email or password.';
  }

  if (message.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection.';
  }

  return 'Unable to sign in. Please check your details and try again.';
}

export default LoginPage;
