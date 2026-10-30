# 🔐 Monster Match: Authentication & Academic Trust Architecture

> Documentation on user authentication, session state management, and college email domain verification.

---

## 1. Authentication Strategy

Monster Match utilizes a dual authentication model:
1. **Mock Persona Authentication (`js/auth.js`):** Fast demo switching across 6 seeded student profiles without manual email passwords.
2. **Supabase Auth (Live Production):** Secure JWT-based email/password registration with Row Level Security enforcement.

---

## 2. College Email Verification (`Agent-Trust`)

To ensure authentic student collaboration and deter spam during inter-college hackathons, Monster Match validates email domains upon registration:

### 2.1 Recognized Academic TLDs and Domains
- **`.ac.in`** (All Indian Universities & Institutes)
- **`.edu`** (Accredited Global Universities)
- **`juet.ac.in`** (Jaypee University of Engineering and Technology)
- **`*.edu.in`**, **`*.ernet.in`**

### 2.2 Badge Issuance Logic
```javascript
export function verifyAcademicEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase();
  
  const validAcademicSuffixes = ['.ac.in', '.edu', '.edu.in', '.ernet.in', 'juet.ac.in'];
  return validAcademicSuffixes.some(suffix => domain.endsWith(suffix));
}
```

When verified:
- User profile is awarded the `🎓 Verified Student` badge.
- Discoverability weighting is boosted by +5% in candidate search listings.

---

## 3. Session Persistence & Security Controls

- **Storage Key:** `mm_current_user` in browser `localStorage`.
- **Session Lifecycle:**
  - Login sets full user object and timestamp.
  - Profile updates immediately re-sync `mm_current_user`.
  - Logout cleanly deletes session keys and routes to `pages/login.html`.
- **Protected Pages Guard:**
  ```javascript
  import { requireAuth } from '../js/auth.js';
  const user = requireAuth(); // Redirects to login.html if session is null
  ```
