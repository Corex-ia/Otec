import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // C2 fix: require authenticated user
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId, status, transactionId } = await req.json();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // C2 fix: order must belong to the authenticated user
    if (order.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // C2 fix: only allow confirming orders that were actually paid via Webpay
    // (status must be 'pending' — not already completed or cancelled)
    if (order.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Order already processed' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (status === 'success') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          webpay_transaction_id: transactionId,
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      for (const item of order.order_items) {
        if (item.item_type === 'course' && item.course_id) {
          const { error: enrollError } = await supabase
            .from('enrollments')
            .insert({
              user_id: order.user_id,
              course_id: item.course_id,
              progress: 0,
            });

          if (enrollError && enrollError.code !== '23505') {
            console.error('Error creating enrollment:', enrollError);
          }
        }

        if (item.item_type === 'ticket' && item.event_id) {
          const { error: ticketError } = await supabase
            .from('tickets')
            .insert({
              event_id: item.event_id,
              section_id: item.section_id,
              user_id: order.user_id,
              order_id: orderId,
              seat_number: item.seat_number,
              qr_code: `TICKET-${orderId}-${item.id}`,
            });

          if (ticketError) {
            console.error('Error creating ticket:', ticketError);
          }

          if (item.section_id) {
            await supabase.rpc('decrement_seats', {
              section_id: item.section_id,
              amount: item.quantity,
            });
          }
        }
      }

      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          type: 'order_confirmation',
          orderId,
          userId: order.user_id,
        }),
      });
    } else {
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
