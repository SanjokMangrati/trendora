import { API_URL } from '../utils';

export async function fetchSession() {
  try {
    const response = await fetch(`${API_URL}/auth/customers/session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session info.');
    }

    return response.json();
  } catch (error: any) {
    return new Error(error.message);
  }
}
