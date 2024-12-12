import { handleFetchResponse } from '../helper';
import { API_URL } from '../utils';

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: 'GET',
  });
  return handleFetchResponse(response);
}
