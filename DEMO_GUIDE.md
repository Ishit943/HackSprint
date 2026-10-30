# 🎃 Monster Match — Demo Guide for Hackathon Judges

> A step-by-step walkthrough of the Monster Match platform, designed for a smooth, impressive 5–8 minute live demo.

---

## ⚙️ Prerequisites

Before the demo begins, ensure the following are ready:

| Requirement | Details |
|---|---|
| **Python** | Python 3.x installed (verify: `python --version`) |
| **Repo** | Project directory cloned/downloaded to local machine |
| **Browser** | Chrome or Firefox recommended (avoid IDE embedded browser) |

### Starting the Local Server

Open a terminal in the project root directory and run:

```bash
python -m http.server 3000 --bind 127.0.0.1
```

Then open your browser and navigate to:

```
http://localhost:3000
```

> [!IMPORTANT]
> Always use `http://localhost:3000`, **not** `http://[::]:3000` or `http://0.0.0.0:3000`. The IDE embedded browser may show `ERR_ADDRESS_INVALID` with the IPv6 address. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for details.

---

## 🎬 Demo Flow — 8 Steps

---

### Step 1 — Landing Page: First Impressions

**What to show:**
- The Monster Match hero section with the Halloween dark theme (`#0a0a0c` obsidian, `#ff7300` pumpkin orange)
- Live student cards previewed below the fold
- The tagline and brand identity

**Talking points:**
> *"Monster Match is a student-only platform to find the perfect project teammate. Notice the Halloween theme — every student gets a unique monster mascot instead of a real photo, which solves profile photo privacy issues in a college context."*

**Expected result:** Landing page loads within 1 second. Student avatar monsters are visible. Pumpkin orange call-to-action buttons are prominent.

**Fallback:** If the page appears unstyled, perform a hard refresh (`Ctrl+Shift+R`). If avatars don't load (DiceBear requires internet), initials bubbles appear automatically.

---

### Step 2 — Login as Demo Persona: Aarav Sharma

**What to do:**
1. Click the **"Login"** button in the navigation bar
2. The login page shows **6 demo persona cards** — no email/password required
3. Click the card for **"Aarav Sharma"** (Frontend Developer)

**Talking points:**
> *"Judges and reviewers can log in as any of 6 pre-built student personas with a single click. No sign-up form, no email verification. We built this specifically so demos never stall on account creation."*

**Expected result:** You are immediately redirected to the **Dashboard** as Aarav Sharma. His monster mascot, skill tags (React, Tailwind, TypeScript), and profile completeness meter are visible.

**Fallback:** If the redirect doesn't occur, manually navigate to `http://localhost:3000/pages/explore.html`.

---

### Step 3 — Explore Page: Smart Match Scores

**What to do:**
1. Click **"Explore"** in the navigation bar
2. Show the student cards grid with match score badges

**Talking points:**
> *"The Explore page shows all students ranked by compatibility. Each badge is a 100-point match score — 70 points for skill overlap, 15 for availability, 10 for shared interests, and 5 for advanced proficiency ratings. Aarav is a Frontend Dev, so the algorithm surfaces AI and Backend developers as high-value teammates."*

**Expected result:** At least 5 student cards visible. Each card has a coloured match score badge (green = high, amber = medium, red = low). Cards are sorted by descending score.

---

### Step 4 — Skill Filters: AND/OR Logic

**What to do:**
1. In the skill filter bar, type **"React"** and press Enter to add the tag pill
2. Add **"Python"** as a second tag
3. Toggle the filter mode between **AND** and **OR**

**Talking points:**
> *"The filter supports AND/OR logic. In AND mode, only students who know BOTH React AND Python appear — great for finding unicorns. In OR mode, anyone with either skill is shown. This gives team leads precise control when they have strict role requirements."*

**Expected result:**
- **AND mode:** Only students with both React AND Python in their skill list appear (likely 1–2 results)
- **OR mode:** All students with either skill appear (broader set)
- Cards update reactively — no page reload

**Fallback:** If filters don't apply, check the browser console for JS errors. Clear filters by clicking the ✕ on each pill and retry.

---

### Step 5 — Send a Connection Request to Ananya Verma

**What to do:**
1. Clear the skill filters to show all students
2. Locate **Ananya Verma** (AI/ML Engineer) in the card grid
3. Click the **"Connect 🎃"** button on her card
4. In the modal that appears, type a personalised note:
   > *"Hi Ananya! I'm building MedBot and need an ML engineer. Your TensorFlow experience is exactly what we need — let's collaborate!"*
5. Click **"Send Request"**

**Talking points:**
> *"Notice that Ananya's WhatsApp number is completely invisible — there's no phone data in this card, anywhere in the DOM, or in the API response. Contact details are never exposed until both parties have accepted a connection. We enforce this at the database query level, not just CSS visibility."*

**Expected result:** A success toast notification appears: *"Connection request sent to Ananya Verma 🎃"*. The "Connect" button changes to "Pending ⏳".

**Fallback:** If the modal doesn't open, verify you are logged in (check nav for "Aarav Sharma"). Reload the page and retry.

---

### Step 6 — Switch Persona: Accept the Request as Ananya

**What to do:**
1. Click the profile menu → **"Logout"**
2. On the login page, click **"Ananya Verma"** persona card
3. Navigate to the **"Connections"** page in the nav
4. Find Aarav Sharma's pending request with his note
5. Click **"Accept"**

**Talking points:**
> *"Now we're Ananya. She can read Aarav's personalised note and make an informed decision. Accepting the request is the consent event that unlocks contact exchange — this mirrors how professional networking actually works."*

**Expected result:** The request card moves from the "Pending" tab to the "Connected" tab. A confirmation toast appears: *"You are now connected with Aarav Sharma!"*

---

### Step 7 — Contact Unlock: WhatsApp Button Appears

**What to do:**
1. On the Connections page, find the now-accepted connection with Aarav Sharma
2. Show the **"Chat on WhatsApp 💬"** button that has appeared
3. Hover over the button to show the pre-filled `wa.me` URL in the status bar
4. (Optional) Click it to show the WhatsApp web pre-fill in a new tab

**Talking points:**
> *"The WhatsApp button only appears after mutual acceptance. Clicking it opens a pre-filled WhatsApp conversation directly — no copy-pasting numbers, no awkward DMs asking 'what's your number?' It works on desktop and mobile, and requires zero API keys or Meta approval."*

**Expected result:** A glowing orange "Chat on WhatsApp 💬" button is visible. Clicking it opens `https://wa.me/<phone>?text=Hi%20Aarav...` in a new tab. The message is pre-populated.

---

### Step 8 — Projects Directory: MedBot AI

**What to do:**
1. Navigate to the **"Projects"** page in the nav
2. Find the **"MedBot AI"** project card
3. Click **"View Project"**
4. Show the role slots panel

**Talking points:**
> *"The Projects directory lets teams post their hackathon projects and specify exactly which roles they need. MedBot needs a Frontend Dev (1 slot) and a Data Scientist (1 slot). Slot counts decrease as team members join. This is the 'job board' layer that complements the direct student matching."*

**Expected result:** MedBot AI project detail page shows title, description, domain tags, and a roles table. Role slots show remaining vacancies. A "Request to Join" button is visible.

---

## 📋 Full Demo Checklist

| Step | Feature | Time |
|---|---|---|
| 1 | Landing page, Halloween theme, brand | ~30 sec |
| 2 | 6 persona one-click login (Aarav) | ~30 sec |
| 3 | Explore page with match scores | ~45 sec |
| 4 | AND/OR skill filter demo | ~45 sec |
| 5 | Send connection request with note | ~60 sec |
| 6 | Switch to Ananya, accept request | ~45 sec |
| 7 | Contact unlock, WhatsApp button | ~60 sec |
| 8 | Projects directory, role slots | ~45 sec |
| **Total** | | **~6 min** |

---

## 🚨 Fallback Tips

| Problem | Solution |
|---|---|
| Page won't load | Ensure Python server is running: `python -m http.server 3000 --bind 127.0.0.1` |
| `ERR_ADDRESS_INVALID` | Navigate to `http://localhost:3000` (not `http://[::]:3000`) |
| Monster avatars not loading | Offline — initials bubbles appear automatically, explain DiceBear requires internet |
| Match scores all show 0 | Check browser console — likely a JS module import error; hard refresh |
| Connection request not saving | App may be in broken localStorage state — open DevTools → Application → Clear Storage → refresh |
| WhatsApp button missing | Ensure you accepted the request while logged in as the *receiver*, not the sender |
| Supabase errors in console | Expected in demo mode — app runs on localStorage mock, errors are non-fatal |

---

> [!TIP]
> Open browser DevTools (F12) on the **Console** tab before the demo starts. Supabase connection warnings are expected and non-fatal in mock mode, but being ready to explain them shows technical confidence.
