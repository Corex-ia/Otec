// Confirms a Webpay Plus transaction after the user returns from Transbank.
//
// Transbank POSTs `token_ws` (success/aborted-but-confirmable) or
// `TBK_TOKEN`+`TBK_ID_SESION`+`TBK_ORDEN_COMPRA` (user cancelled before
// paying) to the `returnUrl` given to webpay-create. The frontend should
// forward whichever token it received here as { token }.
//
// On success: marks the order/payment as completed and creates one
// `enrollments` row per course in the order, unlocking access in the
// e-learning platform. This does not require an Authorization header
// because it runs with the service role and the token itself proves the
// transaction belongs to this order.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, commitTransaction } from '../_shared/transbank.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { token, aborted } = (await req.json()) as { token?: string; aborted?: boolean };

    if (!token) {
      return new Response(JSON.stringify({ error: 'token es requerido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, orders(*, order_items(*))')
      .eq('token', token)
      .single();

    if (paymentError) throw paymentError;
    const order = payment.orders;

    // C3 fix: idempotency — only process if payment is still in initiated state
    if (payment.status !== 'initiated') {
      const alreadyApproved = payment.status === 'authorized';
      return new Response(
        JSON.stringify({
          success: alreadyApproved,
          status: alreadyApproved ? 'AUTHORIZED' : payment.status.toUpperCase(),
          orderId: order.id,
          alreadyProcessed: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User cancelled at Webpay before entering card details.
    if (aborted) {
      await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id);
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
      return new Response(
        JSON.stringify({ success: false, status: 'ABORTED', orderId: order.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tbk = await commitTransaction(token);
    const approved = tbk.response_code === 0 && tbk.status === 'AUTHORIZED';

    await supabase
      .from('payments')
      .update({
        status: approved ? 'authorized' : 'failed',
        response_code: tbk.response_code,
        authorization_code: tbk.authorization_code,
        payment_type_code: tbk.payment_type_code,
        card_last4: tbk.card_detail?.card_number ?? null,
        transaction_date: tbk.transaction_date,
        raw_response: tbk,
      })
      .eq('id', payment.id);

    await supabase
      .from('orders')
      .update({
        status: approved ? 'completed' : 'cancelled',
        webpay_transaction_id: tbk.authorization_code,
      })
      .eq('id', order.id);

    if (approved) {
      for (const item of order.order_items) {
        if (item.item_type === 'course' && item.course_id) {
          const { error: enrollError } = await supabase.from('enrollments').insert({
            user_id: order.user_id,
            course_id: item.course_id,
            progress: 0,
          });
          // 23505 = unique_violation (already enrolled) - safe to ignore.
          if (enrollError && enrollError.code !== '23505') {
            console.error('Error creating enrollment:', enrollError);
          }
        }
      }

      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          type: 'order_confirmation',
          orderId: order.id,
          userId: order.user_id,
        }),
      }).catch((e) => console.error('send-notification failed:', e));
    }

    return new Response(
      JSON.stringify({
        success: approved,
        status: tbk.status,
        responseCode: tbk.response_code,
        orderId: order.id,
        amount: tbk.amount,
        authorizationCode: tbk.authorization_code,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
