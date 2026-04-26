import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

// Configuration baked in at scaffold time — do NOT change these manually.
// To update, re-run the email domain setup flow.
const SITE_NAME = "Sable & Saffron"
// SENDER_DOMAIN is the verified sender subdomain FQDN (e.g., "notify.example.com").
// It MUST match the subdomain delegated to Lovable's nameservers — never the root domain.
// The email API looks up this exact domain; a mismatch causes "No email domain record found".
const SENDER_DOMAIN = "notify.sableandsaffron.xyz"
// FROM_DOMAIN is the domain shown in the From: header and must align with the
// verified sender domain configuration for this project.
const FROM_DOMAIN = "sableandsaffron.xyz"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

// Generate a cryptographically random 32-byte hex token
function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Auth note: this function uses verify_jwt = true in config.toml, so Supabase's
// gateway validates the caller's JWT (anon or service_role) before the request
// reaches this code. No in-function auth check is needed.

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Parse request body
  let templateName: string
  let recipientEmail: string
  let idempotencyKey: string
  let messageId: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    messageId = crypto.randomUUID()
    idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId
    if (body.templateData && typeof body.templateData === 'object') {
      templateData = body.templateData
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (!templateName) {
    return new Response(
      JSON.stringify({ error: 'templateName is required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // 1. Look up template from registry (early — needed to resolve recipient)
  const template = TEMPLATES[templateName]

  if (!template) {
    console.error('Template not found in registry', { templateName })
    return new Response(
      JSON.stringify({
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Resolve effective recipient: template-level `to` takes precedence over
  // the caller-provided recipientEmail. This allows notification templates
  // to always send to a fixed address (e.g., site owner from env var).
  const primaryRecipient = template.to || recipientEmail

  if (!primaryRecipient) {
    return new Response(
      JSON.stringify({
        error: 'recipientEmail is required (unless the template defines a fixed recipient)',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Build full recipient list (primary + any server-side additional recipients).
  // Deduplicate case-insensitively while preserving order.
  const allRecipientsRaw = [primaryRecipient, ...(template.additionalRecipients || [])]
  const seen = new Set<string>()
  const allRecipients: string[] = []
  for (const r of allRecipientsRaw) {
    const key = r.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      allRecipients.push(r)
    }
  }

  // Create Supabase client with service role (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Render React Email template once — same content for all recipients
  const html = await renderAsync(
    React.createElement(template.component, templateData)
  )
  const plainText = await renderAsync(
    React.createElement(template.component, templateData),
    { plainText: true }
  )

  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  const fromName = template.fromName || SITE_NAME
  const fromAddress = template.fromAddress || `hello@${FROM_DOMAIN}`
  const fromHeader = `${fromName} <${fromAddress}>`

  const results: Array<{ recipient: string; status: string; reason?: string }> = []

  for (let i = 0; i < allRecipients.length; i++) {
    const effectiveRecipient = allRecipients[i]
    // Each recipient gets its own message id and idempotency key suffix
    const perMessageId = i === 0 ? messageId : crypto.randomUUID()
    const perIdempotencyKey = i === 0 ? idempotencyKey : `${idempotencyKey}-r${i}`

    // Suppression check (fail-closed per recipient)
    const { data: suppressed, error: suppressionError } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', effectiveRecipient.toLowerCase())
      .maybeSingle()

    if (suppressionError) {
      console.error('[send-transactional-email] suppression check failed', {
        error: suppressionError,
        recipient: effectiveRecipient,
      })
      results.push({ recipient: effectiveRecipient, status: 'failed', reason: 'suppression_check_failed' })
      continue
    }

    if (suppressed) {
      await supabase.from('email_send_log').insert({
        message_id: perMessageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'suppressed',
      })
      console.log('[send-transactional-email] suppressed', { recipient: effectiveRecipient, template: templateName })
      results.push({ recipient: effectiveRecipient, status: 'suppressed' })
      continue
    }

    // Get or create unsubscribe token for this recipient
    const normalizedEmail = effectiveRecipient.toLowerCase()
    let unsubscribeToken: string

    const { data: existingToken, error: tokenLookupError } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token, used_at')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (tokenLookupError) {
      console.error('[send-transactional-email] token lookup failed', { error: tokenLookupError, email: normalizedEmail })
      await supabase.from('email_send_log').insert({
        message_id: perMessageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'failed',
        error_message: 'Failed to look up unsubscribe token',
      })
      results.push({ recipient: effectiveRecipient, status: 'failed', reason: 'token_lookup_failed' })
      continue
    }

    if (existingToken && !existingToken.used_at) {
      unsubscribeToken = existingToken.token
    } else if (!existingToken) {
      unsubscribeToken = generateToken()
      const { error: tokenError } = await supabase
        .from('email_unsubscribe_tokens')
        .upsert(
          { token: unsubscribeToken, email: normalizedEmail },
          { onConflict: 'email', ignoreDuplicates: true }
        )

      if (tokenError) {
        console.error('[send-transactional-email] failed to create unsubscribe token', { error: tokenError })
        await supabase.from('email_send_log').insert({
          message_id: perMessageId,
          template_name: templateName,
          recipient_email: effectiveRecipient,
          status: 'failed',
          error_message: 'Failed to create unsubscribe token',
        })
        results.push({ recipient: effectiveRecipient, status: 'failed', reason: 'token_create_failed' })
        continue
      }

      const { data: storedToken, error: reReadError } = await supabase
        .from('email_unsubscribe_tokens')
        .select('token')
        .eq('email', normalizedEmail)
        .maybeSingle()

      if (reReadError || !storedToken) {
        console.error('[send-transactional-email] failed to read back unsubscribe token', { error: reReadError, email: normalizedEmail })
        await supabase.from('email_send_log').insert({
          message_id: perMessageId,
          template_name: templateName,
          recipient_email: effectiveRecipient,
          status: 'failed',
          error_message: 'Failed to confirm unsubscribe token storage',
        })
        results.push({ recipient: effectiveRecipient, status: 'failed', reason: 'token_readback_failed' })
        continue
      }
      unsubscribeToken = storedToken.token
    } else {
      console.warn('[send-transactional-email] unsubscribe token already used but email not suppressed', { email: normalizedEmail })
      await supabase.from('email_send_log').insert({
        message_id: perMessageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'suppressed',
        error_message: 'Unsubscribe token used but email missing from suppressed list',
      })
      results.push({ recipient: effectiveRecipient, status: 'suppressed' })
      continue
    }

    // Log pending before enqueue
    await supabase.from('email_send_log').insert({
      message_id: perMessageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'pending',
    })

    console.log('[send-transactional-email] attempting send', {
      template: templateName,
      recipient: effectiveRecipient,
      from: fromHeader,
      messageId: perMessageId,
    })

    const { error: enqueueError } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: perMessageId,
        to: effectiveRecipient,
        from: fromHeader,
        sender_domain: SENDER_DOMAIN,
        subject: resolvedSubject,
        html,
        text: plainText,
        purpose: 'transactional',
        label: templateName,
        idempotency_key: perIdempotencyKey,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    })

    if (enqueueError) {
      console.error('[send-transactional-email] FAILED to enqueue', {
        template: templateName,
        recipient: effectiveRecipient,
        from: fromHeader,
        error: enqueueError,
      })
      await supabase.from('email_send_log').insert({
        message_id: perMessageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'failed',
        error_message: 'Failed to enqueue email',
      })
      results.push({ recipient: effectiveRecipient, status: 'failed', reason: 'enqueue_failed' })
      continue
    }

    console.log('[send-transactional-email] SUCCESS enqueued', {
      template: templateName,
      recipient: effectiveRecipient,
      from: fromHeader,
      messageId: perMessageId,
    })
    results.push({ recipient: effectiveRecipient, status: 'queued' })
  }

  const anyQueued = results.some((r) => r.status === 'queued')

  return new Response(
    JSON.stringify({ success: anyQueued, results }),
    {
      status: anyQueued ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
})
