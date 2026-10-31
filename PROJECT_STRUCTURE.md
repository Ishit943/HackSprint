# 📁 Monster Match: Project Directory & Architecture Map

> Comprehensive overview of folder organization, key modules, stylesheets, documentation, and configuration files.

---

## Root Directory Structure

```
HackSprint/
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI test and secret scanner
│
├── css/
│   ├── base.css                 # Reset, typography, toasts, dark scrollbars
│   ├── components.css           # Cards, modals, buttons, skill-pills, badges
│   └── variables.css            # Halloween Cyber-Obsidian theme tokens
│
├── docs/                        # Complete technical documentation suite
│   ├── API_DOCUMENTATION.md     # JavaScript service layer functions
│   ├── ARCHITECTURE.md          # Redirect / mirror to root architecture
│   ├── AUTHENTICATION.md        # Academic email verification & sessions
│   ├── CONTRIBUTING.md          # Contributor guidance mirror
│   ├── DATABASE_SCHEMA.md       # PostgreSQL schema, ER diagrams & RLS
│   ├── DEPLOYMENT.md            # Vercel, Netlify, and Supabase deploy
│   ├── REQUIREMENTS.md          # FR and NFR specifications
│   ├── SECURITY.md              # RLS, sanitization & privacy controls
│   ├── SETUP_GUIDE.md           # Local setup instructions
│   ├── TESTING.md               # Manual test matrix & verification
│   ├── TROUBLESHOOTING.md       # Known issues & runtime resolutions
│   └── USER_GUIDE.md            # End-user & judge walkthrough
│
├── functions/
│   └── send-whatsapp/
│       └── index.js             # Meta WhatsApp Cloud API Edge Function
│
├── js/
│   ├── api.js                   # Unified data service + 6 seed personas
│   ├── auth.js                  # Session state, login, and email validator
│   ├── config.js                # Supabase configuration & mock switcher
│   ├── horror-theme.js          # Ambient cemetery canvas, Web Audio synth & cursor trails
│   └── utils.js                 # 100-pt match formula, XSS escape, URLs
│
├── pages/
│   ├── connections.html         # Connection requests & WhatsApp unlock
│   ├── dashboard.html           # Match recommendations & notifications
│   ├── explore.html             # Multi-skill search with AND/OR filter
│   ├── login.html               # Persona login with 6 demo buttons
│   ├── profile-edit.html        # Skill proficiency editor
│   ├── profile-view.html        # Privacy-gated student card
│   ├── project-new.html         # Project creator & dynamic role builder
│   ├── projects.html            # Hackathon project directory
│   └── signup.html              # College email signup
│
├── scripts/
│   └── update_docs.py           # Automated doc synchronization tool
│
├── sql/
│   └── schema.sql               # 17 PostgreSQL tables, triggers & RLS
│
├── .editorconfig                # Coding formatting standard
├── .env.example                 # Environment variable templates
├── .gitignore                   # Git exclusion list
├── AGENTS.md                    # Agentic AI ecosystem & auto-sync rules
├── ARCHITECTURE.md              # System architecture & component blueprints
├── CHANGELOG.md                 # Project version history
├── CODE_OF_CONDUCT.md           # Contributor Covenant 2.1
├── CONTRIBUTING.md               # Contributor guide & PR workflow
├── DECISIONS.md                 # Architecture Decision Records (ADRs)
├── DEMO_GUIDE.md                # 8-step walkthrough for judges
├── DESIGN_SYSTEM.md             # UI colors, typography & components
├── FEATURES.md                  # Implemented vs planned feature matrix
├── FUTURE_SCOPE.md              # Long-term vision & AI agents
├── HACKATHON.md                 # HackSprint 2026 problem & team info
├── index.html                   # Monster Match landing page
├── INNOVATION.md                # Unique selling points & edge
├── KNOWN_ISSUES.md              # Limitations & workarounds
├── LICENSE                      # MIT Open Source License
├── manifest.json                # PWA web manifest metadata
├── PRD.md                       # Product Requirements Document
├── PRESENTATION.md              # 3-minute pitch presentation outline
├── PROJECT_PLAN.md              # Development phases & milestones
├── README.md                    # Main project overview & quickstart
├── robots.txt                   # Web crawler instructions
├── sitemap.xml                  # SEO site map
├── SUPPORT.md                   # Support and contact information
├── TASKS.md                     # Feature checklist & implementation status
├── TECH_STACK.md                # Technology choices & rationale
└── work_done.md                 # Chronological log of completed tasks
```
