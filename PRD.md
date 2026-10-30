# 🎃 Monster Match — Product Requirements Document (PRD)

> **Project:** Monster Match — Find Your Hackathon Teammate  
> **Event:** Runtime Terror HackSprint 2026  
> **Team:** Runtime Terror  
> **Version:** 1.0  
> **Last Updated:** 2026-10-30

---

## 1. Executive Summary

Monster Match is a Halloween-themed web application that solves the most critical pain point at every college hackathon: **finding the right teammates**. Students create skill-rich profiles, browse a live directory of fellow participants, and connect with complementary teammates using an intelligent match scoring algorithm. WhatsApp contact details are gated behind mutual connection acceptance, ensuring privacy and encouraging genuine outreach.

Built entirely with pure HTML5, CSS3, and ES6 modules — no framework, no build step — Monster Match is optimized for rapid hackathon development and zero-dependency deployment. The Supabase backend provides a production-grade PostgreSQL database, real-time capabilities, Row Level Security (RLS), and serverless edge functions.

---

## 2. Problem Statement

### The Hackathon Teammate Crisis

At every college hackathon — including JUET's Runtime Terror HackSprint — students arrive alone or in incomplete teams and face the same chaotic scenario:

- Announcements in group chats drown in noise: *"Backend dev looking for frontend partner"*
- Skills are self-described vaguely: *"I know some React"* vs *"React Advanced"*
- Time is wasted meeting incompatible teammates
- Introverted students lose out to louder, more networked peers
- Project ideas die because critical roles (e.g., ML, Design) go unfilled

**The result:** Teams are formed on social proximity, not skill complementarity, leading to unbalanced projects and missed potential.

### The Gap in Existing Solutions

| Tool | Limitation |
|------|-----------|
| WhatsApp groups | No structured skill discovery; noise-heavy |
| LinkedIn | Not tailored for short-term hackathon pairing |
| Devpost teams | Not popular in Indian college circuits |
| Discord servers | Requires manual scanning; no match scoring |

Monster Match fills this gap with a purpose-built, event-scoped teammate discovery platform.

---

## 3. Target Users

### Primary Users

| Persona | Description |
|---------|-------------|
| **Solo Hacker** | Arrives at the hackathon without a team; wants to find 2–3 complementary teammates in under 10 minutes |
| **Team Lead** | Has a project idea and specific role requirements; wants to recruit missing skill sets |
| **Specialist** | Has deep expertise in one domain (ML, UI/UX, Blockchain); wants to find generalists or project leads |
| **First-Timer** | Attending their first hackathon; intimidated; needs a low-friction way to get discovered |

### Target Institutions
- **Primary:** JUET (Jaypee University of Engineering and Technology), Guna, M.P.
- **Secondary:** All engineering colleges participating in Runtime Terror HackSprint 2026
- **Future:** Any college with an `.ac.in` or `.edu` verified email domain

### User Demographics
- Age: 18–24
- Devices: Mobile-first (Android), secondary Desktop (Chrome/Edge)
- Tech comfort: Intermediate; comfortable with WhatsApp, GitHub, Instagram
- Session duration: Short bursts (2–5 min) during the hackathon event

---

## 4. Core Features

### 4.1 Skill-Based Student Profiles

Each student profile contains:
- **Identity:** Full name, branch, year, college, profile bio
- **Skills:** Up to 15 technical skills, each tagged with proficiency level (`beginner` / `intermediate` / `advanced`)
- **Availability:** Weekly commitment hours (e.g., 20 hrs/week during hackathon)
- **Interests:** Domain tags from a curated list — AI/ML, Web Development, Blockchain/Web3, Fintech, IoT, Cybersecurity, Open Source, Game Development
- **Portfolio:** GitHub URL, LinkedIn URL, personal website
- **Contact:** Phone / WhatsApp number (private; unlocked on mutual connection only)
- **Monster Mascot:** Auto-generated DiceBear Bottts avatar seeded from user ID

### 4.2 Match Scoring Algorithm

The compatibility score is a **100-point system** computed as:

$$\text{Match Score} = S_{\text{skills}} + S_{\text{availability}} + S_{\text{interest}} + S_{\text{proficiency}}$$

| Component | Max Points | Calculation |
|-----------|-----------|-------------|
| **Skill Overlap** ($S_{\text{skills}}$) | 70 | `(matched skills / required skills) × 70` |
| **Availability Overlap** ($S_{\text{availability}}$) | 15 | `min(student_hrs, project_hrs) / max(student_hrs, project_hrs) × 15` |
| **Interest Overlap** ($S_{\text{interest}}$) | 10 | `(shared interests / total interests) × 10` |
| **Proficiency Bonus** ($S_{\text{proficiency}}$) | 5 | `+5 if any matched skill is 'advanced'` |

**Score Tiers:**
- 🟢 **85–100:** Excellent Match
- 🟡 **60–84:** Good Match
- 🟠 **35–59:** Partial Match
- 🔴 **0–34:** Low Match

### 4.3 Explore & Filter Page

- Full student directory with card grid layout
- Multi-skill filter with AND/OR logic toggling
- Filter by: domain interests, availability range, branch, year
- Sort by: match score, name, newest profile
- Real-time client-side filtering (no server round-trip)
- Each card shows: name, branch, year, top 3 skills, match score badge, monster mascot

### 4.4 Connection Request System

- Send a connection request with an optional personalized note (max 300 chars)
- Receiver gets a pending request with the note
- Actions: Accept / Reject
- On **Accept:** both parties' WhatsApp and phone numbers are mutually unlocked
- Rate limiting: max 10 outgoing requests per hour (Agent-Trust enforcement)
- Notes are XSS-sanitized before storage (Agent-Trust enforcement)

### 4.5 WhatsApp Integration

- **Phase 4 (Live):** `wa.me` click-to-chat link with pre-filled contextual message
  - Format: `https://wa.me/<E.164_phone>?text=Hi%20{name}%2C%20I%20saw%20your%20profile%20on%20Monster%20Match...`
  - Works instantly; zero Meta approval needed
- **Phase 8 (Planned):** Meta WhatsApp Cloud API via Supabase Edge Function
  - Triggered on `connection_requests.status = 'accepted'`
  - Sends `connection_request_alert` template to both parties

### 4.6 Projects Directory

- Browse open projects with role requirements and technology stack
- Each project lists: title, description, domain, tech stack, open roles, team lead
- **Role Builder:** Dynamic form to define multiple roles with required skills per role
- Students can express interest in a project slot
- Team lead receives interest notifications
- Project status: Open / In Progress / Closed

### 4.7 Profile Completeness Meter (Agent-Profile)

The profile strength score is a **weighted completeness percentage**:

| Field | Weight |
|-------|--------|
| Full Name | 15% |
| Profile Avatar / Monster Mascot | 10% |
| College & Academic Info | 10% |
| Branch & Year | 10% |
| Detailed Bio (> 20 characters) | 15% |
| Contact Details (Phone / WhatsApp) | 15% |
| Minimum 3 Technical Skills with Proficiency | 15% |
| Portfolio / GitHub Links | 10% |

- Rendered as an animated progress bar in the profile edit page
- Inline prompt badges nudge users: *"Add 2 more skills to reach 100% profile strength!"*

### 4.8 Smart Dashboard

- Personalized match recommendations ranked by score
- "Your Team Gap" analysis: skills your current project is missing
- Pending connection requests (incoming & outgoing)
- Quick stats: profile views, connections made, match quality

---

## 5. Non-Functional Requirements

### 5.1 Zero Build Tools
- No Webpack, Vite, Parcel, or transpiler
- Served directly by `python -m http.server 3000 --bind 127.0.0.1`
- ES6 modules loaded natively via `<script type="module">`
- No `node_modules`; all dependencies via CDN or vendored

### 5.2 Offline / Mock Mode
- All features functional with `localStorage` mock data (no Supabase required)
- 6 seed student personas pre-loaded for demo scenarios
- Toggle between mock and live mode via a single config flag in `js/config.js`

### 5.3 Mobile Responsiveness
- Mobile-first CSS; breakpoints at 480px, 768px, 1024px
- Touch-friendly tap targets (min 44px)
- WhatsApp button opens native app on mobile via `wa.me` URL scheme

### 5.4 Halloween Dark Theme
- Obsidian black background: `#0a0a0c`
- Pumpkin orange accent: `#ff7300`
- High contrast text: `#e8e8f0`
- Subtle orange glow animations on interactive elements
- Consistent across all pages via CSS custom properties

### 5.5 Performance
- Target: **< 2 seconds** Time to Interactive on 4G
- No JS framework bundle overhead
- Images: DiceBear SVG (inline/CDN, no upload)
- CSS: single bundled stylesheet with custom properties

### 5.6 Security
- College email domain gating (`.ac.in`, `.edu`)
- Phone/WhatsApp never exposed in public API responses (RLS enforced)
- XSS sanitization on all user-generated content
- CSRF protection via Supabase anon key scoping

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Profile completeness rate | > 80% of users reach 80%+ completeness |
| Time to first connection | < 5 minutes from signup |
| Connections per user per hackathon | > 5 accepted connections |
| Page load time (TTI) | < 2 seconds |
| Match score accuracy (user satisfaction survey) | > 70% find matches "relevant" |
| WhatsApp conversion rate | > 60% of unlocked contacts result in a wa.me click |
| Session engagement | > 3 pages visited per session |

---

## 7. Out of Scope (v1.0)

- Real-time chat within the app (deferred to Phase 8+)
- AI resume parsing (planned as future Agent extension)
- Push notifications / PWA service worker (planned Phase 9)
- Cross-event persistence (each hackathon is a fresh event instance)
- Payment or premium tiers
