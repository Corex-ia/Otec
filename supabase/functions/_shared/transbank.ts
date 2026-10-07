// Minimal Webpay Plus (Transaccion Completa) REST client for Supabase Edge
// Functions (Deno runtime). No external SDK dependency.
//
// Env vars (set with `supabase secrets set`):
//   TBK_API_KEY_ID      - Tbk-Api-Key-Id header
//   TBK_API_KEY_SECRET  - Tbk-Api-Key-Secret header
//   TBK_ENV             - "integration" | "production" (default "integration")

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const INTEGRATION_HOST = 'https://webpay3gint.transbank.cl';
const PRODUCTION_HOST = 'https://webpay3g.transbank.cl';

// Default integration credentials provided by Transbank for testing.
const DEFAULT_API_KEY_ID = '597055555532';
const DEFAULT_API_KEY_SECRET =
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

function tbkConfig() {
  const env = (Deno.env.get('TBK_ENV') ?? 'integration').toLowerCase();
  const host = env === 'production' ? PRODUCTION_HOST : INTEGRATION_HOST;
  const apiKeyId = Deno.env.get('TBK_API_KEY_ID') ?? DEFAULT_API_KEY_ID;
  const apiKeySecret = Deno.env.get('TBK_API_KEY_SECRET') ?? DEFAULT_API_KEY_SECRET;
  return { host, apiKeyId, apiKeySecret };
}

function tbkHeaders() {
  const { apiKeyId, apiKeySecret } = tbkConfig();
  return {
    'Content-Type': 'application/json',
    'Tbk-Api-Key-Id': apiKeyId,
    'Tbk-Api-Key-Secret': apiKeySecret,
  };
}

export interface CreateTransactionResponse {
  token: string;
  url: string;
}

export async function createTransaction(params: {
  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
}): Promise<CreateTransactionResponse> {
  const { host } = tbkConfig();
  const res = await fetch(`${host}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
    method: 'POST',
    headers: tbkHeaders(),
    body: JSON.stringify({
      buy_order: params.buyOrder,
      session_id: params.sessionId,
      amount: Math.round(params.amount),
      return_url: params.returnUrl,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Transbank create error (${res.status}): ${JSON.stringify(body)}`);
  }
  return body as CreateTransactionResponse;
}

export interface CommitTransactionResponse {
  vci: string;
  amount: number;
  status: string; // "AUTHORIZED" | "FAILED" | "REVERSED" | "NULLIFIED" | ...
  buy_order: string;
  session_id: string;
  card_detail?: { card_number?: string };
  accounting_date: string;
  transaction_date: string;
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_number?: number;
}

export async function commitTransaction(token: string): Promise<CommitTransactionResponse> {
  const { host } = tbkConfig();
  const res = await fetch(
    `${host}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
    {
      method: 'PUT',
      headers: tbkHeaders(),
    }
  );

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Transbank commit error (${res.status}): ${JSON.stringify(body)}`);
  }
  return body as CommitTransactionResponse;
}

export interface RefundTransactionResponse {
  type: string; // "REVERSED" | "NULLIFIED" | "PARTIAL_NULLIFIED"
  response_code: number;
  authorization_code?: string;
  authorization_date?: string;
  nullified_amount?: number;
  balance?: number;
}

export async function refundTransaction(
  token: string,
  amount: number
): Promise<RefundTransactionResponse> {
  const { host } = tbkConfig();
  const res = await fetch(
    `${host}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}/refunds`,
    {
      method: 'POST',
      headers: tbkHeaders(),
      body: JSON.stringify({ amount: Math.round(amount) }),
    }
  );

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Transbank refund error (${res.status}): ${JSON.stringify(body)}`);
  }
  return body as RefundTransactionResponse;
}

// Transbank limits: buy_order <= 26 chars, session_id <= 61 chars.
export function buildBuyOrder(orderId: string): string {
  return `ORD-${orderId}`.slice(0, 26);
}

export function buildSessionId(userId: string): string {
  return `SID-${userId}-${Date.now()}`.slice(0, 61);
}
