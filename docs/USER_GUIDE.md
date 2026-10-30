# 📖 Monster Match: End-User & Judge's Guide

> User walkthrough for students, team leads, and hackathon judges navigating Monster Match.

---

## 1. Landing Page (`index.html`)

- **Hero Showcase:** Highlights the Halloween theme, core value proposition, and the 4-factor smart matching engine.
- **Live Student Preview:** Displays active student monster cards directly from the community catalog.
- **CTA Navigation:** Quick access to Explore Teammates or Login with demo personas.

---

## 2. Exploring Teammates (`pages/explore.html`)

- **Skill Search & Filter Bar:**
  - Search by student name, college, branch, or keywords in real time.
  - Multi-select technical skills with **AND** / **OR** logic toggle:
    - **AND Mode:** Find candidates who possess *all* selected skills (e.g. React AND Node.js).
    - **OR Mode:** Find candidates who possess *any* of the selected skills.
- **Filters:** Academic year, branch/major, and weekly availability status.
- **Match Compatibility Badge:** Shows your personalized % compatibility with each candidate calculated on the fly.
- **Direct Connect:** Send a connection request accompanied by a personalized note.

---

## 3. Project Directory & Posting (`pages/projects.html` & `pages/project-new.html`)

- **Browse Projects:** View open hackathon projects, required tech stacks, deadlines, and vacant roles.
- **Dynamic Role Builder:** Team leads can create projects and define distinct roles (e.g. *Frontend Lead*, *AI Engineer*) with specific required skills and vacant slot counters.
- **Apply to Roles:** Students can apply directly to specific positions with a pitch note.

---

## 4. Connections & WhatsApp Unlock (`pages/connections.html`)

- **Pending Requests:** Review incoming connection invitations from other students.
- **Privacy Gating:** Contact channels (WhatsApp number and phone) remain masked until an invitation is accepted.
- **One-Click Acceptance:** Accepting immediately unlocks the candidate's direct WhatsApp Click-to-Chat (`wa.me`) and phone dialer.
- **Direct Real-World Messaging:** Clicking the green WhatsApp button opens the conversation directly in WhatsApp with pre-filled hackathon context.

---

## 5. Profile & Completeness (`pages/profile-view.html` & `pages/profile-edit.html`)

- **Monster Mascot:** Deterministic DiceBear Bottts avatar tied to the user's account.
- **Completeness Meter:** Real-time percentage indicator evaluating profile discoverability across 8 criteria.
- **Skill Proficiency Editor:** Add and edit skills with tiered levels (`Beginner`, `Intermediate`, `Advanced`).
- **Privacy Controls:** Toggle visibility for phone number and WhatsApp channel.
