import { handleFetchResponse } from '../helper';
import { API_URL } from '../utils';

export async function fetchCart() {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'GET',
      credentials: 'include',
    });

    return handleFetchResponse(response);
  } catch (error: any) {
    return new Error(error.message);
  }
}

export async function addToCart(productId: number, quantity: number) {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });

  return handleFetchResponse(response);
}

export async function removeFromCart(productId: number, quantity = 0) {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });

  return handleFetchResponse(response);
}
