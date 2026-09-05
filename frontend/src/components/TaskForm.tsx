import { useState } from 'react';

import { createTask } from '../lib/tasks';
import type { TaskStatus } from '../types/task';

interface TaskFormProps {
onCreated: () => void;
onCancel?: () => void;
}

function TaskForm({ onCreated, onCancel }: TaskFormProps) {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [status, setStatus] = useState<TaskStatus>('TODO');
const [dueDate, setDueDate] = useState('');

const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

setError('');

const trimmedTitle = title.trim();

if (!trimmedTitle) {
  setError('Title is required.');
  return;
}

try {
  setSubmitting(true);

  await createTask({
    title: trimmedTitle,
    description: description.trim() || undefined,
    status,
    dueDate: dueDate || undefined,
  });

  setTitle('');
  setDescription('');
  setStatus('TODO');
  setDueDate('');

  onCreated();
} catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Failed to create task.');
  }
} finally {
  setSubmitting(false);
}


}

return (
<section>
<h2>Create Task</h2>

  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="task-title">Title</label>

      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter task title"
        disabled={submitting}
        required
      />
    </div>

    <div>
      <label htmlFor="task-description">
        Description
      </label>

      <textarea
        id="task-description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        placeholder="Optional description"
        disabled={submitting}
        rows={4}
      />
    </div>

    <div>
      <label htmlFor="task-status">Status</label>

      <select
        id="task-status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as TaskStatus)
        }
        disabled={submitting}
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>

    <div>
      <label htmlFor="task-due-date">Due Date</label>

      <input
        id="task-due-date"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        disabled={submitting}
      />
    </div>

    {error && (
      <p role="alert">
        {error}
      </p>
    )}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Creating...' : 'Create Task'}
    </button>

    {onCancel && (
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
      >
        Cancel
      </button>
    )}
  </form>
</section>


);
}

export default TaskForm;