# 📋 Monster Match: Detailed System Requirements

> Complete Functional and Non-Functional Requirements for Runtime Terror HackSprint 2026 (Problem Statement 10: Find Your Project Teammate).

---

## 1. Functional Requirements (FR)

### FR-01: Student Discovery & Search
- The system MUST allow users to search students by name, college, branch, and technical skills.
- The system MUST provide multi-skill filtering with both **AND** (intersection) and **OR** (union) modes.
- The system MUST compute and render a compatibility percentage between the logged-in student and search results.

### FR-02: Connection Requests & Direct Messaging
- The system MUST enable users to send connection requests accompanied by a personalized text note.
- The system MUST mask phone numbers and direct WhatsApp URLs until the recipient clicks **Accept**.
- The system MUST generate deep-link `wa.me` URLs with encoded contextual greetings upon connection acceptance.

### FR-03: Project & Vacant Role Management
- The system MUST permit students to create project posts specifying hackathon details, category, and submission deadlines.
- The system MUST support dynamic role creation with required technical stacks and available slot limits.
- The system MUST permit other students to submit role applications directly to the project owner.

### FR-04: Profile & Gamification
- The system MUST generate deterministic monster mascots (DiceBear Bottts) derived from student identifiers.
- The system MUST calculate an 8-variable Profile Completeness Score (0% to 100%).
- The system MUST support tiered skill proficiencies: Beginner, Intermediate, and Advanced.

---

## 2. Non-Functional Requirements (NFR)

### NFR-01: Performance & Zero-Build Ergonomics
- Page load times MUST remain below 1.5 seconds on standard 3G/4G network connections.
- The application MUST run natively in modern evergreen browsers without requiring compilation, bundling, or external node processes.

### NFR-02: Privacy & Data Protection
- Phone numbers and WhatsApp credentials MUST never be exposed in public API search responses or unauthenticated views.
- All user-supplied text (bios, notes, role requirements) MUST undergo XSS HTML escaping prior to DOM insertion.

### NFR-03: Offline & Demo Resilience
- The application MUST seamlessly switch to offline `localStorage` mock mode with 6 pre-seeded student personas if remote database credentials are not configured.
