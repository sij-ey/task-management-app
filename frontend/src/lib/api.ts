import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('You must be signed in to make this request.');
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData: unknown = await response.json();

      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
      ) {
        const errorMessage = (errorData as { message?: unknown }).message;

        if (typeof errorMessage === 'string') {
          message = errorMessage;
        } else if (Array.isArray(errorMessage)) {
          message = errorMessage.join(', ');
        }
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
