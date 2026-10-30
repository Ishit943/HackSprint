# 🏛️ Monster Match: System Architecture Specification

> **Technical Architecture & Engineering Blueprint**  
> **Project:** Monster Match (PS10) — Find Your Project Teammate  
> **Event:** Runtime Terror HackSprint 2026

---

## 1. High-Level System Architecture

Monster Match is architected as a modern, decoupled web application. It combines a lightweight, framework-free client (HTML5, CSS3, ES6 JavaScript) with a managed backend layer (Supabase PostgreSQL with Row-Level Security) and serverless edge functions for third-party integrations (WhatsApp Business Cloud API).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT TIER (Browser Runtime)                         │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                          Presentation Layer                         │   │
│   │   • index.html (Landing)             • pages/explore.html (Search)  │   │
│   │   • pages/connections.html (Connect) • pages/projects.html (Posts)  │   │
│   │   • pages/dashboard.html (Matches)   • pages/profile-view.html      │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                      │
│   ┌──────────────────────────────────▼──────────────────────────────────┐   │
│   │                         Design Tokens & CSS                         │   │
│   │   • css/variables.css (Halloween Theme: Obsidian Black & Orange)    │   │
│   │   • css/base.css (Reset, Typography, Layout Containers, Toasts)     │   │
│   │   • css/components.css (Cards, Badges, Chips, Modals, Sliders)      │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                      │
│   ┌──────────────────────────────────▼──────────────────────────────────┐   │
│   │                        Modular Logic Services                       │   │
│   │   • js/auth.js      (Session management & College Verification)     │   │
│   │   • js/api.js       (Unified DB Layer & Local Demo Mock Engine)     │   │
│   │   • js/utils.js     (Match Algorithm, Sanitizer, URL Formatters)    │   │
│   │   • js/config.js    (Environment Keys & Live/Mock Mode Switch)      │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ HTTPS / WSS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BACKEND & DATA TIER (Supabase)                          │
│                                                                             │
│   ┌──────────────────────────┐             ┌────────────────────────────┐   │
│   │   Supabase Auth Engine   │             │   PostgreSQL 15 Database   │   │
│   │  • Email/Password        │             │  • 17 Relational Tables    │   │
│   │  • College Domain Verify │             │  • Row-Level Security (RLS)│   │
│   │  • Auto-Profile Trigger  │             │  • Performance Indexes     │   │
│   └─────────────┬────────────┘             └─────────────▲──────────────┘   │
│                 │                                        │                  │
│                 └────────────────────────────────────────┘                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDGE & MESSAGING INTEGRATION TIER                        │
│                                                                             │
│   ┌────────────────────────────────┐     ┌──────────────────────────────┐   │
│   │   Client Click-to-Chat Gate    │     │  Supabase Edge Function      │   │
│   │   • Direct wa.me links         │     │  • functions/send-whatsapp/  │   │
│   │   • Native tel: dialers        │     │  • Meta WhatsApp Cloud API   │   │
│   │   • Instant, zero API cost     │     │  • Serverless token storage  │   │
│   └────────────────────────────────┘     └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer-by-Layer Architectural Breakdown

### 2.1 Presentation & UI Layer
- **Zero-Dependency Architecture:** Eliminates heavy build tools, bundlers, and compilation steps. Native ES6 modules (`import`/`export`) run directly in modern browsers.
- **Design System Tokens (`css/variables.css`):**
  - **Color Palette:** Halloween Obsidian Black (`#0a0a0c`, `#121216`) paired with Jack-o'-Lantern Orange (`#ff7300`, `#ff8c26`) and Slime Green (`#10b981`).
  - **Theming:** Dual mode (Dark/Light) controlled via the `data-theme` attribute on `<html>`, persisting in `localStorage`.
- **Reusable Component Library (`css/components.css`):**
  - Card components with glowing atmospheric orange borders on hover.
  - Three-tier proficiency badges: `.chip-beginner`, `.chip-intermediate`, and `.chip-advanced`.
  - Smart Match pills, progress meters, responsive modal overlays, and accessible navigation bars.

### 2.2 Client-Side Service & Logic Layer
The application logic is decoupled into 4 lightweight ES modules:
1. **[`js/config.js`](js/config.js):**
   - Configures the Supabase API URL and anonymous public key.
   - Includes `isLiveSupabaseConfigured()` to seamlessly toggle between live production Supabase and interactive offline/demo mode.
2. **[`js/auth.js`](js/auth.js):**
   - Manages user authentication, session persistence, and logout routines.
   - Evaluates email domain extensions (`.ac.in`, `.edu`, college domains) to award the verified student credential.
3. **[`js/utils.js`](js/utils.js):**
   - **XSS Prevention:** `escapeHtml()` sanitizes all user inputs before rendering into the DOM.
   - **Debouncing:** `debounce()` bounds live search input to 300ms intervals.
   - **URL Generators:** `formatWhatsAppUrl()` and `formatTelUrl()` sanitize and build valid international telephony and chat links.
   - **Match Algorithm:** Implements the four-variable compatibility formula.
4. **[`js/api.js`](js/api.js):**
   - Acts as the Single Source of Truth (SSOT) for data retrieval and mutation.
   - Handles multi-criteria querying: full-text search, academic year, branch, status, and **AND/OR multi-skill logic**.

---

## 3. Database Schema & Data Models

The database is built on **PostgreSQL** in Supabase. The complete SQL DDL is maintained in [`sql/schema.sql`](sql/schema.sql).

### 3.1 Entity-Relationship (ER) Overview

```
 ┌───────────────┐           ┌──────────────────┐           ┌────────────────┐
 │     users     │1         N│   user_skills    │N         1│     skills     │
 │───────────────┼───────────┼──────────────────┼───────────┼────────────────│
 │ id (UUID, PK) │           │ user_id (FK)     │           │ id (UUID, PK)  │
 │ email         │           │ skill_id (FK)    │           │ name           │
 │ full_name     │           │ level            │           │ category       │
 │ phone (hidden)│           └──────────────────┘           └────────────────┘
 │ whatsapp_num  │
 └───────┬───────┘
         │1
         │
         │N
 ┌───────▼───────────────┐1         N┌───────────────────────┐
 │       projects        ├───────────┤     project_roles     │
 │───────────────────────┤           │───────────────────────│
 │ id (UUID, PK)         │           │ id (UUID, PK)         │
 │ owner_id (FK -> users)│           │ project_id (FK)       │
 │ title                 │           │ role_title            │
 │ category              │           │ slots                 │
 │ deadline              │           └───────────┬───────────┘
 └───────────────────────┘                       │1
                                                 │N
                                     ┌───────────▼───────────┐
                                     │  project_role_skills  │
                                     │───────────────────────│
                                     │ role_id (FK)          │
                                     │ skill_id (FK)         │
                                     └───────────────────────┘
```

### 3.2 Key Relational Tables

| Table | Purpose | Privacy / Security |
|---|---|---|
| `users` | User profiles, bio, links, and contact channels | Phone and WhatsApp are protected via conditional queries & RLS |
| `skills` | Master library of tech stacks across categories | Publicly readable |
| `user_skills` | Student skills with `beginner`, `intermediate`, `advanced` tiers | Editable only by owner |
| `projects` | Project posts, hackathon info, and team requirements | Editable only by owner |
| `project_roles` | Specific positions required per project (with slot counts) | Managed by project owner |
| `connection_requests` | Peer connection requests with `pending`, `accepted`, `declined` states | Viewable only by sender and receiver |
| `teams` & `team_members` | Formed squads and role designations | Team-restricted access |
| `whatsapp_logs` | Audit trail for serverless WhatsApp Cloud API messages | Admin / internal access |

---

## 4. Privacy & Security Engineering

### 4.1 Contact Privacy by Default
Student phone numbers and WhatsApp links are **strictly hidden** across public directory queries.
- **Rule:** Contact information is unlocked if and only if:
  1. The requesting user is the profile owner, OR
  2. A mutual `connection_request` exists with status `accepted`, AND
  3. The profile owner has enabled `show_phone` / `show_whatsapp`.
- Enforced at both the client API layer in [`js/api.js`](js/api.js) and the PostgreSQL Row-Level Security layer in [`sql/schema.sql`](sql/schema.sql).

### 4.2 Automated User Profile Creation (Postgres Trigger)
When a user signs up through Supabase Auth, a trigger automatically inserts a record into `public.users`:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. WhatsApp & Communication Architecture

Monster Match implements a dual-tiered communication pipeline:

```
                      User Clicks Connect
                              │
                    Connection Accepted?
                             ╱ ╲
                           NO   YES
                          ╱       ╲
               Keep Contact        Unlock Contact Channels
                  Protected                 │
                                  ┌─────────┴─────────┐
                                  ▼                   ▼
                          Tier 1 (Instant)    Tier 2 (Cloud API)
                          Click-to-Chat       Supabase Edge Function
                          (wa.me / tel:)      (Meta WhatsApp API)
```

1. **Tier 1 — Instant Click-to-Chat (`wa.me` & `tel:`):**
   - Free, zero API setup, no business verification required.
   - Opens the native WhatsApp application on mobile or WhatsApp Web on desktop with pre-composed context.
2. **Tier 2 — Meta WhatsApp Cloud API (`functions/send-whatsapp`):**
   - Automated server-side webhook notification when connection requests are accepted.
   - Access tokens (`WHATSAPP_ACCESS_TOKEN`) and phone IDs are securely stored in serverless environment variables.

---

## 6. Deployment & Hosting Strategy

- **Frontend Hosting:** Any static host (Vercel, Netlify, GitHub Pages, or Cloudflare Pages) directly serves the root `index.html` and `pages/`.
- **Database & Auth:** Hosted on Supabase (PostgreSQL 15).
- **Serverless Functions:** Deployed to Supabase Edge Functions (Deno runtime).
- **Local Testing:** Served via Python HTTP server or Node.js without any compilation:
  ```powershell
  python -m http.server 3000 --bind 127.0.0.1
  ```
