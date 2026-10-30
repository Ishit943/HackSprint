# 🏛️ Architecture Decision Records (ADRs) - Monster Match

> Chronological log of key architectural and technical decisions made during the design and development of Monster Match for Runtime Terror HackSprint 2026.

---

## Table of Decisions

| ADR # | Title | Status | Date |
|-------|-------|--------|------|
| [ADR-001](#adr-001-vanilla-web-stack-over-heavy-frameworks) | Vanilla Web Stack (HTML5/CSS3/ES6) over Heavy Frameworks | Accepted | 2026-10-30 |
| [ADR-002](#adr-002-dual-state-storage-localstorage-mock-service-layer) | Dual-State Storage (localStorage Mock Service Layer) | Accepted | 2026-10-30 |
| [ADR-003](#adr-003-client-side-whatsapp-click-to-chat-wame-pipeline) | Client-Side WhatsApp Click-to-Chat (`wa.me`) Pipeline | Accepted | 2026-10-30 |
| [ADR-004](#adr-004-dicebear-bottts-for-deterministic-monster-avatars) | DiceBear Bottts for Deterministic Monster Avatars | Accepted | 2026-10-30 |
| [ADR-005](#adr-005-halloween-cyber-obsidian-design-tokens-in-pure-css) | Halloween Cyber-Obsidian Design Tokens in Pure CSS | Accepted | 2026-10-30 |
| [ADR-006](#adr-006-supabase-postgresql-with-row-level-security-rls) | Supabase PostgreSQL with Row Level Security (RLS) | Accepted | 2026-10-30 |
| [ADR-007](#adr-007-academic-domain-validation-for-student-trust) | Academic Domain Validation for Student Trust | Accepted | 2026-10-30 |
| [ADR-008](#adr-008-100-point-deterministic-match-scoring-algorithm) | 100-Point Deterministic Match Scoring Algorithm | Accepted | 2026-10-30 |
| [ADR-009](#adr-009-mandatory-documentation-synchronization-rule) | Mandatory Documentation Synchronization Rule for AI & Devs | Accepted | 2026-10-31 |

---

### ADR-001: Vanilla Web Stack (HTML5/CSS3/ES6) over Heavy Frameworks
- **Context:** Fast turnaround hackathon where build errors, webpack/vite dependency locks, and bundle churn waste critical hacking time.
- **Decision:** Use standard HTML5 pages with native ES6 module imports (`import { ... } from '../js/api.js'`) and custom CSS properties.
- **Consequences:** Zero build step needed, instant page refreshes, runable directly on any standard HTTP server (`python -m http.server`), highly accessible and lightweight.

---

### ADR-002: Dual-State Storage (localStorage Mock Service Layer)
- **Context:** Network failure during demo presentations or unconfigured backend environments could crash live judge walkthroughs.
- **Decision:** Build a unified API service layer (`js/api.js`) that auto-detects Supabase credentials. If missing or offline, it falls back to a deterministic `localStorage` database pre-seeded with 6 rich student personas.
- **Consequences:** 100% offline-ready demo resiliency. Judges can test all flows without database setup.

---

### ADR-003: Client-Side WhatsApp Click-to-Chat (`wa.me`) Pipeline
- **Context:** Automated server-to-phone WhatsApp notifications require Meta Business verification, which takes days.
- **Decision:** Use client-side `https://wa.me/<phone>?text=...` deep-links for immediate Phase 4 connections, coupled with a serverless edge function (`functions/send-whatsapp`) for Cloud API integration when credentials are provided.
- **Consequences:** Zero setup cost, zero verification latency for attendees, immediate messaging unlock on connection approval.

---

### ADR-004: DiceBear Bottts for Deterministic Monster Avatars
- **Context:** Uploading custom photos creates storage overhead, CDN costs, and privacy friction for camera-shy students.
- **Decision:** Use DiceBear's Bottts SVG avatar API parameterized by the student's unique ID seed (`https://api.dicebear.com/7.x/bottts/svg?seed=usr-1`).
- **Consequences:** Guaranteed unique, fun monster avatar for every student without storing image blobs.

---

### ADR-005: Halloween Cyber-Obsidian Design Tokens in Pure CSS
- **Context:** Hackathon theme requires an evocative Halloween visual identity without compromising usability or text contrast.
- **Decision:** Use Obsidian Black (`#0a0a0c`) backgrounds paired with high-contrast Pumpkin Orange (`#ff7300`) and cyan/gray glowing skill tier indicators.
- **Consequences:** Immersive theme, high aesthetic appeal, and WCAG AA contrast compliance.

---

### ADR-006: Supabase PostgreSQL with Row Level Security (RLS)
- **Context:** Student phone numbers and contact details are sensitive and must be protected from scraping.
- **Decision:** Employ Supabase PostgreSQL with strict Row Level Security (RLS) policies. Phone numbers and private contacts are only accessible if an accepted connection request exists between the two users.
- **Consequences:** Privacy guaranteed at the database engine level, preventing client-side data leaks.

---

### ADR-007: Academic Domain Validation for Student Trust
- **Context:** Open hackathon platforms often face spam registrations from unauthorized bots or outside actors.
- **Decision:** Inspect email addresses during signup to verify institutional domains (`.ac.in`, `.edu`, `juet.ac.in`) and award the `🎓 Verified Student` badge.
- **Consequences:** Builds trust among student hackers while preserving an easy demo login option.

---

### ADR-008: 100-Point Deterministic Match Scoring Algorithm
- **Context:** Teammate matching requires transparent, explainable recommendations rather than opaque black-box AI outputs.
- **Decision:** Use a multi-factor formula totaling 100 points:
  - Skill Overlap ($S_{\text{skills}}$): Up to 70 pts
  - Availability ($S_{\text{availability}}$): Up to 15 pts
  - Category Interest ($S_{\text{interest}}$): Up to 10 pts
  - Proficiency Tier Bonus ($S_{\text{proficiency}}$): Up to 5 pts
- **Consequences:** Fast client-side computation, transparent score explanations, and complementary skill discovery.

---

### ADR-009: Mandatory Documentation Synchronization Rule
- **Context:** In rapid iterative development, code evolves faster than documentation, causing READMEs, task checklists, and architecture docs to become stale.
- **Decision:** Establish an automated tracking standard and AI rule requiring all feature additions, schema modifications, and bug fixes to update `work_done.md`, `TASKS.md`, and `CHANGELOG.md` in the same commit.
- **Consequences:** Documentation remains an accurate single source of truth across all development phases.
