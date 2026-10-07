import { NextRequest, NextResponse } from 'next/server';

// Transbank redirects the browser here with a POST after the user pays
// (or cancels) on the Webpay form. We forward the token to the
// webpay-commit Edge Function, which settles the transaction and creates
// the `enrollments` rows, then redirect the user to a result page.
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tokenWs = formData.get('token_ws')?.toString();
  const tbkToken = formData.get('TBK_TOKEN')?.toString();
  console.log('[webpay-return POST]', { tokenWs: tokenWs ? '***' : undefined, tbkToken: tbkToken ? '***' : undefined, keys: [...formData.keys()] });

  const origin = request.nextUrl.origin;
  const token = tokenWs ?? tbkToken;

  if (!token) {
    return NextResponse.redirect(`${origin}/checkout/resultado?status=error`);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const res = await fetch(`${supabaseUrl}/functions/v1/webpay-commit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ token, aborted: !tokenWs }),
    });

    const data = await res.json();

    const status = data.success ? 'success' : 'failure';
    return NextResponse.redirect(`${origin}/checkout/resultado?status=${status}&orderId=${data.orderId ?? ''}`);
  } catch {
    return NextResponse.redirect(`${origin}/checkout/resultado?status=error`);
  }
}

// Webpay may redirect with GET instead of POST in some integration flows.
// token_ws in query = successful payment that needs commit.
// TBK_TOKEN in query = user abandoned before paying.
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const tokenWs = request.nextUrl.searchParams.get('token_ws');
  const tbkToken = request.nextUrl.searchParams.get('TBK_TOKEN');

  const token = tokenWs ?? tbkToken;
  const aborted = !tokenWs;

  if (!token) {
    return NextResponse.redirect(`${origin}/checkout/resultado?status=aborted`);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const res = await fetch(`${supabaseUrl}/functions/v1/webpay-commit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ token, aborted }),
    });

    const data = await res.json();

    if (aborted) {
      return NextResponse.redirect(`${origin}/checkout/resultado?status=aborted`);
    }

    const status = data.success ? 'success' : 'failure';
    return NextResponse.redirect(`${origin}/checkout/resultado?status=${status}&orderId=${data.orderId ?? ''}`);
  } catch {
    return NextResponse.redirect(`${origin}/checkout/resultado?status=error`);
  }
}
