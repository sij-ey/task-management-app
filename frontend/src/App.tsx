import { useState } from 'react';

import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';

function App() {
  const { user, loading } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    if (showRegister) {
      return (
        <RegisterPage
          onLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <LoginPage
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  return <TasksPage />;
}

export default App;
