

## Problem

Checkout fails with "Couldn't start payment. Please try again." The `create-checkout` edge function is rejecting requests with `401 UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM: Unsupported JWT algorithm ES256` before the function code ever runs. No edge function logs appear because the request is blocked at the gateway.

## Root Cause

`supabase/config.toml` has `verify_jwt = true` for `create-checkout`. Supabase recently rotated to ES256-signed JWTs, but the edge gateway's built-in JWT verifier only accepts HS256, so every authenticated call is rejected with 401.

The Lovable Payments documentation explicitly requires `verify_jwt = false` on all payment-related edge functions for exactly this reason — auth must be validated in code instead.

## Fix (one-line change)

Update `supabase/config.toml`:

```toml
[functions.create-checkout]
verify_jwt = false
```

Authentication is **not** weakened — the function already does in-code validation:

```ts
const { data: { user }, error } = await userClient.auth.getUser()
if (userErr || !user?.email) return 401
```

…which rejects unauthenticated callers exactly as before, just from inside the function instead of at the gateway.

## Why nothing else needs to change

- `verify-payment`, `send-welcome-email`, `handle-email-*` already have `verify_jwt = false`.
- `create-checkout/index.ts` already extracts the `Authorization` header and calls `auth.getUser()`.
- Stripe gateway client, secrets (`STRIPE_SANDBOX_API_KEY`, `LOVABLE_API_KEY`), order insert, and Stripe session creation logic are all correct.

## Verification after applying

1. Add an item to cart, go to checkout, fill the form, click Pay.
2. Should redirect to Stripe's hosted payment page.
3. Use test card `4242 4242 4242 4242`, any future expiry, any CVC.

