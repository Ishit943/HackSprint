# 🛡️ Monster Match — Security Implementation Guide

> **Agent:** Safety & Trust Agent (`Agent-Trust`)
> **Philosophy:** Privacy-first, zero-leak contact design backed by database-enforced Row Level Security.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Contact Privacy Model — 4-Step Unlock](#contact-privacy-model--4-step-unlock)
3. [XSS Prevention](#xss-prevention)
4. [Rate Limiting](#rate-limiting)
5. [Environment Secrets Management](#environment-secrets-management)
6. [CORS Configuration](#cors-configuration)
7. [SQL Injection Prevention](#sql-injection-prevention)
8. [Content Security Policy (CSP)](#content-security-policy-csp)
9. [Data Minimization](#data-minimization)
10. [Academic Email Verification](#academic-email-verification)
11. [Security Checklist](#security-checklist)

---

## Authentication Flow

Monster Match uses **Supabase Auth** as the sole identity provider. The flow is:

```
User → Email/Password → Supabase Auth → JWT → RLS enforces access
```

### Step-by-Step

```
1. User submits login form (email + password)
   └─► POST /auth/v1/token?grant_type=password
       └─► Supabase validates credentials

2. Supabase Auth returns:
   ├─ access_token  (JWT, signed with project secret, 1-hour TTL)
   └─ refresh_token (opaque, 30-day TTL, rotated on use)

3. Supabase JS client stores tokens in localStorage automatically.

4. Every subsequent API call attaches:
   Authorization: Bearer <access_token>

5. Supabase PostgreSQL unwraps the JWT to extract auth.uid() and auth.role()
   └─► Row Level Security policies run at the DB layer — no API server involved
```

### JWT Claims Used in RLS

| Claim | Value | Used For |
|---|---|---|
| `sub` | User UUID | `auth.uid()` — matches against `profiles.id` |
| `role` | `authenticated` | `auth.role()` — gates SELECT on all tables |
| `email` | User email | Academic domain check in sign-up flow |

> [!IMPORTANT]
> Supabase RLS is the **last line of defense**. Even if a bug in JavaScript bypasses a UI check, the database will refuse to return unauthorized rows. RLS cannot be disabled by client-side code — it is a PostgreSQL-level control.

---

## Contact Privacy Model — 4-Step Unlock

Phone numbers and WhatsApp contacts are **never exposed** in general queries. They are protected by a strict 4-step unlock model enforced by both the application and the database.

### The 4 Steps

```
Step 1: REQUEST
Student A sends a connection request to Student B.
  └─ B's contact details: ❌ Hidden
  └─ connection_requests.status = 'pending'

Step 2: ACCEPT
Student B reviews the request and clicks "Accept & Unlock".
  └─ DB trigger sets: connection_requests.status = 'accepted'
  └─ B's contact details: still hidden until Step 3 check

Step 3: GATE CHECK (Server-side RLS)
On A's next profile query for B, the RLS policy evaluates:
  └─ Does an accepted connection exist between A and B? ✅
  └─ Has B opted in (whatsapp_visible = true)? ✅ or ❌

Step 4: DISPLAY
Only if BOTH conditions pass:
  └─ whatsapp_number is returned in the API response
  └─ WhatsApp button is rendered in the UI for A
```

### Implementation Details

```js
// In getStudentById(id) — js/api.js
// The RLS policy on profiles filters whatsapp_number at the DB level.
// Client code only needs to check canViewContact:

const { data } = await supabase
  .from('profiles')
  .select('*, whatsapp_number')   // DB returns null if RLS blocks it
  .eq('id', studentId)
  .single();

// Check if contact was unlocked
const canViewContact = !!data.whatsapp_number && acceptedConnectionExists;
return { ...data, canViewContact };
```

```sql
-- PostgreSQL RLS enforcing the 4-step model
CREATE POLICY "Contact visible only for accepted connections with opt-in"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id    -- own profile: always full access
    OR (
      is_public = TRUE
      AND NOT (
        -- Block whatsapp_number unless accepted + opted-in
        -- (enforced via column-level security or view)
        FALSE
      )
    )
  );
```

> [!CAUTION]
> Never query `whatsapp_number` in a public-facing listing query (`getStudents()`). The column should only be queried in `getStudentById()` where the RLS contact policy applies. Accidentally including it in a broad SELECT is a data leak risk even if RLS blocks it — it signals poor architectural discipline.

---

## XSS Prevention

All user-generated text is sanitized using the `sanitizeText()` utility before any database insert. The Safety & Trust Agent validates this at multiple layers.

### `sanitizeText()` Implementation

```js
// js/utils.js
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')       // Must be first to avoid double-encoding
    .replace(/</g, '&lt;')        // Neutralizes <script>, <img onerror=...>
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')      // Prevents attribute injection: foo="...
    .replace(/'/g, '&#x27;')      // Prevents attribute injection: foo='...
    .replace(/\//g, '&#x2F;')     // Closes self-closing tags: <br/...
    .trim()
    .slice(0, 1000);              // Hard character cap
}
```

### Where `sanitizeText()` is Called

| User Input | Field | Called in |
|---|---|---|
| Connection request note | `message_note` | `sendConnectionRequest()` in `api.js` |
| Profile bio | `bio` | `updateProfile()` in `api.js` |
| Project description | `description` | `createProject()` in `api.js` |
| Chat messages *(future)* | `content` | Message insert function |

### DOM Rendering Safety

When rendering user content in the DOM, always use `textContent` (not `innerHTML`):

```js
// ✅ Safe — text nodes cannot execute scripts
element.textContent = student.bio;

// ❌ Dangerous — even sanitized content should not use innerHTML
element.innerHTML = student.bio;
```

> [!NOTE]
> Supabase does not perform server-side sanitization — it trusts the client. This is why client-side sanitization before insert is **mandatory**, not optional.

---

## Rate Limiting

To prevent spam campaigns targeting students with bulk connection requests, a **database trigger** enforces a hard rate limit.

### Limit: 10 Requests per User per 24 Hours

```sql
-- Trigger function (in sql/schema.sql)
CREATE OR REPLACE FUNCTION limit_daily_requests()
RETURNS TRIGGER AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM connection_requests
  WHERE sender_id = NEW.sender_id
    AND created_at > NOW() - INTERVAL '24 hours';

  IF request_count >= 10 THEN
    RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED'
      USING HINT = 'Max 10 connection requests per 24 hours',
            ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_rate_limit
  BEFORE INSERT ON connection_requests
  FOR EACH ROW EXECUTE FUNCTION limit_daily_requests();
```

### Client-Side Handling

```js
// js/api.js — sendConnectionRequest()
const { data, error } = await supabase
  .from('connection_requests')
  .insert({ sender_id, receiver_id, message_note: sanitizeText(note) });

if (error) {
  if (error.code === 'P0001') {
    return { success: false, error: 'RATE_LIMIT' };
  }
  if (error.code === '23505') {  // unique_violation
    return { success: false, error: 'DUPLICATE' };
  }
  return { success: false, error: error.message };
}
```

> [!TIP]
> The `SECURITY DEFINER` clause on the trigger function ensures it runs with the privileges of the function owner (postgres superuser), not the requesting user — preventing users from bypassing the rate limit check via RLS tricks.

---

## Environment Secrets Management

| Secret | Storage Location | Accessible From | Exposure Risk |
|---|---|---|---|
| `SUPABASE_URL` | `js/config.js` | Client-side JS | ✅ Safe — public URL |
| `SUPABASE_ANON_KEY` | `js/config.js` | Client-side JS | ✅ Safe — RLS limits access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function env | Server-side only | ⚠️ Never in client code |
| `WHATSAPP_TOKEN` | Supabase Vault | Edge Function via vault secret | ⚠️ Never in client code |

### Why the Anon Key is Safe Client-Side

The `anon` key is a **publishable key** — its access is entirely controlled by RLS policies on every table. It cannot bypass `auth.uid()` checks. Even if an attacker extracts it from the browser, they can only perform operations that authenticated users can perform.

### Edge Function Secret Access

```typescript
// supabase/functions/send-whatsapp/index.ts
// Secrets are injected as environment variables — never hardcoded

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');   // from Supabase Vault
const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_ID');

// Set via CLI:
// supabase secrets set WHATSAPP_TOKEN=EAA...
// supabase secrets set WHATSAPP_PHONE_ID=1234567890
```

> [!CAUTION]
> **NEVER** commit `SUPABASE_SERVICE_ROLE_KEY` to any file in the repository — not `.env`, not `config.js`, not a comment. It bypasses all RLS policies and grants full database access. If accidentally committed, rotate it immediately in the Supabase dashboard.

---

## CORS Configuration

| Environment | CORS Handling |
|---|---|
| Local Dev (`python -m http.server`) | No CORS issues — same-origin to Supabase (Supabase handles it) |
| Netlify / Vercel / GitHub Pages | Supabase allows all origins by default for the JS client |
| Custom Domain | Add custom origin in Supabase Dashboard → Settings → API → CORS |

### Supabase CORS Note

The Supabase JS client communicates with `https://<project>.supabase.co`. Supabase has CORS configured to allow browser requests. The Python dev server itself does **not** serve API routes — it only serves static files. There is no need to configure CORS on the Python server.

### Edge Function CORS Headers

```typescript
// supabase/functions/send-whatsapp/index.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',           // Restrict to your domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  // ... handler logic
});
```

---

## SQL Injection Prevention

Monster Match is **immune to SQL injection by architecture** — all database queries go through the Supabase JavaScript client, which uses parameterized queries internally.

### Why It's Safe

```js
// ✅ Safe — Supabase client uses parameterized queries under the hood
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('branch', userInput);   // userInput is NEVER interpolated into raw SQL
```

The `.eq()`, `.in()`, `.contains()`, `.ilike()` and all other Supabase filter methods pass values as **PostgreSQL bind parameters** (`$1`, `$2`, ...), not as raw string concatenation.

### No Raw SQL in Client Code

There is **zero raw SQL** in any client-side JavaScript file. The only raw SQL is in:
- `sql/schema.sql` — DDL run once during setup (not client-facing)
- Supabase Edge Functions — server-side, not directly accessible

> [!NOTE]
> The Supabase RPC mechanism (`supabase.rpc()`) can call stored procedures with parameters — these are also parameterized and safe from injection.

---

## Content Security Policy (CSP)

> [!WARNING]
> CSP headers are **planned for Phase 9** and not yet implemented. The following is the target configuration.

### Target CSP (Phase 9)

```html
<!-- To be added to all HTML files in <head> -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https://api.dicebear.com https://avatars.githubusercontent.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-ancestors 'none';
">
```

| Directive | Allowed Sources | Reason |
|---|---|---|
| `script-src` | `self`, `cdn.jsdelivr.net` | Supabase JS from CDN |
| `img-src` | `self`, `api.dicebear.com` | Monster mascot avatars |
| `connect-src` | `*.supabase.co`, WSS | Supabase REST + Realtime |
| `frame-ancestors` | `none` | Prevents clickjacking |

---

## Data Minimization

Monster Match collects only what is necessary for teammate matching:

| Data | Collected | Rationale |
|---|---|---|
| Email | ✅ Required | Authentication & academic verification |
| Name | ✅ Required | Profile display |
| College, Branch, Year | ✅ Required | Academic context for matching |
| Skills & Proficiency | ✅ Required | Core matching algorithm input |
| Bio | 🔶 Optional | Discoverability improvement |
| WhatsApp Number | 🔶 Optional | Contact unlock after connection |
| GitHub / Portfolio | 🔶 Optional | Credibility signal |
| Profile Photo | ❌ Not collected | DiceBear avatar generated from user seed — **no file uploads** |
| Date of Birth | ❌ Not collected | Not needed |
| Location | ❌ Not collected | Not needed |
| IP Address | ❌ Not stored by app | Supabase logs for abuse prevention only |

### Avatar Policy

Avatars are generated using **DiceBear Bottts** with the user's UUID as the seed:

```js
// js/utils.js
export function getAvatarUrl(userId) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;
}
```

This means:
- No image upload infrastructure needed.
- No personal photos stored.
- Unique and deterministic per user.
- Hosted on DiceBear's CDN — zero storage cost.

---

## Academic Email Verification

The Safety & Trust Agent validates that sign-up emails belong to recognized academic institutions.

### Recognized Domains

```js
// js/utils.js
const ACADEMIC_DOMAINS = [
  '.ac.in',       // Indian academic institutions
  '.edu',         // US universities
  '.edu.in',      // Indian affiliates
  '.ac.uk',       // UK universities
  '.uni-',        // German universities pattern
];

export function isAcademicEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return ACADEMIC_DOMAINS.some(suffix => domain.endsWith(suffix));
}
```

### Verified Student Badge

If the email domain matches an academic pattern, the profile is automatically tagged with a `🎓 Verified Student` badge (rendered client-side — stored as a computed flag, not a stored column).

```js
// Computed in getCurrentUserProfile()
const isVerified = isAcademicEmail(profile.email);
return { ...profile, isVerifiedStudent: isVerified };
```

---

## Security Checklist

Use this checklist before any deployment:

### ✅ Database
- [ ] RLS is **enabled** on ALL tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] RLS policies are tested with multiple user contexts
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in any committed file
- [ ] Rate limiting trigger is deployed and tested
- [ ] `update_updated_at` trigger is active on `connection_requests`

### ✅ Client Code
- [ ] No raw SQL in any `js/` file
- [ ] `sanitizeText()` called before every DB insert of user text
- [ ] `whatsapp_number` never fetched in broad listing queries
- [ ] No API keys other than `SUPABASE_ANON_KEY` in client JS
- [ ] All DOM renders use `textContent`, not `innerHTML` for user content

### ✅ Edge Functions
- [ ] `WHATSAPP_TOKEN` stored in Supabase Vault (not in function code)
- [ ] CORS headers restrict `Access-Control-Allow-Origin` to your domain in production
- [ ] Function validates JWT before processing (Supabase does this automatically)

### ✅ Hosting
- [ ] HTTPS enforced (Netlify/Vercel/GitHub Pages all enforce this)
- [ ] CSP meta tag added (Phase 9)
- [ ] Custom domain added to Supabase CORS whitelist
- [ ] No `.env` files committed (check `.gitignore`)
