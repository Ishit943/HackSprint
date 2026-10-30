# 🎃 Monster Match: Find Your Project Teammate (PS10)

> A modern web platform where students create skill profiles with verified proficiency, post hackathon requirements, search and filter candidate teammates with precision (AND/OR logic), and connect instantly through in-app requests, verified phone calls, and direct WhatsApp chat.

Built for **Runtime Terror HackSprint 2026** by team **Runtime Terror**.

---

## 📚 Complete Project Documentation Index

| Category | File | Description |
|---|---|---|
| **Core Planning** | [`PRD.md`](PRD.md) | Product Requirements Document & KPIs |
| | [`PROJECT_PLAN.md`](PROJECT_PLAN.md) | 10-phase development roadmap & milestones |
| | [`TECH_STACK.md`](TECH_STACK.md) | Architectural tech choices & engineering rationale |
| | [`ARCHITECTURE.md`](ARCHITECTURE.md) | System blueprints, data models & ER diagrams |
| | [`AGENTS.md`](AGENTS.md) | Multi-agent ecosystem & AI auto-sync rules |
| | [`TASKS.md`](TASKS.md) | Feature checklist & implementation status |
| | [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Halloween Obsidian & Orange UI design guide |
| | [`DECISIONS.md`](DECISIONS.md) | Architecture Decision Records (ADRs) |
| **Hackathon** | [`HACKATHON.md`](HACKATHON.md) | HackSprint 2026 problem, team & criteria |
| | [`FEATURES.md`](FEATURES.md) | Comprehensive feature matrix & roadmap |
| | [`INNOVATION.md`](INNOVATION.md) | Unique selling points & competitive advantages |
| | [`DEMO_GUIDE.md`](DEMO_GUIDE.md) | Step-by-step 8-step judge walkthrough |
| | [`PRESENTATION.md`](PRESENTATION.md) | 3-minute pitch presentation outline & script |
| | [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) | Known bugs, limitations & mitigations |
| | [`FUTURE_SCOPE.md`](FUTURE_SCOPE.md) | Long-term AI roadmap & extensions |
| **Technical Docs** | [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | 17 PostgreSQL tables, RLS policies & indexes |
| | [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) | Complete JavaScript API & helper reference |
| | [`docs/SECURITY.md`](docs/SECURITY.md) | Security policy, XSS escaping & rate limits |
| | [`docs/TESTING.md`](docs/TESTING.md) | Test cases, persona runs & browser support |
| | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel, Netlify & Supabase hosting guide |
| | [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md) | Local development quickstart guide |
| | [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) | End-user navigation & platform manual |
| | [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Common errors & runtime solutions |
| | [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) | Academic domain verification & sessions |
| | [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Detailed functional & non-functional reqs |
| **Project Tracking** | [`work_done.md`](work_done.md) | Chronological delivery & commit summary |
| | [`CHANGELOG.md`](CHANGELOG.md) | Version history & release notes |
| | [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) | Full directory and asset layout |
| | [`SUPPORT.md`](SUPPORT.md) | Mentorship, contact info & bug submission |
| | [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guide & pull request templates |
| | [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Contributor Covenant 2.1 standard |
| | [`LICENSE`](LICENSE) | MIT Open Source License |

---

## 🌟 Key Features

### 1. Student Skill Profiles & Monster Mascots
- **Proficiency Tags**: Beginner, Intermediate, and Advanced skill badges with glowing tier dots.
- **Availability Tracker**: Hours per week and flexible schedule preferences.
- **College Email Verification**: Automated 🎓 verification badge for `.ac.in` and `.edu` emails.
- **Completeness Meter**: Dynamic score meter measuring profile depth across 8 criteria.
- **Privacy By Default**: Phone numbers and WhatsApp links remain strictly hidden until an owner accepts a connection request.

### 2. Precision Search & Multi-Skill Filtering
- Instant live search debounced at 300ms across names, skills, and branches.
- **AND / OR Skill Match Toggle**:
  - `AND` mode: Candidate must possess *all* selected skills.
  - `OR` mode: Candidate possesses *any* selected skill.
- Academic filters: Year of study (1st - 4th Year), Branch, College, and Availability.
- Sorting by **Smart Match %**, Availability, and Alphabetical order.

### 3. Smart Match Algorithm
Computes a compatibility percentage using a 100-point multi-factor score formula:
$$\text{Score} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 70 + (\text{Availability Overlap}) \times 15 + (\text{Interest Overlap}) \times 10 + (\text{Proficiency Bonus}) \times 5$$

### 4. Dynamic Project Requirement Posts
- Create project posts specifying **exact open roles** (e.g. 1 Frontend Dev, 1 ML Engineer) with specific skill requirements and vacancy counters.
- Define team size, submission deadline, and participation mode (Online, Offline, Hybrid).
- One-click "Apply" and "Connect with Lead".

### 5. Instant Connectivity: WhatsApp & Phone Links
- Send structured connection requests with personal notes.
- Tabs for **Received**, **Sent**, and **Accepted** requests.
- **Upon acceptance**, direct communication channels unlock immediately:
  - **WhatsApp**: Triggers `https://wa.me/<number>?text=<encoded_msg>` opening directly in WhatsApp.
  - **Call**: Triggers native `tel:<number>`.
- Serverless Supabase Edge Function (`functions/send-whatsapp`) ready for Meta WhatsApp Cloud API automated notifications.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 | Accessible, semantic layout across all pages |
| **Styling** | CSS3 (Custom Design Tokens, Flexbox, Grid) | Halloween Obsidian & Orange theme, zero framework overhead |
| **Logic** | Vanilla JavaScript (ES6+ Modules) | Modular client-side architecture, instant filtering, state persistence |
| **Database** | Supabase (PostgreSQL 15) | Relational schema, Row-Level Security (RLS), and real-time support |
| **Mock DB** | LocalStorage (`mm_*`) | 100% offline-ready demo mode with 6 seeded personas |
| **Edge Function** | Deno / Node.js | Secure server-side execution for WhatsApp Cloud API |

---

## 🚀 Quick Start Guide

### Run Locally in 30 Seconds (No build step required!)

```powershell
# 1. Clone the repository
git clone https://github.com/Ishit943/HackSprint.git
cd HackSprint

# 2. Start local HTTP server
python -m http.server 3000 --bind 127.0.0.1

# 3. Open in browser
# http://localhost:3000
```

> **Demo Persona Credentials:** Click any of the 6 one-click demo personas on [`pages/login.html`](pages/login.html) to instantly log in as Aarav Sharma, Ananya Verma, Rohan Mehra, Sneha Patel, Kabir Joshi, or Tanvi Saxena.

---

## 🔄 Automatic Documentation Synchronization

To ensure documentation never goes stale, run our audit synchronizer or rely on the pre-commit hook:

```powershell
python scripts/update_docs.py
```
