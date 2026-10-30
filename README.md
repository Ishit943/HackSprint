# 👾 Monster Match: Find Your Project Teammate (PS10)

> A modern web platform where students create skill profiles with verified proficiency, post hackathon requirements, search and filter candidate teammates with precision (AND/OR logic), and connect instantly through in-app requests, verified phone calls, and direct WhatsApp chat.

Built for **Runtime Terror HackSprint 2026**.

---

## 🌟 Key Features

### 1. Student Skill Profiles
- **Proficiency Tags**: Beginner, Intermediate, and Advanced skill badges.
- **Availability Tracker**: Hours per week and flexible schedule preferences.
- **College Email Verification**: Automated 🎓 verification badge for `.ac.in` and `.edu` emails.
- **Completeness Meter**: Dynamic score meter measuring profile depth.
- **Privacy By Default**: Phone numbers and WhatsApp links remain strictly hidden until an owner accepts a connection request.

### 2. Hackathon Requirement Posts
- Create project posts specifying **exact open roles** (e.g. 1 Frontend Dev, 1 ML Engineer).
- Define team size, submission deadline, and participation mode (Online, Offline, Hybrid).
- One-click "Apply" and "Connect with Lead".

### 3. Precision Search & Multi-Skill Filtering
- Instant live search debounced at 300ms.
- **AND / OR Skill Match Toggle**:
  - `AND` mode: Candidate must possess *all* selected skills.
  - `OR` mode: Candidate possesses *any* selected skill.
- Academic filters: Year of study (1st - 4th Year), Branch, College, and Status.
- Sorting by **Smart Match %**, Availability, and Alphabetical.

### 4. Smart Match Algorithm
Computes a compatibility percentage using a multi-factor score formula:
```
score = (matched required skills / total required skills) * 70
      + (availability overlap) * 15
      + (interest overlap) * 10
      + (proficiency bonus) * 5
```

### 5. Instant Connectivity: WhatsApp & Phone Links
- Send structured connection requests with personal notes.
- Tabs for **Received**, **Sent**, and **Accepted** requests.
- **Upon acceptance**, direct communication channels unlock immediately:
  - **WhatsApp**: Triggers `https://wa.me/<number>?text=<encoded_msg>` opening directly in WhatsApp.
  - **Call**: Triggers native `tel:<number>`.
- Optional Supabase Edge Function (`functions/send-whatsapp`) for Meta WhatsApp Cloud API automated notifications.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 | Accessible, semantic layout across all pages |
| **Styling** | CSS3 (Custom Design Tokens, Flexbox, Grid) | Dark & light themes, responsive typography, zero framework overhead |
| **Logic** | Vanilla JavaScript (ES6+ Modules) | Modular client-side architecture, instant filtering, state persistence |
| **Database** | Supabase (PostgreSQL) | Relational schema, Row-Level Security (RLS), and real-time support |
| **Edge Function** | Deno / Node.js | Secure server-side execution for WhatsApp Cloud API |

---

## 📂 Project Architecture

```
Project/
├── index.html                   # High-converting landing page & live showcase
├── pages/
│   ├── explore.html             # Multi-skill search & filter directory
│   ├── projects.html            # Browse hackathon requirement posts
│   ├── project-new.html         # Post a new project opening
│   ├── connections.html         # Requests management & WhatsApp/Call triggers
│   ├── dashboard.html           # Smart match recommendations & overview
│   ├── profile-view.html        # Detailed student skill profile & contact box
│   ├── profile-edit.html        # Profile editor & skill proficiency picker
│   ├── login.html               # User login with 1-click demo sessions
│   └── signup.html              # College verification signup
├── css/
│   ├── variables.css            # Monster design system tokens & dark mode
│   ├── base.css                 # CSS reset, layout containers, and toasts
│   └── components.css           # Cards, buttons, chips, modals, progress bars
├── js/
│   ├── config.js                # Supabase configuration & live/mock mode switch
│   ├── utils.js                 # Theme toggler, toasts, sanitize, match algorithm
│   ├── api.js                   # Unified data access layer & local storage fallback
│   └── auth.js                  # Authentication and college email verifier
├── sql/
│   └── schema.sql               # PostgreSQL DDL with RLS, triggers & seed skills
├── functions/
│   └── send-whatsapp/           # Supabase edge function for WhatsApp Cloud API
├── .env.example                 # Environment configuration template
├── .gitignore                   # Ignored files
├── roadmap.md                   # Full phased project roadmap
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Run Locally (No build step required!)
Because Monster Match uses standard ES6 modules, you can serve it with any local static server:

```powershell
# Option A: Using Python
python -m http.server 3000

# Option B: Using Node.js npx serve
npx serve .
```

Open `http://localhost:3000` in your browser.

### 2. Connect Live Supabase Database
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`sql/schema.sql`](sql/schema.sql).
4. Update `js/config.js` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

*(Note: If live keys are not configured, the app automatically runs in **Interactive Demo Mode** with pre-seeded student monsters and projects so you can test all features immediately!)*

---

## 🔒 Privacy & Safety Implementation
- Phone numbers and WhatsApp contact links are **never exposed publicly** in search or profile views.
- Contact info is only viewable if:
  1. The viewer is the profile owner, OR
  2. The viewer has an **accepted connection request** with the student, AND
  3. The student opted-in to share phone/WhatsApp.

---

## 🧪 Testing Checklist
- [x] Dark / Light theme toggle persists across refreshes.
- [x] Live search debounces and filters candidate monsters in real time.
- [x] Skill filter supports both `AND` (must match all) and `OR` (matches any) operations.
- [x] Connection request flow: Send request -> view in "Sent" / "Received" -> Accept request -> WhatsApp and Call buttons unlock immediately.
- [x] Profile completeness meter updates dynamically based on filled fields.
- [x] Form validation and sanitized input across all forms.
