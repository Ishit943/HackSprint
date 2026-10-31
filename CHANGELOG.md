# 📜 Monster Match — Changelog

> All notable changes to the Monster Match project are documented here.  
> Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v0.9.5] — 2026-10-31

### Added
- **Full Crazy Halloween Horror Theme (`css/variables.css`, `css/base.css`, `css/components.css`)** — Elevated design tokens to deep crypt obsidian (`#06050a`), blazing pumpkin hellfire (`#ff5500`), vampire crimson blood (`#ff0044`), radioactive ectoplasm slime green (`#00ff66`), and spectral violet (`#a855f7`).
- **Gothic Horror Typography Suite** — Integrated Google Fonts `Creepster`, `Nosifer`, and `Cinzel Decorative` for prominent dripping horror brand titles, display headlines, grimoire banners, and eerie badges.
- **Ambient Cemetery Canvas Particle Engine (`js/horror-theme.js`)** — Added high-performance background canvas rendering floating pumpkin campfire embers, radioactive ectoplasm orbs, glowing ambient eye pairs in darkness, and flying bat silhouettes.
- **Horror Page Entry Lightning Flash & Custom Cursed Scrollbar** — Dynamic subtle lightning aura on page transitions and custom blood-orange glowing scrollbars.
- **Pure Web Audio API Haunted Sound Synthesizer** — Autonomous zero-dependency audio synthesizer generating real-time spectral theremin hover glides, crypt coffin clicks, witch sparkle spells, and dungeon booms.
- **Interactive Haunted Audio Controller (`#haunted-audio-toggle`)** — Added persistent audio switch in the navbar with state saved in `localStorage`, accompanied by contextual toast feedback.
- **Interactive Mouse Ember Particle Trail** — Dynamic particle trail spawning glowing sparks along cursor movements.
- **Interactive "🎃 Summon Spook" Easter Egg** — Floating quick-action badge that unleashes a flying hackathon spectre across the viewport with whimsical developer blessings and quotes.
- **Dripping Slime/Blood Accent Line** — Injected dripping SVG accent directly below the navigation bar across all views.
- **Haunted Grimoire Card Design (`.grimoire-card`)** — Enhanced card surfaces with corner spiderweb flourishes (`🕸️`), levitating lift animations, and dual pumpkin/ectoplasm aura glows across explore, projects, dashboard, and profile views.
- **Halloween Narrative Polish Across All Pages** — Overhauled hero copy, feature cards, grimoire forms, and headers across `index.html`, `pages/explore.html`, `pages/projects.html`, `pages/project-new.html`, `pages/connections.html`, `pages/dashboard.html`, `pages/login.html`, `pages/signup.html`, `pages/profile-view.html`, and `pages/profile-edit.html`.

---

## [v0.9.4] — 2026-10-31

### Added
- **Profile Picture & Mascot Customizer (`pages/profile-edit.html`)** — Added full avatar personalization suite: interactive live preview, 7 one-click Bottts monster mascot presets (Yellow Love Bot, Sparky Purple, Goggles Blue, Orange Hopper, Cyan Antenna, Cyber Mech, Spooky Monster), a "Roll Random Monster" button, custom image URL input, and native photo file upload with base64 data conversion.
- **Direct Avatar Change Shortcuts** — Added camera button shortcuts on `pages/dashboard.html` and `pages/profile-view.html` linking directly to the avatar customizer.
- **Smart Match Threshold Safeguard (`js/utils.js`, `pages/explore.html`)** — Requires user login or active filter skills before displaying a match percentage, avoiding misleading arbitrary scores for unauthenticated visitors.
- **Email in Contact Details** — College email address now shown wherever contact info is unlocked: `pages/profile-view.html` (contact card with `mailto:` link + ✉️ Email button), `pages/connections.html` (accepted connections tab), `pages/explore.html` (connected student cards), `pages/dashboard.html` (user's own profile card), `pages/profile-edit.html` (read-only email field in Academic Info).
- **Privacy-respecting email visibility** — Email only shown for self-view or after a connection is mutually accepted (same rule as phone/WhatsApp).

---

## [v0.9.3] — 2026-10-31

### Added
- **Hackathon Teammate Privacy Shield** — Automatically hides students who have already formed a team for a hackathon (`status: 'teamed'`) from public view on `pages/explore.html`, preventing unsolicited contacts and team poaching.
- **1-Click "Confirm Hackathon Team" Action (`pages/connections.html`)** — Allows connected students to officially confirm their hackathon team for a specific event (e.g., Runtime Terror HackSprint 2026). Both profiles are automatically locked and shielded from public Explore.
- **Direct Profile Protection Banner (`pages/profile-view.html`)** — Displays a `🔒 Hackathon Team Formed` warning and disables direct connection buttons when visitors view an already-committed student.
- **Team Management Methods (`js/api.js`)** — Added `API.formTeam()` and `API.leaveTeam()` to handle persistent team formation, notifications, and profile status syncing.
- **Pre-seeded Teammates** — Configured Sneha Patel (`usr-4`) and Tanvi Saxena (`usr-6`) as a formed team for Runtime Terror HackSprint 2026 to demonstrate privacy protection out-of-the-box.
- **Project Delete Button & Ownership Management (`pages/projects.html`)** — Added dedicated `🗑️ Delete` button on project cards for owners, with confirmation safeguard and instant reactive list removal. Added `API.deleteProject(projectId)` with ownership authorization checks and `👤 My Projects Only` filter category.

---

## [v0.9.2] — 2026-10-31

### Changed
- **Redesigned Project Creation Form (`pages/project-new.html`)** — Removed confusing legacy fields (submission deadlines, mode dropdowns, team size counters, dynamic role slot builders). Streamlined to standard developer showcase fields: **Project Title**, **Description**, **GitHub Repo Link**, **Tech Stack**, and optional Live Demo URL.
- **Enhanced Project Cards (`pages/projects.html`)** — Direct `📂 View Code ↗` GitHub buttons, Live Demo links, tech stack pills, and `Find Matches ⚡` button that immediately pre-selects skills on the Explore page.

---

## [v0.9.1] — 2026-10-31

### Fixed
- **Static Compatibility Scores** — Compatibility previously evaluated against a hardcoded `['React', 'Node.js', 'Python']` array regardless of search filters or logged-in user. Replaced with dynamic `calculateTeammateCompatibility` in `js/utils.js`.
- **Self-Match Bug** — Logged-in user previously saw a random compatibility percentage against themselves; now renders `👾 You` badge.

### Added
- **Dynamic Search Relevance Scoring** — Filtering by skills on the Explore page dynamically scores candidates based on their match to selected tags and proficiency tiers.
- **Teammate Synergy Algorithm** — Calculates complementary skill gaps, collaboration stack alignment, shared hackathon track interests, and availability overlap.
- **Explainable Match Reasons** — Explanatory tooltips and tags on student cards (e.g., *"Matches 2 of 2 filtered skills"*, *"Complementary: adds design uiux"*).
- **Profile View Compatibility Widget** — Displays personalized compatibility breakdown when inspecting candidate profiles in `pages/profile-view.html`.

---

## [v0.9.0] — 2026-10-30 *(Current)*

### Added
- `HACKATHON.md` — Event details, judging criteria, team info, and timeline
- `FEATURES.md` — Complete implemented and planned feature documentation
- `INNOVATION.md` — USPs, innovation rationale, and competitive differentiation
- `DEMO_GUIDE.md` — Step-by-step 8-step judge demo walkthrough with fallback tips
- `KNOWN_ISSUES.md` — Transparent issue tracker with severity ratings and workarounds
- `CHANGELOG.md` — This version history document
- `AGENTS.md` — Full multi-agent architecture specification (Matchmaker, Profile Optimizer, WhatsApp Dispatcher, Safety & Trust)

### Changed
- Professional documentation structure established across all project files
- README updated to reflect v0.9.0 status and documentation index

---

## [v0.8.0] — 2026-10-29

### Fixed
- **Logout auth loop** — Clicking logout redirected back to dashboard instead of landing page due to a stale `sessionStorage` check order; corrected guard logic in `auth.js`
- **Skill pill UX** — Duplicate skill tags could be added; added deduplication check before appending pill to DOM and data array
- **Match score badge overflow** — Scores > 99 rendered outside the badge boundary on narrow cards; clamped display to max 2 digits with a `99+` overflow label
- **Mobile nav menu** — Hamburger toggle didn't close on outside click; added `document.addEventListener('click')` blur handler

### Added
- **2 new seed personas:**
  - **Karan Mehta** — Mobile Developer (Flutter, Dart, Firebase, Android)
  - **Sneha Patel** — Data Scientist (Python, Pandas, NumPy, Tableau, SQL)
- Total demo personas increased from 4 to **6**
- Avatar fallback initials bubble with colour derived from user ID hash

### Changed
- Match score badge colour now transitions: green (≥ 75), amber (50–74), red (< 50)
- Skill proficiency tooltip updated to show points contribution breakdown

---

## [v0.7.0] — 2026-10-28

### Added
- **Supabase database schema** (`database/schema.sql`):
  - 17 tables: `profiles`, `skills`, `student_skills`, `projects`, `project_roles`, `role_skills`, `connection_requests`, `connections`, `interest_tags`, `student_interests`, `project_interests`, `availability_slots`, `notifications`, `audit_log`, `domains_whitelist`, `whatsapp_queue`, `session_tokens`
  - Row-Level Security (RLS) policies on all user-facing tables
  - PostgreSQL triggers: `on_connection_accepted` → unlocks contact data; `on_profile_updated` → recalculates completeness score
- **Supabase seed data** (`database/seed.sql`):
  - 6 student profiles with full skill vectors, availability, and bios
  - 2 sample projects (MedBot AI, EcoTrack)
  - Pre-seeded connection states for demo reproducibility
- **WhatsApp Cloud API Edge Function** (`functions/send-whatsapp/index.ts`):
  - Triggered on `connection_requests.status = 'accepted'` webhook
  - Calls Meta Graph API `POST /v18.0/{phone-number-id}/messages`
  - Sends `connection_request_alert` and `request_accepted` templates
  - Environment secrets: `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`
- **Database adapter layer** (`js/db.js`):
  - Routes all data operations to Supabase or localStorage mock based on config availability
  - Zero code-change switching between modes

### Changed
- `config.js` updated to auto-detect missing Supabase credentials and set `MOCK_MODE = true`
- All data-fetching calls migrated from direct `localStorage` access to `db.js` adapter

---

## [v0.6.0] — 2026-10-27

### Added
- **Profile Completeness Meter** (`js/completeness.js`):
  - 8 weighted fields (Full Name 15%, Avatar 10%, College 10%, Branch/Year 10%, Bio 15%, Contact 15%, Skills×3 15%, Portfolio 10%)
  - Animated progress bar with Halloween gradient
  - Inline prompt badges for next improvement action
- **Monster Avatar System** (`js/avatar.js`):
  - DiceBear Bottts integration with deterministic user-ID seed
  - `<img>` `onerror` fallback to initials bubble
  - Avatar visible on: nav bar, profile page, student cards, connection cards
- **4 initial seed personas** (Aarav Sharma, Ananya Verma, Rohan Gupta, Priya Singh)
- **One-click demo persona login** on login page — persona cards replace traditional form by default

### Changed
- Login page redesigned: persona cards grid as primary login method, traditional email/password form collapsed under "Sign in with email" toggle

---

## [v0.5.0] — 2026-10-26

### Added
- **Projects Directory** (`pages/projects.html`, `js/projects.js`):
  - Project card grid with domain tags, team size, and timeline
  - Project detail modal with full description
- **Project Creation Form** (`pages/create-project.html`):
  - Dynamic role builder: add/remove role slots with title, slot count, and required skills
  - Form validation with Halloween-styled error states
- **Role Slot Management**:
  - Slot vacancy counter per role
  - Visual "filled" state when all slots are taken
  - "Request to Join" button maps to a connection request to the team lead

### Changed
- Navigation updated with Projects link
- Dashboard "Your Projects" widget now pulls from projects data

---

## [v0.4.0] — 2026-10-25

### Added
- **Connection Request System** (`js/connections.js`):
  - "Connect 🎃" button on every student card
  - Modal with optional personalised note input
  - Request states: `pending` → `accepted` | `declined`
  - Connections inbox with Pending / Connected / Declined tabs
- **Privacy-Gated Contact Unlock**:
  - WhatsApp and phone fields excluded from all public query responses
  - Contact data rendered only when a connection record with `status = 'accepted'` exists for both parties
  - Enforced in `db.js` query filters
- **WhatsApp Click-to-Chat (`wa.me`)** (`js/whatsapp.js`):
  - Phone number sanitiser (strips non-digits, validates length)
  - Context-aware pre-filled message URL builder
  - "Chat on WhatsApp 💬" button with pumpkin orange glow style
  - Opens in new tab on desktop, WhatsApp app on mobile

### Changed
- Student cards no longer show phone or WhatsApp fields in any state
- "Send Message" placeholder button replaced by full connection request flow

---

## [v0.3.0] — 2026-10-24

### Added
- **Smart Match Algorithm** (`js/match.js`):
  - 100-point scoring: Skill Overlap (70), Availability (15), Interest (10), Proficiency Bonus (5)
  - Score computed per student pair on Explore page load
  - Complementary skill-gap analysis: detects what the current team is missing and weights scores accordingly
- **Skill Filters** (`js/filters.js`):
  - Tag-pill UI for adding skill filter terms
  - AND/OR toggle with reactive card filtering
  - Availability range slider (hours per week)
  - Interest domain checkbox group
- **Match Score Badge** on student cards:
  - Colour-coded: green / amber / red thresholds
  - Tooltip showing score breakdown on hover

### Changed
- Explore page (`pages/explore.html`) rebuilt around card grid with filter sidebar
- Student cards redesigned with skill pill row and match badge

---

## [v0.2.0] — 2026-10-23

### Added
- **Core Application Pages:**
  - `pages/explore.html` — Student discovery
  - `pages/connections.html` — Inbox and connected contacts
  - `pages/projects.html` — Project directory (stub)
  - `pages/dashboard.html` — Personal overview
  - `pages/profile.html` — Public profile view
  - `pages/profile-edit.html` — Profile edit form
- **Navigation bar** with active-state highlighting
- **CSS component library** (`css/components.css`):
  - Card, badge, button, modal, form, progress bar, pill components
  - All styled in Halloween dark theme
- **Auth guard** (`js/auth.js`): Redirects unauthenticated users to login

### Changed
- `index.html` hero section completed with student card preview strip

---

## [v0.1.0] — 2026-10-22 *(Initial Commit)*

### Added
- Project repository initialised
- **HTML scaffold:** `index.html` (landing), `pages/login.html`, `pages/signup.html`
- **CSS Halloween theme** (`css/theme.css`):
  - CSS custom properties: `--color-bg: #0a0a0c`, `--color-accent: #ff7300`
  - Base typography, reset, and dark-mode body styles
  - Pumpkin orange gradient buttons with hover glow
- **JavaScript modules bootstrap** (`js/app.js`, `js/config.js`)
- **`README.md`** with project overview and setup instructions
- **`.gitignore`** for Node.js, Python, and editor artifacts

---

> [!NOTE]
> Version numbers follow semantic versioning informally — `v0.x.0` denotes sprint-level milestone releases during the 24-hour hackathon. A `v1.0.0` release will mark the first post-hackathon production-ready deployment.
