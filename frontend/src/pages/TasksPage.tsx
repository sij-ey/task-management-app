import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { getTasks } from '../lib/tasks';
import type { Task } from '../types/task';

function TasksPage() {
  const { user, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');

      const data = await getTasks();

      setTasks(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load tasks.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialTasks() {
      try {
        const data = await getTasks();

        if (!cancelled) {
          setTasks(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Failed to load tasks.');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleTaskChanged() {
    await loadTasks();
  }

  async function handleTaskCreated() {
    setShowCreateForm(false);
    await loadTasks();
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Task Manager</h1>
          <p>{user?.email}</p>
        </div>

        <button
          className="button-secondary"
          type="button"
          onClick={signOut}
        >
          Sign Out
        </button>
      </header>

      <section className="tasks-section">
        <div className="section-header">
          <div>
            <h2>My Tasks</h2>

            {!loading && !error && (
              <p className="task-count">
                {tasks.length}{' '}
                {tasks.length === 1 ? 'task' : 'tasks'}
              </p>
            )}
          </div>

          {!showCreateForm && (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Task
            </button>
          )}
        </div>

        {showCreateForm && (
          <TaskForm
            onCreated={handleTaskCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {loading && (
          <div className="state-message">
            <p>Loading tasks...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-message error-state">
            <h3>Unable to load tasks</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadTasks}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          tasks.length === 0 && (
            <div className="state-message empty-state">
              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>
                Create your first task to start
                organizing your work.
              </p>

              {!showCreateForm && (
                <button
                  type="button"
                  onClick={() =>
                    setShowCreateForm(true)
                  }
                >
                  Create Your First Task
                </button>
              )}
            </div>
          )}

        {!loading &&
          !error &&
          tasks.length > 0 && (
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onChanged={handleTaskChanged}
                />
              ))}
            </ul>
          )}
      </section>
    </main>
  );
}

export default TasksPage;
