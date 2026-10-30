# 🐛 Monster Match — Known Issues

> Transparent documentation of current limitations, workarounds, and planned resolutions.

---

> [!NOTE]
> This document is maintained as part of the project's commitment to honest, transparent engineering. Known issues are tracked here so judges, collaborators, and future contributors can understand the current state of the application.

---

## Issue Index

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | IDE browser `ERR_ADDRESS_INVALID` at `http://[::]:3000` | Low | ✅ Workaround available |
| 2 | Supabase not configured in production | Medium | ✅ Mock mode active |
| 3 | WhatsApp Cloud API not approved | Medium | 📋 Phase 8 planned |
| 4 | Profile edits lost on browser clear | Low | 📋 Fix planned |
| 5 | No pagination on explore page | Low | ✅ Acceptable for demo |
| 6 | Session expires on browser close | Low | 📋 Fix planned |
| 7 | DiceBear Bottts requires internet | Low | ✅ Fallback active |
| 8 | No real email sent during signup (mock mode) | Info | ✅ Expected behaviour |

---

## Detailed Issue Descriptions

---

### Issue #1 — IDE Browser Shows `ERR_ADDRESS_INVALID` at `http://[::]:3000`

**Severity:** Low  
**Status:** ✅ Workaround Available

**Description:**  
When starting the Python HTTP server with `python -m http.server 3000`, some IDE integrated browsers (e.g., VSCode Simple Browser, JetBrains built-in preview) automatically navigate to `http://[::]:3000` (the IPv6 wildcard address) rather than `http://localhost:3000`. This results in an `ERR_ADDRESS_INVALID` or `ERR_CONNECTION_REFUSED` error.

**Root cause:**  
The server is bound to `127.0.0.1` (IPv4 loopback) when launched with `--bind 127.0.0.1`. IPv6 `[::]` is a different network interface and the server is not listening on it.

**Workaround:**  
Manually navigate to `http://localhost:3000` in either the IDE browser or a standalone browser (Chrome/Firefox recommended).

**Alternative command:**  
```bash
# Without --bind flag listens on all interfaces including IPv6:
python -m http.server 3000
```

**Planned resolution:** Add a `start.sh` / `start.bat` wrapper that opens the correct URL automatically.

---

### Issue #2 — Supabase Not Configured in Production

**Severity:** Medium  
**Status:** ✅ Mock localStorage Mode Active

**Description:**  
The Supabase project URL and anon key in `js/config.js` (or `.env`) are placeholder values. The application detects missing/invalid Supabase configuration at startup and silently switches to **mock localStorage mode**.

**Affected features:**
- Real-time connection request notifications
- Cross-device data persistence
- WhatsApp Cloud API edge function
- Row-Level Security enforcement

**Unaffected features (all work in mock mode):**
- All 8 demo flow steps
- Match algorithm and skill filters
- Connection request send/accept/decline
- Profile completeness meter
- WhatsApp `wa.me` click-to-chat

**Workaround:**  
No action required for demo purposes. The app is fully functional in mock mode.

**Resolution path:**  
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `database/schema.sql` in the Supabase SQL editor
3. Run `database/seed.sql` to populate demo data
4. Add URL + anon key to `js/config.js`

---

### Issue #3 — WhatsApp Cloud API (Phase 8) Requires Meta Business Verification

**Severity:** Medium  
**Status:** 📋 Planned — Phase 8

**Description:**  
The `functions/send-whatsapp` Supabase Edge Function is written and deployed but cannot send messages because the Meta WhatsApp Business Account has not yet completed the Business Verification process.

**What is blocked:**  
- Automated `connection_request_alert` message when someone sends a request
- Automated `request_accepted` message when a connection is accepted
- Server-initiated WhatsApp template messages generally

**What works as a substitute:**  
Phase 4 `wa.me` click-to-chat works immediately after a connection is accepted, providing equivalent functionality through a user-initiated action rather than an automated push.

**Resolution path:**  
1. Complete Meta Business Verification (typically 1–5 business days)
2. Create and submit `connection_request_alert` and `request_accepted` message templates for Meta approval
3. Add `WHATSAPP_TOKEN` and `PHONE_NUMBER_ID` to Supabase Edge Function secrets

---

### Issue #4 — Profile Edit Changes Persist in localStorage Only

**Severity:** Low  
**Status:** 📋 Fix Planned

**Description:**  
When a user edits their profile (bio, skills, GitHub link, etc.) in mock localStorage mode, the changes are saved to the browser's `localStorage` object. These changes are:
- Lost if the user clears browser storage / site data
- Not visible on other devices or browsers
- Not persisted to Supabase in mock mode

**Impact:** Low for hackathon demo — judges won't clear storage mid-demo.

**Planned resolution:** Implement Supabase write-through in the data adapter so profile updates persist to the database when configured.

---

### Issue #5 — No Pagination on Explore Page

**Severity:** Low  
**Status:** ✅ Acceptable for Current Demo Scale

**Description:**  
The Explore page renders all students in a single DOM pass with no virtual scrolling, infinite scroll, or pagination. With 6 seed students, this is imperceptible. At 50+ students, this would cause noticeable render lag.

**Why not fixed yet:** The mock dataset has exactly 6 students. Premature optimisation would add complexity without user-visible benefit at current scale.

**Planned resolution:** Implement cursor-based pagination (Supabase `.range()`) with a "Load More" button when the student count exceeds 20.

---

### Issue #6 — Session Expires on Browser Close (No Remember-Me)

**Severity:** Low  
**Status:** 📋 Fix Planned

**Description:**  
The current session is stored in `sessionStorage`, which is cleared when the browser tab or window is closed. There is no "Remember me" checkbox or persistent login token.

**User impact:** Returning users must re-select their demo persona on every browser open.

**Planned resolution:**  
- Add a "Remember me" checkbox that switches storage from `sessionStorage` to `localStorage`
- Integrate Supabase Auth JWT refresh tokens for real persistent sessions

---

### Issue #7 — DiceBear Bottts API Requires Internet Connection

**Severity:** Low  
**Status:** ✅ Fallback Active

**Description:**  
Monster mascot avatars are fetched from the DiceBear CDN (`https://api.dicebear.com/`) at render time using a URL like:
```
https://api.dicebear.com/7.x/bottts/svg?seed=<userId>
```
If the device is offline or the CDN is unreachable, avatar images fail to load.

**Fallback behaviour:**  
An `onerror` handler on every `<img>` element replaces the broken avatar with a styled **initials bubble** using the student's name initials and a colour derived from their user ID. The fallback is visually consistent and clearly intentional.

**Planned resolution:** For PWA offline support (Phase 9), cache the first-load avatar SVG in a Service Worker cache for subsequent offline use.

---

### Issue #8 — No Real Email Sent During Signup (Mock Mode)

**Severity:** Informational  
**Status:** ✅ Expected Behaviour

**Description:**  
In mock localStorage mode, the signup flow accepts any email address and performs only client-side domain validation (`.ac.in`, `.edu`) to grant the `🎓 Verified Student` badge. No actual email is sent for verification.

**Why this is intentional for demo:**  
Requiring real email verification would block judges from creating test accounts during evaluation without access to the submitted email inbox.

**In Supabase production mode:**  
Supabase Auth handles email confirmation automatically. The `🎓 Verified Student` badge flow would still trigger on domain regex match post-confirmation.

---

> [!CAUTION]
> Do not attempt to use the WhatsApp Cloud API edge function in production without completing Meta Business Verification. Sending messages without an approved Business Account violates Meta's Terms of Service and may result in account suspension.
