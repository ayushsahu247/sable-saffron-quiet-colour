// Shared Stripe gateway client for all Stripe edge functions.
// Routes API calls through Lovable's connector gateway instead of api.stripe.com directly.
// The gateway injects the correct auth automatically and supports sandbox/live envs.

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/stripe'

export interface StripeClient {
  request: <T = any>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    body?: Record<string, any>,
  ) => Promise<T>
}

function encodeForm(obj: Record<string, any>, prefix = ''): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue
    const fullKey = prefix ? `${prefix}[${key}]` : key
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          parts.push(encodeForm(item, `${fullKey}[${i}]`))
        } else {
          parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(item))}`)
        }
      })
    } else if (typeof value === 'object') {
      parts.push(encodeForm(value, fullKey))
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`)
    }
  }
  return parts.filter(Boolean).join('&')
}

export function createStripeClient(env: 'sandbox' | 'live' = 'sandbox'): StripeClient {
  const lovableKey = Deno.env.get('LOVABLE_API_KEY')
  const stripeKey = Deno.env.get('STRIPE_LIVE_SECRET_KEY')

  if (!lovableKey) throw new Error('LOVABLE_API_KEY is not configured')
  if (!stripeKey) {
    throw new Error('Stripe live key not configured (STRIPE_LIVE_SECRET_KEY)')
  }

  return {
    async request<T = any>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: Record<string, any>): Promise<T> {
      const url = `${GATEWAY_URL}${path}`
      const init: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          'X-Connection-Api-Key': stripeKey,
        },
      }
      if (body && method !== 'GET') {
        ;(init.headers as Record<string, string>)['Content-Type'] =
          'application/x-www-form-urlencoded'
        init.body = encodeForm(body)
      }
      const res = await fetch(url, init)
      const text = await res.text()
      let json: any = {}
      try {
        json = text ? JSON.parse(text) : {}
      } catch {
        json = { raw: text }
      }
      if (!res.ok) {
        const msg = json?.error?.message || json?.message || `Stripe ${res.status}`
        throw new Error(`Stripe API error: ${msg}`)
      }
      return json as T
    },
  }
}
