# 🎨 Monster Match: Design System & UI Guide

> Brand guidelines, color system, typography, components, and UX patterns for the Monster Match hackathon platform.

---

## 1. Design Philosophy & Theme

Monster Match features a **Halloween-inspired Cyber-Obsidian** theme. It balances dark mode readability, neon pumpkin accents, and playful monster gamification with high accessibility and modern ergonomics.

- **Atmosphere:** Dark, neon-accented, clean, responsive.
- **Brand Identity:** 🎃 Pumpkin mascot + friendly monster avatar identity.
- **Micro-interactions:** Glowing tier badges, smooth hover transitions, card lift effects, and accessible focus rings.

---

## 2. Color Palette (CSS Custom Properties)

All design tokens are defined in `css/variables.css` and applied across all views.

```css
:root {
  /* Backgrounds & Surfaces */
  --color-bg: #0a0a0c;             /* Obsidian Black primary canvas */
  --color-surface: #111114;        /* Dark Charcoal card surface */
  --color-surface-2: #1a1a1f;      /* Elevated hover/input surface */
  --color-border: #2a2a32;         /* Subtle structural borders */
  --color-border-hover: #ff7300;   /* Accent border highlight */

  /* Pumpkin Neon Accents */
  --color-accent: #ff7300;         /* Vibrant Pumpkin Orange */
  --color-accent-hover: #ff8c1a;   /* Hover glow state */
  --color-accent-subtle: rgba(255, 115, 0, 0.12); /* Badge / pill backgrounds */

  /* Text & Typography */
  --color-text: #e8e8f0;           /* High contrast primary text */
  --color-text-muted: #888899;     /* Secondary / subheader text */
  --color-text-dim: #555566;       /* Placeholders and inactive labels */

  /* Status / Feedback */
  --color-success: #10b981;        /* Connected / Verified green */
  --color-warning: #f59e0b;        /* Pending / intermediate status */
  --color-danger: #ef4444;         /* Rejected / delete red */
  --color-info: #3b82f6;           /* Links and educational tags */

  /* Elevation Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 16px rgba(255, 115, 0, 0.35);
  --shadow-glow-sm: 0 0 8px rgba(255, 115, 0, 0.25);
}
```

---

## 3. Typography

- **Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Scale:**
  - `Display / Hero Title:` 2.5rem (40px) / weight: 800 / letter-spacing: -0.03em
  - `H1 Page Title:` 2.0rem (32px) / weight: 700
  - `H2 Section Title:` 1.5rem (24px) / weight: 600
  - `H3 Card Title:` 1.25rem (20px) / weight: 600
  - `Body Text:` 1.0rem (16px) / line-height: 1.6 / weight: 400
  - `Small / Metadata:` 0.875rem (14px) / line-height: 1.4
  - `Badge / Pill:` 0.75rem (12px) / weight: 600 / uppercase or capitalized

---

## 4. Skill Tiers & Visual Indicators

Each technical skill pill displays a glowing proficiency dot:

| Proficiency Level | Dot Color | Indicator Style | Semantic Meaning |
|-------------------|-----------|-----------------|------------------|
| **Beginner** | `#9ca3af` (Gray) | Solid circle | Foundational awareness |
| **Intermediate** | `#38bdf8` (Cyan) | Mild glow | Practical project experience |
| **Advanced** | `#ff7300` (Neon Orange) | Pulse glow | Production mastery & mentorship |

### Skill Pill HTML Pattern:
```html
<span class="skill-pill tier-advanced">
  <span class="tier-dot"></span>
  React
  <span class="tier-label">advanced</span>
</span>
```

---

## 5. UI Components

### 5.1 Buttons (`.btn`)
- `.btn-primary`: Background `#ff7300`, text `#0a0a0c` (high contrast black), bold, orange drop glow.
- `.btn-outline`: Transparent background, 1px border `#ff7300`, text `#ff7300`. Hover fills orange.
- `.btn-secondary`: Dark surface `#1a1a1f`, border `#2a2a32`, text `#e8e8f0`.
- `.btn-whatsapp`: Green `#25d366` accent for unlocked WhatsApp direct chat triggers.

### 5.2 Cards (`.card`)
- Background: `#111114`
- Border: `1px solid #2a2a32`
- Border Radius: `12px`
- Padding: `24px`
- Hover State: Border switches to `#ff7300`, card lifts `translateY(-3px)`, box shadow glow applied.

### 5.3 Match Score Badge (`.match-score`)
- High-contrast rounded badge displaying compatibility percentage.
- Styled with `white-space: nowrap; flex-shrink: 0;` to prevent layout collapse.
- Gradient background from dark orange to bright neon orange based on score magnitude.

### 5.4 Monster Mascots
- Seed-based avatars powered by **DiceBear Bottts**.
- URL format: `https://api.dicebear.com/7.x/bottts/svg?seed={user_id}`
- Generates unique, reproducible robot/monster avatars for every registered student without storing bulky image files.

---

## 6. Spacing & Layout Grid

- Base unit: **8px**
- Container width: Max `1200px` centered with `24px` horizontal padding.
- Grid layouts:
  - Student card directory: `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`
  - Gap: `20px` to `24px`
- Full mobile responsiveness with flex-wrap and responsive drawer filters.
