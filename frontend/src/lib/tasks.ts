import { apiRequest } from './api';
import type { Task, TaskStatus } from '../types/task';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
}

export function getTasks() {
  return apiRequest<Task[]>('/tasks');
}

export function createTask(data: CreateTaskInput) {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(
  id: string,
  data: UpdateTaskInput
) {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: string) {
  return apiRequest<void>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
