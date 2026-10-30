# 🧪 Monster Match: Testing Strategy & Verification Guide

> Quality assurance manual, test cases, persona walkthroughs, and security verification checklists for Monster Match.

---

## 1. Testing Philosophy

Monster Match was engineered for high resilience during competitive hackathons. Testing covers two operational modes:
1. **Interactive Demo / Offline Mock Mode:** Zero backend dependencies, runs entirely in the browser via `localStorage` and seed personas.
2. **Production Supabase Mode:** Live PostgreSQL transactions, Row-Level Security, real auth, and Edge Functions.

---

## 2. Test Execution Environment

To run the local test suite:
```powershell
python -m http.server 3000 --bind 127.0.0.1
```
Open **`http://localhost:3000`** in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 3. Manual Test Matrix by Feature

### 3.1 Authentication & College Email Verification
| ID | Scenario | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-AUTH-01 | One-Click Persona Login | Click "Aarav Sharma" on `login.html` | Session created, redirected to `dashboard.html`, user avatar displayed | ✅ Pass |
| TC-AUTH-02 | Logout Isolation | Click "Logout" from header | Session purged, redirected to `login.html`, `getCurrentUser()` returns `null` | ✅ Pass |
| TC-AUTH-03 | College Email Signup | Email: `student@juet.ac.in` | Verification badge granted, account created | ✅ Pass |
| TC-AUTH-04 | Public Domain Signup | Email: `user@gmail.com` | Account created without verified student badge | ✅ Pass |

### 3.2 Skill Filtering & Matching Engine
| ID | Scenario | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-MATCH-01 | Single Skill Filter | Select `React` | Displays students possessing React skill pill | ✅ Pass |
| TC-MATCH-02 | Multi-Skill AND Logic | Select `React` AND `Python` | Displays only students possessing BOTH skills | ✅ Pass |
| TC-MATCH-03 | Multi-Skill OR Logic | Select `React` OR `Python` | Displays students possessing EITHER skill | ✅ Pass |
| TC-MATCH-04 | Match Score Calculation | View candidate vs logged-in user | Match % dynamically calculated via 4-variable formula | ✅ Pass |

### 3.3 Connection & Privacy Unlock
| ID | Scenario | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-CONN-01 | Send Request | Click "Connect 🎃" on profile with note | Request saved as `pending`, note sanitized | ✅ Pass |
| TC-CONN-02 | Contact Masking | View pending or unconnected profile | Phone & WhatsApp hidden behind unlock notice | ✅ Pass |
| TC-CONN-03 | Accept Connection | Switch to receiver, click "Accept & Unlock" | Request moves to `accepted`, contact unlocked | ✅ Pass |
| TC-CONN-04 | WhatsApp wa.me Dispatch | Click unlocked WhatsApp button | Opens `https://wa.me/<phone>?text=...` in new tab | ✅ Pass |

### 3.4 Project Creation & Role Slots
| ID | Scenario | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-PROJ-01 | Create Project | Fill title, hackathon name, add 2 dynamic roles | Project saved, appears in `projects.html` | ✅ Pass |
| TC-PROJ-02 | Role Application | Apply for a specific role slot | Application registered with project owner | ✅ Pass |

---

## 4. Cross-Browser Compatibility

| Browser | Version Tested | Rendering Engine | Result |
|---|---|---|---|
| Google Chrome | 120+ | Blink | ✅ Flawless |
| Microsoft Edge | 120+ | Blink | ✅ Flawless |
| Mozilla Firefox | 122+ | Gecko | ✅ Flawless |
| Apple Safari (iOS/macOS) | 17+ | WebKit | ✅ Flawless |
