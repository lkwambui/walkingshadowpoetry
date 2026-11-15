import { COMMERCE_API_URL } from './config';

/**
 * Client for the custom `walking-shadow-commerce` WordPress plugin.
 *
 * Handles operations that require privileged server-side logic:
 *  - M-Pesa Daraja STK push initiation + status polling (credentials stay server-side)
 *  - Poetry commission submissions
 *  - Newsletter subscriptions
 */

export class CommerceApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'CommerceApiError';
    this.status = status;
  }
}

async function commerceRequest<T>(
  path: string,
  { method = 'GET', body, params }: { method?: string; body?: unknown; params?: Record<string, string> } = {},
): Promise<T> {
  const url = new URL(`${COMMERCE_API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : null) || `Commerce request failed (${response.status})`;
    throw new CommerceApiError(message, response.status);
  }

  return payload as T;
}

/* ------------------------------------------------------------------ M-Pesa */

export interface MpesaInitiateInput {
  orderId: number;
  orderKey: string;
  phone: string;
}

export interface MpesaInitiateResult {
  success: boolean;
  message: string;
  checkout_request_id?: string;
  customer_message?: string;
}

export type MpesaPaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'unknown';

export interface MpesaStatusResult {
  order_id: number;
  status: MpesaPaymentStatus;
  paid: boolean;
  result_code?: string;
  result_desc?: string;
  mpesa_receipt?: string;
  amount?: number;
}

export function initiateMpesaPayment(input: MpesaInitiateInput) {
  return commerceRequest<MpesaInitiateResult>('/mpesa/stk-push', {
    method: 'POST',
    body: {
      order_id: input.orderId,
      order_key: input.orderKey,
      phone: input.phone,
    },
  });
}

export function getMpesaStatus(orderId: number, orderKey: string) {
  return commerceRequest<MpesaStatusResult>('/mpesa/status', {
    params: { order_id: String(orderId), order_key: orderKey },
  });
}

/* ------------------------------------------------------------- commissions */

export interface CommissionInput {
  customerName: string;
  email: string;
  phone: string;
  poetryType: string;
  recipient: string;
  occasion: string;
  theme: string;
  tone: string;
  length: string;
  details: string;
  instructions?: string;
  fixedPriceProductId?: number;
}

export interface CommissionResult {
  success: boolean;
  message: string;
  commission_id?: number;
  reference?: string;
}

export function submitCommission(input: CommissionInput) {
  return commerceRequest<CommissionResult>('/commissions', {
    method: 'POST',
    body: input,
  });
}

/* -------------------------------------------------------------- newsletter */

export function subscribeNewsletter(email: string, source = 'shop') {
  return commerceRequest<{ success: boolean; message: string }>('/newsletter', {
    method: 'POST',
    body: { email, source },
  });
}
