import { useState } from 'react';

import { useAuth } from './context/AuthContext';
import { apiRequest } from './lib/api';
import type { Task } from './types/task';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
const { user, loading, signOut } = useAuth();

const [showRegister, setShowRegister] = useState(false);
const [tasks, setTasks] = useState<Task[]>([]);
const [apiLoading, setApiLoading] = useState(false);
const [apiError, setApiError] = useState('');

if (loading) {
return <p>Loading...</p>;
}

if (!user) {
if (showRegister) {
return (
<RegisterPage
onRegistered={() => setShowRegister(false)}
onSwitchToLogin={() => setShowRegister(false)}
/>
);
}

return (
  <LoginPage
    onSwitchToRegister={() => setShowRegister(true)}
  />
);


}

async function loadTasks() {
try {
setApiLoading(true);
setApiError('');

  const data = await apiRequest<Task[]>('/tasks');

  setTasks(data);
} catch (error: unknown) {
  if (error instanceof Error) {
    setApiError(error.message);
  } else {
    setApiError('Failed to load tasks.');
  }
} finally {
  setApiLoading(false);
}


}

return (
<main>
<h1>Task Manager</h1>

  <p>
    Signed in as {user.email}
  </p>

  <button type="button" onClick={signOut}>
    Sign Out
  </button>

  <hr />

  <button
    type="button"
    onClick={loadTasks}
    disabled={apiLoading}
  >
    {apiLoading ? 'Loading...' : 'Load Tasks'}
  </button>

  {apiError && (
    <p role="alert">
      {apiError}
    </p>
  )}

  <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        {task.title} — {task.status}
      </li>
    ))}
  </ul>
</main>


);
}

export default App;