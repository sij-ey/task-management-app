import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
onRegistered: () => void;
onSwitchToLogin: () => void;
}

function RegisterPage({
onRegistered,
onSwitchToLogin,
}: RegisterPageProps) {
const { signUp } = useAuth();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const [error, setError] = useState('');
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError('');

if (!email.trim()) {
  setError('Please enter your email.');
  return;
}

if (password.length < 6) {
  setError('Password must be at least 6 characters.');
  return;
}

if (password !== confirmPassword) {
  setError('Passwords do not match.');
  return;
}

try {
  setSubmitting(true);

  await signUp(email.trim(), password);

  onRegistered();
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Registration failed. Please try again.');
  }
} finally {
  setSubmitting(false);
}


}

return (
<main>
<h1>Create Account</h1>

  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="register-email">Email</label>

      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        disabled={submitting}
      />
    </div>

    <div>
      <label htmlFor="register-password">Password</label>

      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="At least 6 characters"
        autoComplete="new-password"
        disabled={submitting}
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
        placeholder="Repeat your password"
        autoComplete="new-password"
        disabled={submitting}
      />
    </div>

    {error && (
      <p role="alert">
        {error}
      </p>
    )}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Creating account...' : 'Create Account'}
    </button>
  </form>

  <p>
    Already have an account?{' '}
    <button
      type="button"
      onClick={onSwitchToLogin}
      disabled={submitting}
    >
      Sign in
    </button>
  </p>
</main>


);
}

export default RegisterPage;