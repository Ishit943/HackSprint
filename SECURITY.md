# Security Policy

## Supported Versions

Monster Match is a hackathon project built for **Runtime Terror HackSprint 2026**. Only the current `main` branch is actively maintained and supported with security updates.

| Version / Branch | Supported |
|------------------|-----------|
| `main` (latest)  | ✅ Yes    |
| Any older branch | ❌ No     |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Monster Match, please **do not** open a public GitHub issue. Instead, report it responsibly via email:

**📧 goyalishit1@gmail.com**

Please include in your report:
- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact (data exposure, auth bypass, XSS, etc.)
- Any suggested fix or mitigation (optional but appreciated)

We aim to acknowledge all security reports within **48 hours** and will work to resolve confirmed vulnerabilities promptly.

---

## Security Measures Implemented

### 🔐 Row Level Security (RLS) — Supabase

All tables in the Supabase database have **Row Level Security (RLS) enabled**. This means:
- Unauthenticated users cannot read, write, update, or delete any rows.
- Each authenticated user can only access their own data unless explicitly granted permission by a policy.
- Public student discovery queries return only safe, non-sensitive fields (name, skills, college, bio) — never contact details.
- RLS policies are defined in `sql/schema.sql` and enforced at the database layer, independent of client-side logic.

### 🧼 XSS Sanitization

All user-generated content is sanitized before being rendered to the DOM to prevent **Cross-Site Scripting (XSS)** attacks.

- The `sanitizeText()` utility in `js/utils.js` strips or escapes HTML tags and dangerous characters from:
  - Student bios
  - Project descriptions
  - Connection request notes
  - Any other free-text user input
- Content is never inserted via `innerHTML` with unsanitized strings. Safe insertion methods (`textContent`, `createElement`, or post-sanitization `innerHTML`) are used throughout.

### 🔒 Privacy-Gated Contact Details

Phone numbers and WhatsApp contact information are treated as **sensitive private data**:

- Contact details (phone, WhatsApp number) are **never returned** in any public search or student listing query.
- The Supabase RLS policies explicitly exclude contact columns from `SELECT` permissions on public-facing queries.
- Contact details are only accessible **after both users have an accepted connection** AND both have opted in to sharing their contact information.
- The WhatsApp click-to-chat link is generated client-side only after confirming a mutual accepted connection — it is never pre-populated or cached in a way accessible to third parties.

### 🎓 College Email Domain Validation

To ensure Monster Match is used exclusively by students, registration enforces academic email verification:

- Only email addresses from recognized academic domains are accepted:
  - `.ac.in` — Indian academic institutions (e.g., `juet.ac.in`)
  - `.edu` — US and international universities
  - Additional institution-specific domains may be added to the allowlist in `js/auth.js`
- Domain validation is enforced on the **client side** at registration and additionally validated in **Supabase Auth hooks** where configured.
- Successfully validated users receive the `🎓 Verified Student` badge on their profile.

### ⏱️ Rate Limiting on Connection Requests

To prevent spam and abuse of the connection system:

- Connection request rate limiting is enforced via a **Supabase database trigger** (defined in `sql/triggers.sql`).
- The trigger checks the number of connection requests sent by a user within a rolling time window and rejects new requests that exceed the limit.
- This is enforced at the database level, making it impossible to bypass via client-side manipulation.

### 🔑 No Secrets in Client-Side Code

The project follows strict secrets management:

- Only the **Supabase anonymous (anon) key** is present in client-side JavaScript (`js/config.js`). The anon key has limited permissions governed entirely by RLS policies.
- The **Supabase service role key** is **never** used or stored in any client-side file. It is restricted to server-side use only.
- The **WhatsApp Cloud API access token** is stored exclusively as a **Supabase Edge Function secret** (environment variable), never in any file committed to the repository.
- The `.github/workflows/ci.yml` CI pipeline includes a check that scans all tracked files for `SUPABASE_SERVICE_ROLE_KEY` and fails the build if found.
- A `.gitignore` rule prevents any `.env` files from being committed.

### 🛡️ Content Security Policy (CSP)

> **Status: Planned for Phase 9**

HTTP `Content-Security-Policy` headers will be configured to:
- Restrict script sources to `'self'` and approved CDN origins (Supabase, DiceBear).
- Disallow inline event handlers (`onclick`, etc.) and unsafe `eval()`.
- Enforce `frame-ancestors 'none'` to prevent clickjacking.

This will be implemented when a deployment environment with configurable response headers is set up.

---

## Known Limitations

### localStorage Mock Mode

- The project includes a **mock/demo mode** (toggled in `js/config.js`) that stores student and project data in the browser's `localStorage` instead of Supabase.
- This mode is intended for **local development and UI testing only**.
- `localStorage` data is stored in plaintext in the browser and is accessible to any JavaScript running on the same origin.
- **Do not use mock mode with real personal data** (real names, phone numbers, email addresses).
- Mock mode is automatically disabled when valid Supabase credentials are configured.

### Client-Side Validation Only (Some Fields)

- Some input validations (field length, format checks) are currently enforced only on the client side. Database constraints and server-side validation will be hardened in future phases.

### No HTTPS Enforcement on Local Dev Server

- The Python development server (`python -m http.server`) serves over plain HTTP. This is acceptable for local development only.
- All production deployments must be served over HTTPS.

---

## Security Checklist for Contributors

Before submitting a pull request, verify:

- [ ] No API keys, tokens, passwords, or secrets are hardcoded in any file
- [ ] No `.env` files are staged for commit
- [ ] All user inputs rendered to the DOM pass through `sanitizeText()` in `js/utils.js`
- [ ] No direct SQL queries bypass RLS (all queries use the Supabase client with the anon key)
- [ ] Contact fields (phone, whatsapp) are not included in public listing queries
- [ ] New edge functions store secrets as environment variables, not in source code

---

*Last updated: HackSprint 2026 — Runtime Terror*
