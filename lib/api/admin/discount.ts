import { handleFetchResponse } from '@/lib/helper';
import { API_URL } from '@/lib/utils';

export async function generateDiscount(userId: number) {
  try {
    const response = await fetch(`${API_URL}/admin/generate-discount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });

    return handleFetchResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to generate discount');
  }
}
