# 🗺️ Monster Match — Project Plan & Development Phases

> **Project:** Monster Match — Find Your Hackathon Teammate  
> **Event:** Runtime Terror HackSprint 2026  
> **Reference:** See also [`roadmap.md`](./roadmap.md) for the detailed sprint timeline  
> **Last Updated:** 2026-10-30

---

## Overview

Monster Match is developed in **10 incremental phases**, each delivering a shippable, demo-able slice of functionality. The phase structure is designed for rapid hackathon development: early phases unlock the core loop (discover → connect → collaborate), while later phases layer intelligence, real data, and polish.

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
Foundation   Explore    Connect    WhatsApp   Projects

Phase 6 ──► Phase 7 ──► Phase 8 ──► Phase 9 ──► Phase 10
Dashboard   Profile   Supabase     Polish    Deploy & Ship
```

---

## Phase Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | **DONE** — Fully implemented and tested |
| 🔄 | **IN PROGRESS** — Currently being built |
| 📋 | **PLANNED** — Scoped but not yet started |

---

## Phase 1: Foundation ✅ DONE

**Goal:** Establish the HTML structure, CSS design system, and authentication shell.

### Deliverables
- [x] `index.html` — Landing page with animated hero, live student showcase carousel
- [x] `login.html` — Login form with 6 one-click demo persona buttons (Aryan, Priya, Rahul, Sneha, Vikram, Ananya)
- [x] `signup.html` — Registration form with college email validation (`.ac.in` / `.edu`)
- [x] `css/theme.css` — Full Halloween CSS design system (obsidian black `#0a0a0c`, pumpkin orange `#ff7300`)
- [x] `css/components.css` — Reusable component styles: `.card`, `.btn-primary`, `.skill-pill`, `.modal`
- [x] `js/config.js` — App configuration, Supabase keys (mock mode toggle), constants
- [x] `js/auth.js` — Auth module: login, signup, session management, college email validator
- [x] `js/storage.js` — localStorage abstraction with `mm_` prefix namespace
- [x] Responsive navigation with mobile hamburger menu
- [x] 6 seed student personas with realistic JUET student data

### Key Technical Decisions Made
- Pure HTML/CSS/JS — no framework (see `DECISIONS.md` ADR-1)
- localStorage as mock backend (ADR-2)

---

## Phase 2: Core Features — Explore Page ✅ DONE

**Goal:** Build the student discovery engine with skill-based filtering and match score display.

### Deliverables
- [x] `explore.html` — Student directory page
- [x] `js/explore.js` — Filter engine, card renderer, sort logic
- [x] `js/matchScore.js` — 100-point match scoring algorithm (skills 70% + availability 15% + interest 10% + proficiency 5%)
- [x] Multi-skill filter with AND/OR toggle
- [x] Filter by: domain interests, availability (hrs/week), branch, year
- [x] Sort by: match score (default), name A–Z, newest
- [x] Student card component: monster mascot, name, branch, top 3 skills, match score badge
- [x] Empty state: no matches found message with filter reset CTA
- [x] Client-side real-time filtering (no server requests)

### Key Technical Decisions Made
- Match score computed client-side for zero-latency filtering
- DiceBear Bottts API for monster mascots (ADR-4)

---

## Phase 3: Connection System ✅ DONE

**Goal:** Enable students to send, receive, accept, and reject connection requests with note gating.

### Deliverables
- [x] `connections.html` — Connections management page (Pending / Accepted / Sent tabs)
- [x] `js/connections.js` — Connection state machine: send → pending → accept/reject
- [x] `js/trust.js` — Safety & Trust agent: rate limiting (10 req/hr), XSS sanitizer
- [x] Send connection request modal with optional note (300 char limit)
- [x] Pending requests inbox with accept/reject actions
- [x] Sent requests tracker with status badges (Pending / Accepted / Rejected)
- [x] Contact unlock: phone + WhatsApp revealed on accepted connection
- [x] Connection state persistence in localStorage (`mm_connections`)

---

## Phase 4: WhatsApp Integration ✅ DONE

**Goal:** Bridge in-app connections to real-world WhatsApp conversations.

### Deliverables
- [x] `js/whatsapp.js` — WhatsApp Dispatcher Agent (client-side `wa.me` pipeline)
- [x] Phone number cleaner: strips non-digit characters, handles `+91` prefix
- [x] Personalized `wa.me` URL builder: `https://wa.me/<phone>?text=Hi%20{name}%2C%20I%20saw%20your%20profile%20on%20Monster%20Match...`
- [x] "Chat on WhatsApp" button appears on accepted connections only
- [x] Works on mobile (opens WhatsApp app), desktop (opens WhatsApp Web)
- [x] Zero Meta API approval required — purely client-side click-to-chat

### Key Technical Decisions Made
- `wa.me` over WhatsApp Cloud API for Phase 4 (ADR-3)

---

## Phase 5: Projects Directory ✅ DONE

**Goal:** Allow team leads to list projects with open roles, and students to discover and express interest.

### Deliverables
- [x] `projects.html` — Projects directory with card grid
- [x] `project-create.html` — Project creation form with dynamic role builder
- [x] `js/projects.js` — Project CRUD, interest expression, filter logic
- [x] Project card: title, domain, tech stack tags, open role slots, team lead info
- [x] Dynamic role builder: add/remove roles, assign required skills per role
- [x] Filter projects by: domain, technology, open roles available
- [x] "Express Interest" flow: student selects target role, sends note to team lead
- [x] Project status lifecycle: Open → In Progress → Closed
- [x] Project persistence in localStorage (`mm_projects`)

---

## Phase 6: Smart Dashboard ✅ DONE

**Goal:** Give each student a personalized command center with match recommendations and connection activity.

### Deliverables
- [x] `dashboard.html` — Personal dashboard page (authenticated gate)
- [x] `js/dashboard.js` — Recommendation engine, stats aggregator
- [x] "Best Matches for You" section — top 5 students ranked by match score
- [x] "Recommended Projects" section — projects where student fits an open role
- [x] "Team Gap Analysis" — skills the current team project is missing
- [x] Pending connections widget (incoming requests with quick accept/reject)
- [x] Stats summary: profile views, connections made, match quality tier
- [x] Profile completeness meter with nudge badges (Agent-Profile logic)

---

## Phase 7: Profile System ✅ DONE

**Goal:** Full profile view and edit experience with skill proficiency editor and completeness scoring.

### Deliverables
- [x] `profile.html` — Public profile view page (privacy-protected: phone hidden unless connected)
- [x] `profile-edit.html` — Profile editor with live completeness meter
- [x] `js/profile.js` — Profile loader, privacy filter, view tracker
- [x] `js/profile-edit.js` — Save handler, validation, completeness calculator
- [x] Skill proficiency editor: add skill → set level (beginner/intermediate/advanced) → save
- [x] Proficiency visual tiers: gray dot (beginner), blue dot (intermediate), orange glow (advanced)
- [x] Bio character counter with minimum length validation (> 20 chars)
- [x] Portfolio link validator (GitHub URL format check)
- [x] Monster mascot auto-assignment via DiceBear Bottts seeded on user ID
- [x] Completeness progress bar: animated fill from 0–100%

---

## Phase 8: Supabase Integration 🔄 IN PROGRESS

**Goal:** Replace localStorage mock with live Supabase PostgreSQL database, real authentication, and serverless WhatsApp notifications.

### Deliverables
- [x] `supabase/schema.sql` — 17-table schema with RLS policies, triggers, indexes
- [x] `supabase/seed.sql` — Seed data for 6 student personas + 3 demo projects
- [x] `supabase/functions/send-whatsapp/` — Edge function for Meta WhatsApp Cloud API
- [x] `js/supabase-client.js` — Supabase JS client initialization with anon key
- [ ] **Live Supabase project configuration** (URL + anon key in `js/config.js`)
- [ ] **Real auth flow:** Email/password signup with college domain validator
- [ ] **Session persistence:** Supabase session → replace localStorage auth tokens
- [ ] **Profile sync:** localStorage profiles migrated to `profiles` table (RLS: users own their row)
- [ ] **Connections sync:** `connection_requests` table with realtime subscription
- [ ] **Projects sync:** `projects` + `project_roles` tables
- [ ] **WhatsApp Edge Function deployment** to Supabase Functions runtime
- [ ] **RLS audit:** verify no phone/email leakage in public-facing queries
- [ ] End-to-end test: signup → connect → accept → WhatsApp unlock → Cloud API notification

### Remaining Work
```
[ ] Configure Supabase project (create on supabase.com)
[ ] Add SUPABASE_URL + SUPABASE_ANON_KEY to js/config.js
[ ] Run schema.sql on live project
[ ] Run seed.sql for demo data
[ ] Deploy send-whatsapp edge function
[ ] Switch USE_MOCK_DATA = false in js/config.js
[ ] Test full auth flow with .ac.in email
[ ] Test connection request → acceptance → WhatsApp API trigger
```

---

## Phase 9: Polish & Optimization 📋 PLANNED

**Goal:** Performance tuning, UX polish, edge case handling, and accessibility improvements.

### Planned Deliverables
- [ ] Loading skeleton screens for async data fetches
- [ ] Error boundary pages (404, auth error, network offline)
- [ ] Form validation micro-animations (shake on error, green tick on success)
- [ ] Lazy-load student cards (IntersectionObserver)
- [ ] Image optimization for DiceBear SVGs (inline caching)
- [ ] Keyboard navigation audit (Tab order, focus rings)
- [ ] Screen reader `aria-label` pass
- [ ] Toast notification system (success/error/info)
- [ ] Optimistic UI for connection requests
- [ ] Rate limit feedback UI ("Slow down! Try again in X minutes")

---

## Phase 10: Deployment & Submission 📋 PLANNED

**Goal:** Production deployment, final demo prep, and hackathon submission package.

### Planned Deliverables
- [ ] Deploy to Netlify / GitHub Pages (static hosting, zero server)
- [ ] Configure custom domain (optional)
- [ ] GitHub Actions CI: lint check + HTML validation on push
- [ ] Demo video recording (< 3 minutes, covers core loop)
- [ ] Submission write-up (Devpost / hackathon portal)
- [ ] README.md with setup instructions and live demo link
- [ ] Final performance audit (Lighthouse score > 90)
- [ ] Cross-browser test: Chrome, Firefox, Safari Mobile

---

## Milestone Summary

| Phase | Name | Status | Key Output |
|-------|------|--------|-----------|
| 1 | Foundation | ✅ Done | HTML/CSS shell, auth, mock data |
| 2 | Explore | ✅ Done | Student directory + match scores |
| 3 | Connections | ✅ Done | Request system + contact unlock |
| 4 | WhatsApp | ✅ Done | wa.me click-to-chat |
| 5 | Projects | ✅ Done | Project listings + role builder |
| 6 | Dashboard | ✅ Done | Recommendations + stats |
| 7 | Profile | ✅ Done | Edit + completeness meter |
| 8 | Supabase | 🔄 In Progress | Live DB + real auth + Edge Fn |
| 9 | Polish | 📋 Planned | UX + a11y + performance |
| 10 | Deploy | 📋 Planned | Production URL + submission |
