import { API_URL } from '@/lib/utils';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginAdmin(payload: LoginPayload) {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      const errorMessage =
        errorData?.error || errorData?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
