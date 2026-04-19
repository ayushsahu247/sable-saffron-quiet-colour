// Auth Hook: triggered server-side after a new user signs up.
// Sends a branded welcome email via send-transactional-email.
// Configured as a Supabase Auth webhook (HTTP Hook → "After User Created").
//
// To enable: in Lovable Cloud → Auth → Hooks, set the "After User Created" hook URL to:
//   https://<project>.supabase.co/functions/v1/send-welcome-email
//
// This function also accepts a manual { user_id } body so the frontend can
// trigger it once on first session if hooks are not configured.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(supabaseUrl, supabaseService)

    let email: string | null = null
    let name: string | null = null
    let userId: string | null = null

    const body = await req.json().catch(() => ({} as any))

    // Auth webhook payload shape: { type, record: { id, email, raw_user_meta_data } }
    if (body?.record?.email) {
      email = body.record.email
      userId = body.record.id
      name =
        body.record.raw_user_meta_data?.full_name ||
        body.record.raw_user_meta_data?.name ||
        null
    } else if (body?.user_id) {
      userId = body.user_id
      const { data, error } = await admin.auth.admin.getUserById(body.user_id)
      if (error || !data?.user?.email) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      email = data.user.email
      name =
        (data.user.user_metadata as any)?.full_name ||
        (data.user.user_metadata as any)?.name ||
        null
    }

    if (!email || !userId) {
      return new Response(JSON.stringify({ error: 'Missing email or user_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error } = await admin.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'welcome',
        recipientEmail: email,
        idempotencyKey: `welcome-${userId}`,
        templateData: { customerName: name ?? undefined },
      },
    })

    if (error) {
      console.error('Failed to enqueue welcome email', error)
      return new Response(JSON.stringify({ error: 'Failed to send welcome email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-welcome-email error', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
