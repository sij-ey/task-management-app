import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
onSwitchToRegister: () => void;
}

function LoginPage({ onSwitchToRegister }: LoginPageProps) {
const { signIn } = useAuth();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [error, setError] = useState('');
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError('');

if (!email.trim() || !password) {
  setError('Please enter your email and password.');
  return;
}

try {
  setSubmitting(true);

  await signIn(email.trim(), password);
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Login failed. Please check your credentials.');
  }
} finally {
  setSubmitting(false);
}


}

return (
<main>
<h1>Task Manager</h1>

  <h2>Sign In</h2>

  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="login-email">Email</label>

      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        disabled={submitting}
      />
    </div>

    <div>
      <label htmlFor="login-password">Password</label>

      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Your password"
        autoComplete="current-password"
        disabled={submitting}
      />
    </div>

    {error && (
      <p role="alert">
        {error}
      </p>
    )}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Signing in...' : 'Sign In'}
    </button>
  </form>

  <p>
    Don't have an account?{' '}
    <button
      type="button"
      onClick={onSwitchToRegister}
      disabled={submitting}
    >
      Create an account
    </button>
  </p>
</main>


);
}

export default LoginPage;