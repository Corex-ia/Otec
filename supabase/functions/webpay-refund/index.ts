// Refunds (full or partial) an authorized Webpay Plus transaction.
// Intended for admin/CRM use - call with the service role or an
// authenticated admin user's JWT.
//
// Request body: { orderId: string, amount?: number }
// If `amount` is omitted, the full payment amount is refunded.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, refundTransaction } from '../_shared/transbank.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId, amount } = (await req.json()) as { orderId: string; amount?: number };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'authorized')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (paymentError) throw paymentError;
    if (!payment.token) throw new Error('Payment has no Webpay token');

    const refundAmount = amount ?? payment.amount;
    const tbk = await refundTransaction(payment.token, refundAmount);

    const fullyRefunded = tbk.type === 'REVERSED' || tbk.type === 'NULLIFIED';

    await supabase
      .from('payments')
      .update({
        status: fullyRefunded ? 'refunded' : 'reversed',
        raw_response: { ...payment.raw_response, refund: tbk },
      })
      .eq('id', payment.id);

    if (fullyRefunded) {
      await supabase.from('orders').update({ status: 'refunded' }).eq('id', orderId);
    }

    return new Response(JSON.stringify({ success: true, refund: tbk }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
