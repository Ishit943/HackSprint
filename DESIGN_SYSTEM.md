# 🎨 Monster Match: Full Crazy Halloween Horror Design System & UI Guide

> Brand guidelines, supernatural color system, horror typography, cursed components, ambient audio, and UX patterns for the Monster Match hackathon platform (Runtime Terror HackSprint 2026).

---

## 1. Design Philosophy & Full Crazy Horror Aesthetic

Monster Match features an uncompromising **Halloween Horror Cyber-Crypt** aesthetic. It marries deep obsidian abyssal surfaces with radiant jack-o'-lantern flames, radioactive ectoplasm slime, vampire crimson accents, and gothic horror typography.

- **Atmosphere:** Deep Crypt Obsidian canvas with drifting embers, radioactive ectoplasm motes, bat silhouettes, and subtle graveyard fog.
- **Brand Identity:** 🎃 Animated candle-flicker Jack-o'-Lantern logo + DiceBear Bottts monster avatars.
- **Sound & Multi-Sensory UX:** Pure Web Audio API procedural sound synthesizer powering ghostly theremin hover sounds, crypt coffin clicks, witch sparkle spells, and dungeon booms with a built-in navbar audio controller (`🔊 Haunted FX`).
- **Micro-interactions:** Levitating cursed grimoire cards (`card-hover`), radioactive glowing skill pills, bubbling witches' potion completeness bars, and mouse ember particle trails.

---

## 2. Supernatural Color Palette (`css/variables.css`)

All design tokens are defined in `css/variables.css` and applied across all views.

```css
:root {
  /* Blazing Jack-o'-Lantern Hellfire Orange */
  --color-primary: #ff5500;           /* Radiant Pumpkin Hellfire */
  --color-primary-hover: #ff7700;     /* Incandescent Fire Glow */
  --color-primary-dark: #b82b00;      /* Roasted Charcoal Pumpkin */
  --color-primary-light: rgba(255, 85, 0, 0.16);
  --color-primary-glow: rgba(255, 85, 0, 0.55);

  /* Demonic Crimson / Vampire Blood */
  --color-secondary: #ff0044;         /* Vampire Blood Red */
  --color-secondary-hover: #d60039;
  --color-secondary-light: rgba(255, 0, 68, 0.18);
  --color-secondary-glow: rgba(255, 0, 68, 0.5);

  /* Radioactive Ectoplasm Slime Green */
  --color-slime: #00ff66;             /* Radioactive Ghost Ectoplasm */
  --color-slime-hover: #26ff7d;
  --color-slime-glow: rgba(0, 255, 102, 0.5);
  --color-slime-light: rgba(0, 255, 102, 0.15);

  /* Spectral Necromancer Purple */
  --color-purple: #a855f7;            /* Phantom Violet */
  --color-purple-hover: #c084fc;
  --color-purple-glow: rgba(168, 85, 247, 0.45);
  --color-purple-light: rgba(168, 85, 247, 0.16);

  /* Deep Crypt Obsidian Surfaces */
  --bg-page: #06050a;                 /* Abyss Void canvas */
  --bg-surface: #0e0d16;              /* Haunted Crypt Obsidian */
  --bg-surface-elevated: #161423;     /* Raised Grimoire Slab */
  --bg-surface-subtle: #110f1c;       /* Smoked Tomb Chamber */
  --bg-input: #090812;                /* Dark Crypt Recess */
  --border-color: #27203b;            /* Dark Cursed Metal */
  --border-color-hover: #ff5500;      /* Blazing Flame Rim */

  /* Text & Mist */
  --text-primary: #f5f4fb;            /* Bone Pearl White */
  --text-secondary: #c4bfdc;          /* Ghostly Pale Lavender */
  --text-muted: #7d759d;              /* Crypt Cobweb Gray */

  /* Supernatural Glow Shadows */
  --shadow-glow-pumpkin: 0 0 30px rgba(255, 85, 0, 0.5);
  --shadow-glow-slime: 0 0 30px rgba(0, 255, 102, 0.45);
  --shadow-glow-blood: 0 0 30px rgba(255, 0, 68, 0.45);
  --shadow-glow-purple: 0 0 30px rgba(168, 85, 247, 0.45);
}
```

---

## 3. Typography & Horror Fonts

- **Display & Horror Titles:** `'Creepster', cursive` & `'Nosifer', cursive`
  - High-impact dripping horror fonts used for brand headlines, display titles, and prominent stats.
- **Gothic Accents:** `'Cinzel Decorative', Georgia, serif`
  - Grimoire headers and mystical sections.
- **Body & Ergonomics:** `'Plus Jakarta Sans', -apple-system, sans-serif`
  - Ensures supreme readability across forms, candidate cards, and bios.
- **Code & Percentages:** `'JetBrains Mono', monospace`
  - Used in match score pills, availability tags, and code badges.

---

## 4. Skill Tiers & Alchemical Rune Badges

Each technical skill pill displays a glowing proficiency dot:

| Proficiency Tier | Semantic Indicator | Dot Color & Aura | Meaning & Lore |
|-------------------|-------------------|------------------|----------------|
| **Beginner** | `🔮 Phantom Apprentice` | `#a855f7` (Purple Mist) | Foundational awareness |
| **Intermediate** | `🔥 Fiery Specter` | `#ff5500` (Ember Glow) | Practical project & hackathon capability |
| **Advanced** | `🧪 Grand Necromancer` | `#00ff66` (Radioactive Pulse) | Production mastery & codebase mentorship |

### Skill Pill HTML Pattern:
```html
<span class="skill-pill tier-advanced">
  <span class="dot"></span>
  React
</span>
```

---

## 5. UI Components

### 5.0 Edge Geometry & Corner Radii
- **Slightly Sharp Philosophy:** Edges are softened just enough to eliminate rigid, flat 90° boxiness without becoming round bubbles or pill shapes.
- **Cards (`.card`, `.grimoire-card`):** `10px` (`--radius-card`) — Sleek, distinct grimoire silhouette.
- **Buttons (`.btn`):** `8px` (`--radius-btn`), `.btn-sm`: `6px` (`--radius-sm`) — Crisp, authoritative buttons.
- **Inputs & Selects (`.input`, `.select`, `.textarea`):** `8px` (`--radius-input`).
- **Badges, Chips & Match Score (`.badge`, `.chip`, `.skill-pill`, `.match-score`):** `6px` (`--radius-badge`) — Clean tech badges.

### 5.1 Buttons (`.btn`)
- `.btn-primary`: Blazing Jack-o'-Lantern gradient (`#ff7b00` → `#d61800`), fiery ember shadow, hover flame burst.
- `.btn-secondary`: Radioactive Ectoplasm Green (`#00ff66` → `#059669`), deep obsidian text.
- `.btn-outline`: Dark crypt glass with pulsing orange border and backdrop blur.
- `.btn-whatsapp`: Unholy WhatsApp communicator with radioactive green glow.

### 5.2 Cards (`.card`, `.grimoire-card`)
- Dark obsidian slab with subtle noise and corner spiderweb flourishes (`🕸️`).
- Levitating hover lift: `transform: translateY(-6px) scale(1.01)` with fiery pumpkin and slime glow shadows.

### 5.3 Match Score Pill (`.match-score`)
- High-contrast soul compatibility flame meter (`⚡ 98%`) with ember sparks and inner radiance.

### 5.4 Witches' Cauldron Progress Bar (`.progress-bar-fill`)
- Bubbling gradient meter (`#ff5500` → `#00ff66` → `#ff0044`) calculating real-time profile completeness strength.

---

## 6. Spooky Ambient Engine (`js/horror-theme.js`)

1. **Ambient Canvas:** Background particles simulating campfire sparks, floating ectoplasm motes, and gliding bat silhouettes.
2. **Interactive Cursor Trail:** Gentle embers that fade along mouse coordinates.
3. **Web Audio Synthesizer:** Pure procedural Web Audio API audio (0 external audio files):
   - Hover: High-pitch spectral theremin glide.
   - Click: Crypt coffin knock / bone tap.
   - Spell: Witch bell arpeggio.
4. **Easter Egg Trigger:** Floating `🎃 Summon Spook` pill at bottom left that summons a playful flying ghost across the screen with cheerful developer quotes.
