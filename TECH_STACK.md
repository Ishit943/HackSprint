# 🔧 Monster Match — Technology Stack

> **Project:** Monster Match — Find Your Hackathon Teammate  
> **Event:** Runtime Terror HackSprint 2026  
> **Last Updated:** 2026-10-30

---

## Stack Overview

Monster Match is deliberately built on a **minimal, dependency-free stack**. Every technology choice is justified by the hackathon context: zero setup friction, instant demo-ability, and real production viability.

```
┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                           │
│  HTML5 ──► CSS3 Custom Properties ──► ES6 Modules (native)     │
│  DiceBear Bottts CDN ──► wa.me (WhatsApp click-to-chat)        │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS / Supabase JS Client
┌─────────────────────────────▼───────────────────────────────────┐
│                    SUPABASE (Backend-as-a-Service)              │
│  PostgreSQL ──► Row Level Security ──► Auth ──► Realtime       │
│  Edge Functions (Deno) ──► Meta WhatsApp Cloud API             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend

### HTML5

| Attribute | Detail |
|-----------|--------|
| **Version** | HTML5 (Living Standard) |
| **Structure** | Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>` |
| **Forms** | Native constraint validation API (`required`, `pattern`, `minlength`) |
| **Storage** | `localStorage` (mock mode), `sessionStorage` (auth session) |
| **Key Files** | `index.html`, `explore.html`, `dashboard.html`, `profile.html`, `projects.html`, `login.html`, `signup.html` |

**Rationale:** No template engine needed. Static HTML with JS-driven DOM manipulation is sufficient for the feature set, and keeps the project deployable to any static host without a build step.

---

### CSS3 with Custom Properties

| Attribute | Detail |
|-----------|--------|
| **Methodology** | Custom properties (CSS variables) for theming + BEM-light class naming |
| **Layout** | CSS Grid (card grids, dashboard layout) + Flexbox (components, nav) |
| **Animations** | `@keyframes` for glow pulses; `transition` for hover effects |
| **Responsive** | Mobile-first; breakpoints at `480px`, `768px`, `1024px` |
| **Key Files** | `css/theme.css`, `css/components.css`, `css/pages/*.css` |

**Design Tokens (Custom Properties):**

```css
:root {
  /* Colors */
  --color-bg:           #0a0a0c;   /* Obsidian Black */
  --color-surface:      #111114;   /* Card surface */
  --color-surface-2:    #1a1a1f;   /* Elevated surface */
  --color-border:       #2a2a32;   /* Subtle borders */
  --color-accent:       #ff7300;   /* Pumpkin Orange */
  --color-accent-hover: #ff8c1a;   /* Brighter orange on hover */
  --color-text:         #e8e8f0;   /* Primary text */
  --color-text-muted:   #888899;   /* Secondary text */

  /* Typography */
  --font-base: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --text-base: 16px;
  --line-height: 1.6;

  /* Spacing (8px grid) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

**Rationale:** CSS custom properties enable the Halloween dark theme to be applied globally at the `:root` level with zero JavaScript. Future theme switching (e.g., a light mode) can be toggled by swapping a single CSS class on `<html>`.

---

### ES6 Modules (Native Browser Modules)

| Attribute | Detail |
|-----------|--------|
| **Syntax** | `import`/`export` statements; `type="module"` on script tags |
| **Bundler** | **None** — native browser module resolution |
| **Compatibility** | All modern browsers (Chrome 61+, Firefox 60+, Safari 10.1+) |
| **Module Structure** | `js/config.js` → `js/auth.js` → `js/[page].js` → `js/supabase-client.js` |

```
js/
├── config.js          # App config, Supabase keys, feature flags
├── auth.js            # Auth module (login, signup, session, email validator)
├── storage.js         # localStorage abstraction (mm_ prefix namespace)
├── matchScore.js      # 100-point match scoring algorithm
├── explore.js         # Student directory + filter engine
├── connections.js     # Connection state machine
├── trust.js           # Safety & Trust agent (rate limiter, XSS sanitizer)
├── whatsapp.js        # WhatsApp Dispatcher agent (wa.me URL builder)
├── projects.js        # Project CRUD + interest expression
├── dashboard.js       # Recommendation engine + stats aggregator
├── profile.js         # Profile loader + privacy filter
├── profile-edit.js    # Profile editor + completeness calculator
└── supabase-client.js # Supabase JS v2 client init
```

**Rationale:** Native modules eliminate the need for Webpack, Vite, or any bundler. In a hackathon setting, this means the project runs immediately with `python -m http.server` — no `npm install`, no build command.

---

## 2. Backend — Supabase

### PostgreSQL (via Supabase)

| Attribute | Detail |
|-----------|--------|
| **Version** | PostgreSQL 15 (managed by Supabase) |
| **Tables** | 17 tables including: `profiles`, `skills`, `profile_skills`, `interests`, `profile_interests`, `connection_requests`, `projects`, `project_roles`, `project_role_skills`, `project_interests`, `project_members`, `notifications` |
| **Schema File** | `supabase/schema.sql` |
| **Seed File** | `supabase/seed.sql` (6 student personas + 3 demo projects) |

**Rationale:** Supabase over Firebase (see `DECISIONS.md` ADR-6). SQL and relational joins are a natural fit for the many-to-many skill ↔ student and role ↔ project relationships. PostgreSQL functions and triggers handle data integrity without application-layer code.

---

### Supabase Auth

| Attribute | Detail |
|-----------|--------|
| **Method** | Email/password with Supabase Auth |
| **Email Validation** | College domain check: `.ac.in`, `.edu`, and whitelisted university domains |
| **Session** | JWT stored in `localStorage` by Supabase JS client |
| **RLS** | All tables protected; `auth.uid()` used in policies |

**College Email Validator (client-side, enforced again server-side):**
```javascript
const ALLOWED_DOMAINS = ['.ac.in', '.edu', 'juet.ac.in'];
function isCollegeEmail(email) {
  return ALLOWED_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
}
```

---

### Supabase Realtime

| Attribute | Detail |
|-----------|--------|
| **Use Case** | Live connection request notifications on Dashboard |
| **Channel** | `connection_requests` table changes filtered by `receiver_id = auth.uid()` |
| **Client** | `supabase.channel()` subscription in `js/dashboard.js` |

---

### Supabase Edge Functions (Deno)

| Attribute | Detail |
|-----------|--------|
| **Runtime** | Deno (TypeScript-native) |
| **Function** | `supabase/functions/send-whatsapp/index.ts` |
| **Trigger** | Database webhook on `connection_requests.status = 'accepted'` |
| **Action** | `POST /v18.0/{phone-number-id}/messages` to Meta Graph API |
| **Templates** | `connection_request_alert`, `request_accepted` |
| **Secret** | `WHATSAPP_TOKEN` stored in Supabase secrets vault |

---

## 3. Avatars — DiceBear Bottts

| Attribute | Detail |
|-----------|--------|
| **API** | `https://api.dicebear.com/7.x/bottts/svg?seed=<userId>` |
| **Style** | `bottts` — robot/monster aesthetic, matches Halloween theme |
| **Seed** | User's UUID from Supabase Auth (deterministic, unique per user) |
| **Format** | SVG (scalable, tiny file size) |
| **Colors** | DiceBear accent color set to `#ff7300` via `backgroundColor` param |

**Rationale:** See `DECISIONS.md` ADR-4. DiceBear eliminates profile photo uploads, storage costs, and moderation concerns entirely. Every user gets a unique monster mascot instantly on signup.

---

## 4. WhatsApp Integration

### Phase 4 — wa.me Click-to-Chat (Live)

| Attribute | Detail |
|-----------|--------|
| **URL Format** | `https://wa.me/<E164_phone>?text=<encoded_message>` |
| **Phone Cleaning** | Strip all non-digit chars; prepend `91` for Indian numbers if not present |
| **Message Template** | `Hi {firstName}, I saw your profile on Monster Match at Runtime Terror HackSprint and I'd like to connect! 👾` |
| **Works On** | Mobile (opens WhatsApp app), Desktop (opens WhatsApp Web) |
| **Meta Approval** | None required |
| **Cost** | Free |

### Phase 8 — Meta WhatsApp Cloud API (Planned)

| Attribute | Detail |
|-----------|--------|
| **Endpoint** | `POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages` |
| **Auth** | Bearer token stored as Supabase secret `WHATSAPP_TOKEN` |
| **Templates** | `connection_request_alert` (new request), `request_accepted` (connection accepted) |
| **Invocation** | Supabase Edge Function triggered by DB webhook |
| **Approval** | Requires Meta Business verification (in progress) |

---

## 5. Local Development

### Dev Server

```bash
python -m http.server 3000 --bind 127.0.0.1
```

| Attribute | Detail |
|-----------|--------|
| **Server** | Python's built-in `http.server` module |
| **Port** | `3000` |
| **Bind** | `127.0.0.1` (localhost only) |
| **Requirement** | Python 3.x (pre-installed on most dev machines) |
| **Why not npm?** | Zero `node_modules`; no package.json needed in development |

### Mock Mode Toggle

```javascript
// js/config.js
export const USE_MOCK_DATA = true; // Switch to false for live Supabase
```

When `USE_MOCK_DATA = true`:
- All data reads/writes go to `localStorage` with `mm_` prefix
- 6 pre-seeded student personas are available immediately
- No Supabase account or internet connection required
- Perfect for hackathon demos without live infrastructure

---

## 6. CI/CD (Planned — Phase 10)

| Tool | Purpose |
|------|---------|
| **GitHub Actions** | Automated checks on every push |
| **HTML Validator** | W3C HTML5 validation via `validator.nu` action |
| **CSS Lint** | Stylelint with recommended config |
| **Lighthouse CI** | Performance + accessibility scoring (target: Lighthouse > 90) |
| **Deploy** | GitHub Pages or Netlify (static hosting, zero server cost) |

---

## 7. Typography

| Element | Value |
|---------|-------|
| **Font Family** | `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` |
| **Base Size** | `16px` |
| **Line Height** | `1.6` |
| **Heading Scale** | `h1: 2.5rem`, `h2: 2rem`, `h3: 1.5rem`, `h4: 1.25rem` |
| **Monospace** | `'JetBrains Mono', 'Fira Code', monospace` (code snippets) |

**Rationale:** System UI stack loads instantly (zero web font request), looks native on every OS, and is highly legible at all sizes including mobile.

---

## 8. Icons & Imagery

| Type | Implementation |
|------|---------------|
| **App Logo** | 🎃 Unicode pumpkin emoji + "Monster Match" wordmark in CSS |
| **UI Icons** | Unicode emoji (`🔗`, `✅`, `❌`, `🏆`, `👾`, `📧`, `📱`) — zero icon font overhead |
| **Skill Tier Dots** | CSS `::before` pseudo-elements with `border-radius: 50%` |
| **Match Score Badge** | CSS gradient pill with dynamic color class (green/yellow/orange/red) |
| **Student Avatars** | DiceBear Bottts SVG via CDN (no upload, no storage) |

---

## 9. Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Fully supported |
| Edge | 80+ | ✅ Fully supported |
| Firefox | 75+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Chrome Android | 80+ | ✅ Fully supported (WhatsApp wa.me opens app) |
| Safari iOS | 14+ | ✅ Tested |
| IE 11 | — | ❌ Not supported (ES6 modules unsupported) |

---

## 10. Dependency Inventory

| Dependency | Type | Version | CDN? | Purpose |
|-----------|------|---------|------|---------|
| Supabase JS | Runtime | v2.x | Yes (`cdn.jsdelivr.net`) | DB + Auth client |
| DiceBear Bottts | API | v7.x | Yes (API call) | Monster mascot generation |
| *All else* | — | — | — | **Zero external dependencies** |

> **Note:** No npm packages. No `node_modules`. No build tooling. The entire codebase is vanilla HTML, CSS, and JavaScript.
