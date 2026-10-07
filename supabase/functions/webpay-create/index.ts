// Creates an order (if needed), starts a Webpay Plus transaction and
// returns the { token, url } pair the frontend needs to redirect the
// user to Transbank's payment form (auto-submit POST token_ws=...).
//
// Request body:
//   {
//     items: [{ type: 'course', id, price, quantity }],
//     returnUrl: string   // page that will receive Transbank's POST redirect
//   }
//
// Requires an authenticated Supabase user (Authorization: Bearer <jwt>).

import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  corsHeaders,
  createTransaction,
  buildBuyOrder,
  buildSessionId,
} from '../_shared/transbank.ts';

interface CartItem {
  type: 'course' | 'ticket';
  id: string;
  quantity: number;
  // price is intentionally omitted — must come from the DB, not the client
}

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

    const body = (await req.json()) as {
      items: CartItem[];
      returnUrl: string;
    };
    const { items, returnUrl } = body;

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = user.id;

    if (!items?.length || !returnUrl) {
      return new Response(JSON.stringify({ error: 'items y returnUrl son requeridos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // C5 fix: only allow returnUrl pointing to our own domain
    const ALLOWED_ORIGINS = [
      'https://campus.elpoderdecrear.cl',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    const parsedReturn = (() => { try { return new URL(returnUrl); } catch { return null; } })();
    if (!parsedReturn || !ALLOWED_ORIGINS.some((o) => returnUrl.startsWith(o))) {
      return new Response(JSON.stringify({ error: 'returnUrl no permitida' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // C4 fix: fetch authoritative prices from DB — never trust client-supplied prices
    const courseIds = items.filter((i) => i.type === 'course').map((i) => i.id);
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, price')
      .in('id', courseIds);
    if (coursesError) throw coursesError;

    const priceMap = new Map((courses ?? []).map((c: { id: string; price: number }) => [c.id, c.price]));

    const total = items.reduce((sum, item) => {
      const unitPrice = item.type === 'course' ? (priceMap.get(item.id) ?? 0) : 0;
      return sum + unitPrice * item.quantity;
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'pending',
        payment_method: 'webpay',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_type: item.type,
      course_id: item.type === 'course' ? item.id : null,
      quantity: item.quantity,
      price: item.type === 'course' ? (priceMap.get(item.id) ?? 0) : 0,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    const buyOrder = buildBuyOrder(order.id);
    const sessionId = buildSessionId(userId);

    const tbkResponse = await createTransaction({
      buyOrder,
      sessionId,
      amount: total,
      returnUrl,
    });

    const { error: paymentError } = await supabase.from('payments').insert({
      order_id: order.id,
      buy_order: buyOrder,
      session_id: sessionId,
      token: tbkResponse.token,
      amount: total,
      status: 'initiated',
    });
    if (paymentError) throw paymentError;

    await supabase.from('orders').update({ webpay_token: tbkResponse.token }).eq('id', order.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        token: tbkResponse.token,
        url: tbkResponse.url,
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
