import { createClient } from 'npm:@supabase/supabase-js@2'
import { createStripeClient } from '../_shared/stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  id: string
  name: string
  price: number // GBP, e.g. 12.99
  quantity: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const liveKey = Deno.env.get('STRIPE_LIVE_SECRET_KEY')
    console.log(
      `[create-checkout] Stripe live key prefix: ${liveKey ? liveKey.substring(0, 12) : 'MISSING'}`,
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify the caller
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userErr } = await userClient.auth.getUser()
    if (userErr || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const items: CartItem[] = body.items
    const shipping = body.shipping as {
      full_name: string
      email: string
      phone: string
      address_line1: string
      address_line2?: string | null
      city: string
      postcode: string
    }

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate each item
    for (const i of items) {
      if (!i.id || !i.name || typeof i.price !== 'number' || typeof i.quantity !== 'number') {
        return new Response(JSON.stringify({ error: 'Invalid cart item' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (i.quantity < 1 || i.quantity > 100) {
        return new Response(JSON.stringify({ error: 'Invalid quantity' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

    const adminClient = createClient(supabaseUrl, supabaseService)

    // 1. Create order row (unpaid)
    const orderId = crypto.randomUUID()
    const { error: orderErr } = await adminClient.from('orders').insert({
      id: orderId,
      user_id: user.id,
      full_name: shipping.full_name,
      email: shipping.email,
      phone: shipping.phone,
      address_line1: shipping.address_line1,
      address_line2: shipping.address_line2 ?? null,
      city: shipping.city,
      postcode: shipping.postcode,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      status: 'pending',
      payment_status: 'unpaid',
    })
    if (orderErr) {
      console.error('Order insert failed', orderErr)
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Create Stripe Checkout Session via gateway (live)
    const stripe = createStripeClient('live')
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      'https://sableandsaffron.xyz'

    const sessionPayload: Record<string, any> = {
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: shipping.email,
      success_url: `${origin}/#/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/checkout?cancelled=1`,
      client_reference_id: orderId,
      metadata: { order_id: orderId, user_id: user.id },
      line_items: items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.name },
        },
      })),
    }

    const session = await stripe.request<{ id: string; url: string }>(
      'POST',
      '/v1/checkout/sessions',
      sessionPayload,
    )

    // 3. Save session id on the order
    await adminClient
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderId)

    return new Response(
      JSON.stringify({ url: session.url, orderId, sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('create-checkout error', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
