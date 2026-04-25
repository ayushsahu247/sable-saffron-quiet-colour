## The problem with a straight find/replace

Your verified email domain in Lovable is registered as **`www.sableandsaffron.xyz`**, with the verified sender subdomain **`notify.www.sableandsaffron.xyz`**. That is why every From address currently contains `www`.

If I just strip `www` out of the `FROM_DOMAIN` / `SENDER_DOMAIN` constants in the edge functions, **every transactional and auth email will start failing** with a `sender_domain_mismatch` / "no email domain record found" error from the email API — exactly the bug we hit a couple of turns ago. The sending domain has to match what's verified.

So the cosmetic fix you want (`hello@sableandsaffron.xyz` in recipients' inboxes) requires either:

1. **Verify the root domain `sableandsaffron.xyz` as a new email domain in Lovable Cloud → Emails**, then switch the constants over to `notify.sableandsaffron.xyz` / `sableandsaffron.xyz`. This is the clean long-term fix.
2. Or keep the verified `www.sableandsaffron.xyz` domain but use the `display_from_root` style trick — only viable if Lovable's email config allows displaying a different From domain than the verified sender. Currently your config has `FROM_DOMAIN = "notify.www.sableandsaffron.xyz"`, so this isn't enabled.

I need you to add/verify the non-www email domain before I can change the sender address safely.

## What I'll do once the non-www email domain is verified

Update sender address to `hello@sableandsaffron.xyz` and recipient to `orders@sableandsaffron.xyz` everywhere it's hardcoded.

### Files to edit

1. **`supabase/functions/send-transactional-email/index.ts`**
   - `SENDER_DOMAIN = "notify.sableandsaffron.xyz"`
   - `FROM_DOMAIN = "sableandsaffron.xyz"` (so From becomes `Sable & Saffron <hello@sableandsaffron.xyz>`)

2. **`supabase/functions/auth-email-hook/index.ts`**
   - `SENDER_DOMAIN = "notify.sableandsaffron.xyz"`
   - `ROOT_DOMAIN = "sableandsaffron.xyz"`
   - `FROM_DOMAIN = "sableandsaffron.xyz"`

3. **`supabase/functions/_shared/transactional-email-templates/welcome.tsx`**
   - `SITE_URL = 'https://sableandsaffron.xyz'`

4. **`supabase/functions/_shared/transactional-email-templates/contact-enquiry.tsx`**
   - `to: 'hello@sableandsaffron.xyz'` — already correct, no change needed.

5. **`supabase/functions/verify-payment/index.ts`**
   - `OWNER_NOTIFICATION_EMAIL = 'orders@sableandsaffron.xyz'` — already correct, no change needed.

6. **`supabase/functions/create-checkout/index.ts`**
   - Production fallback origin already `https://sableandsaffron.xyz`, no change needed.

7. **`src/pages/Contact.tsx`**
   - `recipientEmail: "hello@sableandsaffron.xyz"` — already correct, no change needed.

8. **`src/components/Seo.tsx`**
   - `SITE_URL = "https://sableandsaffron.xyz"` — already correct, no change needed.

### Deploy

After edits, redeploy:
- `send-transactional-email`
- `auth-email-hook`

(`create-checkout` and `verify-payment` don't need redeploy since they aren't being changed in this pass.)

## What I need from you first

Please use **Cloud → Emails → Manage Domains** to add and verify **`sableandsaffron.xyz`** (the non-www root domain) as an email domain. Once it shows verified, approve this plan again and I'll apply all the constant changes and redeploy in a single pass.

If you'd rather keep `www` in the verified domain and just have me investigate whether a "display From as root" option exists for your current setup, tell me and I'll dig into that route instead.
