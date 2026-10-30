# Contributing to Monster Match 🎯

Thank you for your interest in contributing to **Monster Match** — the "Find Your Project Teammate" web app built for **Runtime Terror HackSprint 2026**! We welcome all contributions, from bug fixes to new features.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Coding Conventions](#coding-conventions)
- [Adding a New Page](#adding-a-new-page)
- [Adding a New Skill](#adding-a-new-skill)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)

---

## 🚀 Getting Started

### Prerequisites

- A modern browser (Chrome recommended for testing)
- Python 3.x (for the local dev server)
- A Supabase account (for full backend features)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/monster-match.git
   cd monster-match
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` (if applicable) and fill in your Supabase credentials.
   - The project uses `js/config.js` for Supabase URL and anon key — never commit the service role key.

3. **Start the local dev server:**
   ```bash
   python -m http.server 3000 --bind 127.0.0.1
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

   > **Note:** Always use the Python server rather than opening HTML files directly with `file://` — ES6 modules require an HTTP context to load correctly.

---

## 📁 File Structure

```
monster-match/
├── index.html              # Landing page / entry point
├── css/
│   ├── variables.css       # CSS custom properties (colors, spacing, fonts)
│   ├── global.css          # Reset, base typography, layout utilities
│   ├── components.css      # Reusable UI components (cards, badges, buttons)
│   └── animations.css      # Transition and animation definitions
├── js/
│   ├── auth.js             # Supabase Auth helpers (signUp, signIn, signOut, session)
│   ├── api.js              # All Supabase DB calls + INITIAL_STUDENTS mock data
│   ├── utils.js            # Shared utilities: sanitizeText(), formatPhone(), etc.
│   ├── config.js           # Supabase client initialization (URL + anon key only)
│   └── router.js           # Client-side SPA routing (if applicable)
├── pages/
│   ├── login.html          # Authentication page
│   ├── register.html       # New user registration
│   ├── dashboard.html      # Logged-in user home
│   ├── profile.html        # Profile setup / edit
│   ├── explore.html        # Browse and search students
│   ├── projects.html       # Browse and post projects
│   └── connections.html    # Pending/accepted connections
├── sql/
│   ├── schema.sql          # Full Supabase schema (tables, RLS policies)
│   ├── triggers.sql        # DB triggers (rate limiting, status updates)
│   └── seed.sql            # Optional seed data for local testing
├── functions/
│   └── send-whatsapp/
│       └── index.ts        # Supabase Edge Function for WhatsApp Cloud API
└── .github/
    └── workflows/
        └── ci.yml          # GitHub Actions CI pipeline
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `css/` | All styles — use CSS custom properties from `variables.css`, never hardcode colors |
| `js/` | All JavaScript — ES6 modules only, no build tools |
| `pages/` | Individual HTML pages that import from `../js/` |
| `sql/` | Supabase SQL scripts — run these in the Supabase SQL editor |
| `functions/` | Supabase Edge Functions (Deno/TypeScript) |

---

## 🎨 Coding Conventions

### General Rules

- **No build tools** — no Webpack, Vite, Babel, or npm build steps. Everything runs directly in the browser.
- **Vanilla ES6 modules** — use `import`/`export` syntax. Each file is a module.
- **CSS custom properties** — all colors, spacing, border-radius, and font sizes must reference variables defined in `css/variables.css`. Never hardcode `#fff` or `16px` directly in component styles.
- **No external JS libraries** — exception: Supabase client (loaded from CDN) and DiceBear (avatar generation).
- **Progressive enhancement** — core content should be accessible even if JS fails.

### JavaScript Conventions

- Import Supabase client from `../js/config.js` (not from CDN directly in page scripts).
- All database operations go through `js/api.js` — never write raw Supabase queries in page scripts.
- All user-generated text must be passed through `sanitizeText()` from `js/utils.js` before rendering to the DOM.
- Use `async/await` for all asynchronous operations; handle errors with `try/catch`.

### CSS Conventions

- Use CSS custom properties for theming: `var(--color-primary)`, `var(--spacing-md)`, etc.
- Mobile-first responsive design: base styles for mobile, `@media (min-width: 768px)` for desktop.
- BEM-lite naming: `.card`, `.card__title`, `.card--featured`.

---

## 📄 Adding a New Page

1. **Create your HTML file** in `pages/`:
   ```bash
   touch pages/yourpage.html
   ```

2. **Use this boilerplate:**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Your Page — Monster Match</title>
     <link rel="stylesheet" href="../css/variables.css" />
     <link rel="stylesheet" href="../css/global.css" />
     <link rel="stylesheet" href="../css/components.css" />
   </head>
   <body>
     <!-- Page content here -->

     <script type="module">
       import { requireAuth } from '../js/auth.js';
       import { someApiFunction } from '../js/api.js';
       import { sanitizeText } from '../js/utils.js';

       // Redirect unauthenticated users
       await requireAuth();

       // Your page logic here
     </script>
   </body>
   </html>
   ```

3. **Always import from `../js/auth.js` and `../js/api.js`** — never duplicate auth logic.

4. **Call `requireAuth()`** at the top of protected page scripts to redirect unauthenticated users to `pages/login.html`.

5. **Add a link** to your page in the relevant navigation component.

---

## 🛠️ Adding a New Skill

Skills (technical skills that students can select) are centrally defined in `js/api.js`.

1. Open `js/api.js`.
2. Locate the `AVAILABLE_SKILLS` array (or `INITIAL_STUDENTS` mock data if working in localStorage mock mode).
3. Add your new skill entry:
   ```js
   export const AVAILABLE_SKILLS = [
     // existing skills...
     { name: 'Your New Skill', category: 'Frontend' }, // or Backend, Design, etc.
   ];
   ```
4. If you're adding a skill that maps to a project role, also update the `PROJECT_ROLES` constant in the same file.
5. Test that the skill appears in the profile setup page (`pages/profile.html`) and filters correctly on the explore page (`pages/explore.html`).

---

## 🔀 Pull Request Process

### Branch Naming

Use the following prefixes:

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature or page (e.g., `feat/voice-pitch-agent`) |
| `fix/` | Bug fix (e.g., `fix/mobile-nav-overflow`) |
| `docs/` | Documentation only (e.g., `docs/update-readme`) |
| `style/` | CSS/UI-only changes with no logic change |
| `refactor/` | Code refactoring with no feature change |
| `chore/` | Build, CI, or tooling changes |

### PR Description Template

When opening a pull request, include:

```markdown
## Summary
Brief description of what this PR does.

## Changes
- [ ] List of changes made
- [ ] Any new files added

## Testing
- How did you test this?
- Which browser(s) did you test in?
- Any edge cases to watch out for?

## Screenshots (if UI changes)
<!-- Attach before/after screenshots -->

## Checklist
- [ ] I tested with `python -m http.server 3000 --bind 127.0.0.1`
- [ ] No hardcoded secrets or API keys in any files
- [ ] CSS uses variables from `css/variables.css`
- [ ] All user inputs are sanitized via `sanitizeText()`
- [ ] No `.env` files or service role keys committed
```

### Review Process

1. At least one team member must review and approve before merging.
2. CI checks must pass (HTML validation, no secrets check, file structure verification).
3. Squash merge into `main` with a descriptive commit message.

---

## ✏️ Code Style

| Rule | Standard |
|------|----------|
| Indentation | **2 spaces** (no tabs) |
| Quotes in JS | **Single quotes** `'like this'` |
| CSS class naming | **kebab-case** `.profile-card`, `.skill-badge` |
| JS variable naming | **camelCase** `studentProfile`, `matchScore` |
| JS constant naming | **SCREAMING_SNAKE_CASE** `SUPABASE_URL`, `MAX_SKILLS` |
| File naming | **kebab-case** `profile-setup.html`, `api-helpers.js` |
| HTML attributes | **double quotes** `class="card"` |
| Trailing commas | **yes** in multi-line JS arrays/objects |
| Semicolons | **yes** at end of JS statements |

> **Tip:** Install the [EditorConfig](https://editorconfig.org/) plugin for your editor — the `.editorconfig` at the project root enforces spaces, LF line endings, and UTF-8 charset automatically.

---

## 🧪 Testing

Since Monster Match uses no build tools or test frameworks, testing is manual:

### Basic Test Flow

1. Start the dev server:
   ```bash
   python -m http.server 3000 --bind 127.0.0.1
   ```

2. Open **Google Chrome** at `http://localhost:3000`.

3. Test the following flows:
   - **Auth:** Register a new user → verify email → log in → log out.
   - **Profile:** Complete profile setup with all fields → check completeness meter reaches 100%.
   - **Explore:** Browse student cards → apply skill filter → send a connection request.
   - **Connections:** Accept a connection → verify WhatsApp click-to-chat link appears.
   - **Projects:** Post a new project → view project card → send connection from project view.

4. Open **DevTools (F12)** → Console: ensure no JS errors appear during any flow.

5. Test **mobile view**: use DevTools device emulation (iPhone 12 / 390px width) for all critical pages.

### Mock Mode Testing

If you don't have a Supabase instance configured, the app falls back to `localStorage` mock mode (controlled by a flag in `js/config.js`). This lets you test UI and flow without a live backend.

---

## 💬 Questions?

Open an issue or reach out to the team lead: **goyalishit1@gmail.com**

Happy hacking! 🚀
