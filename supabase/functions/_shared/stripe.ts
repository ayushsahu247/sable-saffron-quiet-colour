// Stripe client for edge functions.
//
// IMPORTANT: When env === 'live' we call api.stripe.com DIRECTLY using the
// real STRIPE_LIVE_SECRET_KEY. We do NOT route live traffic through the
// Lovable connector gateway — that gateway is designed for sandbox connector
// keys, not real Stripe secret keys, and using it with a live sk_live_...
// key fails authentication.
//
// When env === 'sandbox' we still go through the gateway with
// STRIPE_SANDBOX_API_KEY for backwards compatibility / test traffic.

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/stripe'
const STRIPE_DIRECT_URL = 'https://api.stripe.com'

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

export function createStripeClient(env: 'sandbox' | 'live' = 'live'): StripeClient {
  if (env === 'live') {
    const stripeKey = Deno.env.get('STRIPE_LIVE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('STRIPE_LIVE_SECRET_KEY is not configured')
    }
    console.log(`[stripe] live mode, key prefix: ${stripeKey.substring(0, 12)}`)

    return {
      async request<T = any>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: Record<string, any>): Promise<T> {
        const url = `${STRIPE_DIRECT_URL}${path}`
        const init: RequestInit = {
          method,
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            'Stripe-Version': '2024-06-20',
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
          console.error(`[stripe] live API error ${res.status}: ${msg}`)
          throw new Error(`Stripe API error: ${msg}`)
        }
        return json as T
      },
    }
  }

  // Sandbox path — gateway
  const lovableKey = Deno.env.get('LOVABLE_API_KEY')
  const sandboxKey = Deno.env.get('STRIPE_SANDBOX_API_KEY')
  if (!lovableKey) throw new Error('LOVABLE_API_KEY is not configured')
  if (!sandboxKey) throw new Error('STRIPE_SANDBOX_API_KEY is not configured')

  return {
    async request<T = any>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: Record<string, any>): Promise<T> {
      const url = `${GATEWAY_URL}${path}`
      const init: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          'X-Connection-Api-Key': sandboxKey,
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
