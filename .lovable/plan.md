

## What I'll change

### 1. Sender address → `hello@sableandsaffron.xyz`

Update the `From:` header in both email-sending edge functions to use the apex domain `sableandsaffron.xyz` with local part `hello`. The verified sender subdomain (`notify.www.sableandsaffron.xyz`) stays unchanged — that is the DNS-authenticated infrastructure subdomain and must not be touched. Only the visible `From:` shown to recipients changes.

**Files:**
- `supabase/functions/send-transactional-email/index.ts` — change `FROM_DOMAIN` constant from `"www.sableandsaffron.xyz"` to `"sableandsaffron.xyz"` and the From line from `noreply@${FROM_DOMAIN}` to `hello@${FROM_DOMAIN}`. Result: `Sable & Saffron <hello@sableandsaffron.xyz>`.
- `supabase/functions/auth-email-hook/index.ts` — same change so signup/recovery/magic-link emails also send from `hello@sableandsaffron.xyz`.

I'll also fix `SITE_NAME` in both functions (currently `"sable-saffron-boutique"`, the slug) so the recipient sees a proper brand name `Sable & Saffron` in their inbox.

Then redeploy `send-transactional-email` and `auth-email-hook`.

### 2. Why real emails aren't sending — and the fix

I checked the database directly:

- `email_send_log` has **0 rows** total. That means `send-transactional-email` is never being entered — not on Test, not on Live. (The "test email worked" earlier was the preview button in Cloud → Emails, which bypasses the queue and templates entirely.)
- 2 paid orders exist in the DB, but neither produced a confirmation email row. So `verify-payment` runs, marks the order paid, but its call to `send-transactional-email` is silently failing.
- Edge function logs for `process-email-queue`, `send-transactional-email`, and `send-welcome-email` are all empty.

The most likely cause is that `verify-payment` and `send-welcome-email` invoke `send-transactional-email` using the **service-role** Supabase client, but `send-transactional-email` is configured with `verify_jwt = true` in `config.toml`. Combined with the recent ES256 JWT rotation (the same one that broke `create-checkout` last week), the gateway rejects every internal call with a 401 — and because the gateway rejects it, no logs are ever produced and no row is written.

**Fix:** flip `send-transactional-email` to `verify_jwt = false`, exactly the same fix applied to `create-checkout`. The function will still be safe — it's only ever called from other edge functions using the service-role key, never directly from the browser, and its body validates input.

I'll also flip `process-email-queue` to `verify_jwt = false` for the same ES256 reason. The function already does an in-code check that the caller's JWT has `role: 'service_role'` (line 107), so the gateway flag is redundant and currently harmful.

**Files:**
- `supabase/config.toml` — set `verify_jwt = false` for both `send-transactional-email` and `process-email-queue`.

After redeploying, I'll verify by:
1. Triggering a test send (place an order on Test) and checking that a row appears in `email_send_log` with `status = 'pending'` then `status = 'sent'`.
2. If `pending` rows pile up but never become `sent`, that confirms the **separate** Live cron-job issue described in the troubleshooting guide — the `process-email-queue` cron isn't running on the Live backend. The remedy for that is to **publish the project once more** (the publish flow's OnPublish hook provisions the prod cron job and Vault secret). I'll only escalate if re-publishing doesn't fix it (in which case `prod_infra_setup` is stuck and only support can reset it).

## Summary of edits

- `supabase/functions/send-transactional-email/index.ts` — update `SITE_NAME`, `FROM_DOMAIN`, and From line
- `supabase/functions/auth-email-hook/index.ts` — update `SITE_NAME`, `FROM_DOMAIN`, and From line
- `supabase/config.toml` — `verify_jwt = false` for `send-transactional-email` and `process-email-queue`
- Redeploy `send-transactional-email`, `auth-email-hook`, `process-email-queue`

After approval I'll apply all four edits in one pass and redeploy.

