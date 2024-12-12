import { handleFetchResponse } from '@/lib/helper';
import { API_URL } from '@/lib/utils';

export async function fetchAnalytics() {
  try {
    const response = await fetch(`${API_URL}/admin/analytics`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleFetchResponse(response);
  } catch (error: any) {
    console.error('Error fetching analytics:', error.message);
    throw new Error(error.message);
  }
}
