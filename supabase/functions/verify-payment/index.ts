import { createClient } from 'npm:@supabase/supabase-js@2'
import { createStripeClient } from '../_shared/stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const sessionId =
      url.searchParams.get('session_id') ||
      (req.method === 'POST' ? (await req.json().catch(() => ({}))).session_id : null)

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'session_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stripe = createStripeClient('sandbox')
    const session = await stripe.request<{
      id: string
      payment_status: string
      status: string
      client_reference_id: string | null
      metadata?: Record<string, string>
    }>('GET', `/v1/checkout/sessions/${sessionId}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(supabaseUrl, supabaseService)

    const orderId = session.client_reference_id || session.metadata?.order_id
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order id not found on session' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const paid = session.payment_status === 'paid'

    const { data: order } = await admin
      .from('orders')
      .select('id, user_id, full_name, email, phone, address_line1, address_line2, city, postcode, items, subtotal, payment_status')
      .eq('id', orderId)
      .maybeSingle()

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (paid && order.payment_status !== 'paid') {
      // Mark paid
      await admin
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      // Clear cart items for this user
      if (order.user_id) {
        await admin.from('cart_items').delete().eq('user_id', order.user_id)
      }

      const shippingAddress = {
        line1: order.address_line1,
        line2: order.address_line2 ?? undefined,
        city: order.city,
        postcode: order.postcode,
      }

      // 1) Customer order confirmation
      try {
        await admin.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'order-confirmation',
            recipientEmail: order.email,
            idempotencyKey: `order-confirm-${orderId}`,
            templateData: {
              customerName: order.full_name,
              orderId,
              items: order.items,
              subtotal: Number(order.subtotal),
              shippingAddress,
            },
          },
        })
      } catch (e) {
        console.error('Failed to send order confirmation', e)
      }

      // 2) Auto-create a shipment record (status: to_dispatch) — idempotent via UNIQUE(order_id)
      try {
        await admin
          .from('shipments')
          .insert({ order_id: orderId, status: 'to_dispatch' })
      } catch (e) {
        console.error('Failed to create shipment record', e)
      }

      // 3) Notify the shop owner of the new order
      // CUSTOMIZE: change OWNER_NOTIFICATION_EMAIL to the address that should receive new-order alerts.
      const OWNER_NOTIFICATION_EMAIL = 'orders@sableandsaffron.xyz'
      try {
        await admin.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'new-order-owner',
            recipientEmail: OWNER_NOTIFICATION_EMAIL,
            idempotencyKey: `owner-notify-${orderId}`,
            templateData: {
              customerName: order.full_name,
              customerEmail: order.email,
              customerPhone: order.phone ?? undefined,
              orderId,
              items: order.items,
              subtotal: Number(order.subtotal),
              shippingAddress,
            },
          },
        })
      } catch (e) {
        console.error('Failed to send owner notification', e)
      }
    }

    return new Response(
      JSON.stringify({ paid, orderId, payment_status: session.payment_status }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('verify-payment error', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
