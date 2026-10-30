# Monster Match: Find Your Project Teammate
### Full Project Roadmap (PS10)

> A platform where students create skill profiles, post project requirements, search and filter for teammates, and connect with them through in-app requests, phone calls and WhatsApp.

---

## 1. Project Overview

**Problem:** Students looking for hackathon or project teammates don't know who has the skills, interests, or availability they need.

**Solution:** Monster Match is a web app with:
- Rich student skill profiles
- Project posts that list the roles and skills needed
- Powerful search and filters
- Smart match suggestions
- Connection requests, with call and WhatsApp contact unlocked after acceptance

**Difficulty:** Easy to Medium (the core is easy; matching, WhatsApp and real-time features are the medium parts)

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Structure | **HTML5** | Semantic, accessible pages |
| Styling | **CSS3** (Flexbox, Grid, CSS variables, media queries) | Responsive, dark/light theme, no framework needed |
| Logic | **Vanilla JavaScript (ES6+ modules)** | Fetch API, DOM handling, client-side filtering |
| Database | **Supabase (PostgreSQL)**, with **Firebase Firestore** as an alternative | Hosted DB with built-in auth, row-level security and real-time updates, so the project needs no custom server for core features |
| Auth | Supabase Auth (email and password, Google login, college-email verification) | Secure, little code |
| Serverless function | One small **Node.js / Supabase Edge Function** | Needed only for the WhatsApp Cloud API, because secret tokens must never sit in frontend JS |
| Messaging | **WhatsApp**: `wa.me` click-to-chat (free, Phase 4) and **WhatsApp Business Cloud API** (Phase 8) | See Section 8 |
| Calling | `tel:` links (works on mobile and many desktops) | No API needed |
| Hosting | Netlify or Vercel (frontend), Supabase (DB and functions) | Free tiers |
| Tools | Git/GitHub, VS Code, Postman, Lighthouse | Workflow and QA |

> **Note:** The brief lists "HTML, CSS, JavaScript and a database". Everything above stays in that spirit. The only extra piece is one tiny serverless function, used for the WhatsApp API.

---

## 3. Feature List

### 3.1 Core Features (from the brief)
1. **Student skill profiles**
2. **Project requirement posts**
3. **Search by skills or interests**
4. **Request to connect**

### 3.2 Extended Features (the "comprehensive" part)

**Profiles**
- Photo, name, college, branch, year, bio
- Skills with **proficiency level** (Beginner / Intermediate / Advanced)
- Interests (AI, Web3, App Dev, Design, IoT, etc.)
- Availability (hours per week, weekdays/weekends, timezone)
- Links: GitHub, LinkedIn, portfolio, resume (PDF upload)
- Past projects and hackathon experience
- Looking-for status: Open to teams / Busy / Team formed
- Profile completeness meter (e.g. "80% complete")
- Contact preferences: show or hide phone, WhatsApp on/off, preferred contact time

**Project / Team Posts**
- Title, description, category, hackathon name and date
- Required roles (e.g. 1 Frontend, 1 ML, 1 Designer), with skills per role
- Team size, current members, deadline, mode (online / offline)
- Status: Open / Filled / Closed
- Edit and close posts, and an "I'm interested" button

**Search and Filters**
- Keyword search (name, skill, interest)
- Multi-select skill filter (AND / OR toggle)
- Filter by college, year, branch, availability, experience level, location, status
- Sort by best match, newest, most skills, recently active
- Save filters as presets (e.g. "React + UI/UX, weekends")
- Pagination or infinite scroll, plus debounced live search

**Smart Matching**
- Match score (%) between a project's required skills and each student's skills
- "Recommended teammates" on every project page
- "Recommended projects for you" on the dashboard
- Complementary-skills suggestions (e.g. you know backend, so you get matched with frontend people)

**Connecting**
- Send a **connection request** with a short message
- Accept / Decline / Withdraw
- In-app notifications and a connections list
- After acceptance, the phone number and WhatsApp unlock
- **Call button** (`tel:`)
- **WhatsApp button**: opens a pre-filled chat, or sends a message through the API
- Optional in-app chat (real-time)

**Team Management**
- Invite accepted connections into a team
- Team page with members, roles and links
- Mark a project "Team complete"

**Safety and Trust**
- College-email verification badge
- Report and block users
- Admin moderation panel
- Rate limiting on requests, to prevent spam

**Extras**
- Dark/light mode
- Fully responsive (mobile first)
- Email notifications for new requests
- Hackathon events board
- Skill endorsements by teammates
- Leaderboard / "Top collaborators"
- Export profile as a shareable link or card

---

## 4. Database Design

### Tables

```
users
  id (uuid, PK), email, full_name, avatar_url, college, branch, year,
  bio, phone, whatsapp_number, show_phone (bool), show_whatsapp (bool),
  availability_hours, availability_notes, status (open/busy/teamed),
  github_url, linkedin_url, portfolio_url, resume_url,
  email_verified (bool), created_at, last_active

skills
  id, name, category (frontend/backend/ml/design/...)

user_skills
  id, user_id (FK), skill_id (FK), level (beginner/intermediate/advanced)

interests
  id, name

user_interests
  user_id (FK), interest_id (FK)

projects
  id, owner_id (FK), title, description, category, hackathon_name,
  deadline, mode, team_size, status (open/filled/closed), created_at

project_roles
  id, project_id (FK), role_title, slots, description

project_role_skills
  role_id (FK), skill_id (FK)

connection_requests
  id, sender_id (FK), receiver_id (FK), project_id (FK, nullable),
  message, status (pending/accepted/declined/withdrawn),
  created_at, responded_at

teams / team_members
  team_id, project_id, user_id, role, joined_at

messages
  id, sender_id, receiver_id, body, sent_via (app/whatsapp), created_at, read

whatsapp_logs
  id, sender_id, receiver_id, template_name, status, wa_message_id, created_at

notifications
  id, user_id, type, payload (json), read, created_at

saved_filters
  id, user_id, name, filter_json

reports
  id, reporter_id, reported_id, reason, status, created_at

endorsements
  id, endorser_id, user_id, skill_id, created_at
```

### Key Indexes
- `user_skills(skill_id)`, `user_skills(user_id)`
- `connection_requests(receiver_id, status)`
- Full-text search index on `users(full_name, bio)`
- `projects(status, deadline)`

### Security (Row-Level Security)
- Users edit only their own profile and posts
- Phone and WhatsApp fields readable only by a user who has an **accepted** connection with the owner and only if the owner enabled sharing
- Admin role for moderation

---

## 5. Application Structure

```
monster-match/
├── index.html              # Landing page
├── pages/
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── profile-edit.html
│   ├── profile-view.html
│   ├── explore.html        # Search and filter students
│   ├── projects.html       # Browse project posts
│   ├── project-new.html
│   ├── project-view.html
│   ├── connections.html    # Requests, accepted, sent
│   ├── chat.html
│   ├── team.html
│   └── admin.html
├── css/
│   ├── variables.css       # Theme tokens (colors, spacing)
│   ├── base.css
│   ├── components.css      # Cards, buttons, chips, modals
│   └── pages/*.css
├── js/
│   ├── config.js           # Supabase URL and anon key
│   ├── auth.js
│   ├── api.js              # DB calls
│   ├── profile.js
│   ├── search.js           # Filters, debounce, sort
│   ├── matching.js         # Match-score logic
│   ├── connect.js          # Requests, call, WhatsApp
│   ├── notifications.js
│   ├── chat.js
│   └── utils.js
├── functions/
│   └── send-whatsapp/      # Serverless function (Phase 8)
├── assets/                 # Images, icons, logo (monster mascot!)
├── .env.example
└── README.md
```

---

## 6. Phased Roadmap

> Suggested pace: **8 to 10 weeks** part-time. Compress phases for a hackathon build.

### Phase 0: Planning and Setup (Week 1)
- [ ] Finalize features and the MVP scope
- [ ] Sketch wireframes (Figma or paper) for 6 key screens
- [ ] Pick the brand: name, monster mascot, color palette, fonts
- [ ] Create the GitHub repo, folder structure and `.gitignore`
- [ ] Create a Supabase project and note the keys (keep them out of Git)
- [ ] Write the DB schema SQL and run it

**Deliverable:** Repo, wireframes, empty DB with tables.

---

### Phase 1: Authentication and Basic Profile (Week 2)
- [ ] Signup / login / logout with Supabase Auth
- [ ] College-email verification flow
- [ ] Protected routes (redirect if not logged in)
- [ ] Profile creation form (basic info and skills)
- [ ] Skill picker with autocomplete and proficiency level
- [ ] Avatar upload (Supabase Storage)
- [ ] Profile view page

**Deliverable:** A user can sign up, build a profile and view it.

---

### Phase 2: Explore, Search and Filters (Week 3)
- [ ] Student cards grid (photo, name, top skills, availability badge)
- [ ] Keyword search with debounce
- [ ] Multi-select skill filters, with AND/OR toggle
- [ ] Filters for year, branch, college, availability and status
- [ ] Sorting options and pagination
- [ ] Save and load filter presets
- [ ] Empty states, loading skeletons, "no results" tips

**Deliverable:** Powerful people search, the heart of the app.

---

### Phase 3: Projects and Requirement Posts (Week 4)
- [ ] Create / edit / close project posts
- [ ] Add multiple roles with required skills and slots
- [ ] Browse and filter projects (category, skills, deadline, mode)
- [ ] Project detail page
- [ ] "I'm interested" and "Apply for role" actions

**Deliverable:** Users can post what they need and discover projects.

---

### Phase 4: Connect, Call and WhatsApp (Week 5)
- [ ] "Request to connect" modal with a short message
- [ ] Connections page: Received / Sent / Accepted tabs
- [ ] Accept / Decline / Withdraw logic
- [ ] Notifications (bell icon with unread count)
- [ ] **Call button** using `tel:+91XXXXXXXXXX`
- [ ] **WhatsApp button** using click-to-chat:
  `https://wa.me/<number>?text=<URL-encoded pre-filled message>`
  (message example: "Hi {name}, I found you on Monster Match and I'd love to team up on {project}!")
- [ ] Contact details visible **only after acceptance** and only if the owner allowed it
- [ ] Contact-preference settings in the profile

**Deliverable:** Full connection flow with call and WhatsApp (click-to-chat, no API key needed).

---

### Phase 5: Smart Matching (Week 6)
- [ ] Match score formula, for example:
  ```
  score = (matched required skills / total required skills) * 70
        + availability overlap * 15
        + interest overlap * 10
        + proficiency bonus * 5
  ```
- [ ] "Recommended teammates" on project pages
- [ ] "Projects for you" on the dashboard
- [ ] Display the match % and a "why matched" breakdown (shared skills as chips)

**Deliverable:** The platform suggests people and projects.

---

### Phase 6: Teams, Chat and Notifications (Week 7)
- [ ] Add accepted connections to a project team
- [ ] Team page (members, roles, links)
- [ ] Auto-update project status to "Filled" when the slots are full
- [ ] Real-time in-app chat (Supabase Realtime)
- [ ] Email notifications for new requests and acceptances

**Deliverable:** Teams form and communicate inside the app.

---

### Phase 7: Trust, Safety and Admin (Week 8)
- [ ] Report and block users
- [ ] Rate limit on connection requests (e.g. 20/day)
- [ ] Admin dashboard: reports, user management, remove posts
- [ ] Row-Level Security audit
- [ ] Input validation and XSS protection (sanitize all user text)

**Deliverable:** A safer platform ready for real students.

---

### Phase 8: WhatsApp Business Cloud API Integration (Week 9, optional but impressive)
- [ ] Create a Meta developer account and a WhatsApp Business app
- [ ] Register a sender number and get the permanent access token and phone number ID
- [ ] Write the serverless function `send-whatsapp`:
  - Receives `{ receiver_id, template, params }` from the frontend
  - Verifies that the caller is logged in and **has an accepted connection** with the receiver
  - Calls `POST https://graph.facebook.com/<version>/<PHONE_NUMBER_ID>/messages` with the token stored as a **server-side secret**
  - Logs the result in `whatsapp_logs`
- [ ] Create and submit **message templates** for approval, such as:
  - `connection_request_alert`: "Hi {{1}}, {{2}} wants to team up with you on Monster Match."
  - `request_accepted`: "{{1}} accepted your request! Open Monster Match to connect."
- [ ] Set up the webhook to receive delivery status and replies
- [ ] Add a user setting: "Notify me on WhatsApp"
- [ ] Handle errors, retries and opt-out (a user replying STOP)

**Important API notes:**
- The access token must **never** be in frontend JS or in Git
- Business-initiated messages outside the 24-hour customer window must use **approved templates**
- Users must **opt in** to receive WhatsApp notifications
- Pricing and rules for the Cloud API change over time, so check Meta's current docs before launch
- If the API is too heavy for your timeline, keep Phase 4's click-to-chat. It is free and needs no approval

**Deliverable:** Automatic WhatsApp alerts for requests and acceptances.

---

### Phase 9: Polish, Testing and Deployment (Week 10)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility: alt text, labels, keyboard navigation, contrast
- [ ] Lighthouse score above 90
- [ ] Cross-browser testing
- [ ] Manual test cases for each flow (see Section 9)
- [ ] Seed realistic demo data
- [ ] Deploy to Netlify or Vercel, and set environment variables
- [ ] Write the final README, with screenshots and a demo video

**Deliverable:** A live, demo-ready product.

---

## 7. Key Implementation Notes

### Search and Filter Logic (concept)
```js
// Fetch students who have ALL selected skills (AND mode)
// 1. Query user_skills where skill_id IN (selected)
// 2. Group by user_id, keep users whose count == selected.length
// 3. Join with users and apply the other filters (year, branch, availability)
// 4. Sort by match score or last_active
```
Use debounce (about 300 ms) on the search input to avoid spamming the DB.

### Call and WhatsApp Links
```html
<a href="tel:+919876543210">📞 Call</a>
<a href="https://wa.me/919876543210?text=Hi%20there%21" target="_blank" rel="noopener">💬 WhatsApp</a>
```
Rules: use the full international number with no `+`, spaces or dashes in `wa.me`, and always URL-encode the text.

### Privacy by Default
- Phone numbers are **hidden by default**
- Shown only after the owner accepts a connection and only if sharing is enabled
- Enforce this in **database policies**, not just in the UI

---

## 8. WhatsApp: Two Approaches Compared

| | Click-to-Chat (`wa.me`) | WhatsApp Business Cloud API |
|---|---|---|
| Cost | Free | Per-conversation pricing after free tier |
| Setup | None | Meta developer account, business verification, templates |
| Sends from | The user's own WhatsApp | Your business number |
| Automation | No, the user presses send | Yes, automatic alerts |
| Backend needed | No | Yes, a secure serverless function |
| Best for | MVP and Phase 4 | Notifications and Phase 8 |

**Recommendation:** Launch with click-to-chat, then add the Cloud API for automated alerts.

---

## 9. Testing Checklist

- [ ] Signup, login and logout work, and protected pages redirect
- [ ] Profile saves skills correctly and the completeness meter updates
- [ ] Each filter works alone and in combination
- [ ] AND vs OR skill matching returns the right results
- [ ] Connection request: send, accept, decline and withdraw
- [ ] Phone and WhatsApp hidden before acceptance
- [ ] Hidden contact details cannot be fetched through direct API calls (RLS test)
- [ ] `tel:` and `wa.me` links open correctly on mobile and desktop
- [ ] WhatsApp API function rejects unauthorized callers
- [ ] Rate limits and block/report work
- [ ] Layout holds at 360 px, 768 px and 1280 px widths
- [ ] No secrets in the repo

---

## 10. Future Enhancements
- AI-powered teammate recommendations from profile text
- Skill assessments and verified badges
- GitHub API integration to auto-import skills from repos
- Calendar integration for availability
- Hackathon organizer portal
- Mobile app (PWA, installable)
- Multi-college communities
- Gamification: badges for completed projects
- Video intro on profiles

---

## 11. Success Metrics
- Number of profiles created
- Connection requests sent and acceptance rate
- Teams formed
- Average time from signup to first connection
- Search-to-request conversion rate

---

## 12. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Phone number misuse or spam | Hide by default, unlock after acceptance, rate limits, report/block |
| WhatsApp template rejection | Submit early, use simple neutral wording |
| Leaked API keys | Server-side secrets only, `.env` in `.gitignore`, rotate if exposed |
| Scope creep | Ship Phases 1 to 4 as the MVP first, then add the rest |
| Slow search with many users | Database indexes, pagination, server-side filtering |
| Empty platform (no users) | Seed demo data, invite classmates, promote through hackathon groups |

---

## 13. MVP Cut (if time is short)
Build only: **Auth → Profile → Explore with filters → Projects → Connect request → Call and WhatsApp click-to-chat.**
This covers every item in the problem statement and still looks polished.

---

*Happy building, and may your team be full of monsters. 👾*
