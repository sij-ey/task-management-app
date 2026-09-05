import { useState } from 'react';

import { deleteTask, updateTask } from '../lib/tasks';
import type { Task, TaskStatus } from '../types/task';

interface TaskItemProps {
  task: Task;
  onChanged: () => void | Promise<void>;
}

function getStatusLabel(status: TaskStatus) {
  switch (status) {
    case 'TODO':
      return 'To Do';

    case 'IN_PROGRESS':
      return 'In Progress';

    case 'COMPLETED':
      return 'Completed';

    default:
      return status;
  }
}

function TaskItem({ task, onChanged }: TaskItemProps) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? '',
  );
  const [status, setStatus] = useState<TaskStatus>(
    task.status,
  );
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : '',
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setDueDate(
      task.dueDate ? task.dueDate.slice(0, 10) : '',
    );
    setError('');
    setEditing(true);
  }

  function cancelEditing() {
    if (saving) {
      return;
    }

    setError('');
    setEditing(false);
  }

  async function handleUpdate() {
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    try {
      setSaving(true);

      await updateTask(task.id, {
        title: trimmedTitle,
        description: description.trim() || undefined,
        status,
        dueDate: dueDate || null,
      });

      setEditing(false);
      await onChanged();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update task.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteTask(task.id);

      await onChanged();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete task.');
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleComplete() {
    try {
      setSaving(true);
      setError('');

      await updateTask(task.id, {
        status: 'COMPLETED',
      });

      await onChanged();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to complete task.');
      }
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <li className="task-card">
        <div className="task-edit-header">
          <h3>Edit Task</h3>
        </div>

        <div className="task-form">
          <div>
            <label htmlFor={`edit-title-${task.id}`}>
              Title
            </label>

            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor={`edit-description-${task.id}`}
            >
              Description
            </label>

            <textarea
              id={`edit-description-${task.id}`}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={saving}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div>
              <label
                htmlFor={`edit-status-${task.id}`}
              >
                Status
              </label>

              <select
                id={`edit-status-${task.id}`}
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TaskStatus,
                  )
                }
                disabled={saving}
              >
                <option value="TODO">To Do</option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`edit-due-date-${task.id}`}
              >
                Due Date
              </label>

              <input
                id={`edit-due-date-${task.id}`}
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                disabled={saving}
              />
            </div>
          </div>

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          <div className="task-actions">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              className="button-secondary"
              type="button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span
          className={`status-badge status-${task.status.toLowerCase()}`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <p className="task-due-date">
          Due:{' '}
          {new Date(
            task.dueDate,
          ).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <div className="task-actions">
        <button
          className="button-secondary"
          type="button"
          onClick={startEditing}
          disabled={saving || deleting}
        >
          Edit
        </button>

        {task.status !== 'COMPLETED' && (
          <button
            className="button-success"
            type="button"
            onClick={handleComplete}
            disabled={saving || deleting}
          >
            {saving ? 'Completing...' : 'Complete'}
          </button>
        )}

        <button
          className="button-danger"
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
