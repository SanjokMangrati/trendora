import { handleFetchResponse } from '../helper';
import { API_URL } from '../utils';

export async function fetchDiscount() {
  try {
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'GET',
      credentials: 'include',
    });

    return handleFetchResponse(response);
  } catch (error: any) {
    return new Error(error.message);
  }
}

export async function applyDiscount(
  discountCodeId: number,
  discountCode: string
) {
  try {
    const response = await fetch(`${API_URL}/checkout/apply-discount`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ discountCodeId, discountCode }),
    });

    return handleFetchResponse(response);
  } catch (error: any) {
    return new Error(error.message);
  }
}

export async function placeOrder(
  params:
    | {
        discountCodeId?: number;
        discountCode?: string;
      }
    | undefined
) {
  try {
    let payload: {
      discountCodeId?: number;
      discountCode?: string;
    } = {};

    if (params?.discountCodeId && params?.discountCode) {
      payload.discountCodeId = params.discountCodeId;
      payload.discountCode = params.discountCode;
    }

    const response = await fetch(`${API_URL}/checkout/place-order`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleFetchResponse(response);
  } catch (error: any) {
    return new Error(error.message);
  }
}
