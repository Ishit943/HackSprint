# 📡 Monster Match — API Documentation

> **Module:** `js/api.js` — Unified Supabase Data Service
> **Utilities:** `js/utils.js` — Pure helper functions
> **Runtime:** Browser ES6 modules (no bundler / no Node.js)
> **Client:** `@supabase/supabase-js` v2 loaded via CDN

---

## Table of Contents

1. [Setup & Initialization](#setup--initialization)
2. [api.js — Student Functions](#apijs--student-functions)
3. [api.js — Connection Functions](#apijs--connection-functions)
4. [api.js — Project Functions](#apijs--project-functions)
5. [api.js — Profile Functions](#apijs--profile-functions)
6. [utils.js — Utility Functions](#utilsjs--utility-functions)
7. [Error Handling Pattern](#error-handling-pattern)

---

## Setup & Initialization

```js
// js/config.js
export const SUPABASE_URL  = 'https://<project-ref>.supabase.co';
export const SUPABASE_ANON_KEY = '<anon-key>';  // safe for client-side

// js/api.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## api.js — Student Functions

### `getStudents(filters)`

Returns a filtered, scored list of student profiles for the Explore page. Match scores are appended client-side via `calculateMatchScore()`.

**Signature:**
```js
async function getStudents(filters = {}) => Promise<Student[]>
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `filters.skills` | `string[]` | `[]` | Skill names to filter by |
| `filters.skillMode` | `'AND'` \| `'OR'` | `'OR'` | Whether student must have ALL or ANY of the listed skills |
| `filters.year` | `number` \| `null` | `null` | Academic year (1–5) |
| `filters.branch` | `string` \| `null` | `null` | Branch filter (e.g. `"CSE"`) |
| `filters.minAvailability` | `number` | `0` | Minimum weekly hours |
| `filters.sortBy` | `'matchScore'` \| `'name'` \| `'newest'` | `'matchScore'` | Sort order |
| `filters.includeTeamed` | `boolean` | `false` | Whether to include students who already formed a hackathon team (hidden by default to prevent unsolicited contact) |

**Returns:** `Student[]` — array of profile objects with an appended `matchScore` property (0–100).

**Implementation Notes:**
- Fetches profiles with `is_public = true`.
- Joins `student_skills → skills` to enable skill-based filtering.
- For `AND` mode: filters client-side to students who possess **every** listed skill.
- For `OR` mode: Supabase `.contains()` or `.in()` used in the query.
- `matchScore` is computed client-side using `calculateMatchScore()` relative to the logged-in user's profile.

**Example:**
```js
import { getStudents } from './api.js';

// Get students who know React OR Python, sorted by match score
const students = await getStudents({
  skills: ['React', 'Python'],
  skillMode: 'OR',
  year: 3,
  sortBy: 'matchScore'
});

console.log(students[0]);
// {
//   id: "uuid-...",
//   full_name: "Priya Sharma",
//   branch: "CSE",
//   year: 3,
//   availability_hours: 20,
//   student_skills: [{ name: "React", proficiency_level: "advanced" }],
//   matchScore: 87
// }
```

---

### `getStudentById(id)`

Returns a single student's full profile. Appends a `canViewContact` flag based on whether an accepted connection exists between the viewer and this student.

**Signature:**
```js
async function getStudentById(id: string) => Promise<StudentDetail | null>
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | The target student's profile UUID |

**Returns:** `StudentDetail` object with:
- All public profile fields
- `student_skills` array with skill names and levels
- `student_interests` array with interest names
- `canViewContact: boolean` — `true` only if an accepted connection + `whatsapp_visible = true`
- `whatsapp_number` — only populated if `canViewContact` is `true`

**Example:**
```js
import { getStudentById } from './api.js';

const student = await getStudentById('uuid-abc-123');

if (student.canViewContact) {
  console.log('WhatsApp:', student.whatsapp_number);
} else {
  console.log('Connect first to see contact info');
}
```

---

## api.js — Connection Functions

### `getConnections(userId)`

Returns all pending and accepted connections for a given user (both sent and received).

**Signature:**
```js
async function getConnections(userId: string) => Promise<ConnectionList>
```

**Returns:** `ConnectionList` object:
```js
{
  sent: ConnectionRequest[],       // requests this user sent
  received: ConnectionRequest[],   // requests this user received
  accepted: ConnectionRequest[]    // all accepted connections (either direction)
}
```

Each `ConnectionRequest` includes nested `sender` and `receiver` profile objects (name, avatar, branch, year).

**Example:**
```js
import { getConnections } from './api.js';
import { supabase } from './api.js';

const { data: { user } } = await supabase.auth.getUser();
const connections = await getConnections(user.id);

console.log(`You have ${connections.received.length} pending requests`);
connections.accepted.forEach(c => {
  console.log(`Connected with: ${c.receiver.full_name}`);
});
```

---

### `sendConnectionRequest(senderId, receiverId, note)`

Creates a new connection request with a sanitized message note. Fails if a duplicate or rate limit is hit.

**Signature:**
```js
async function sendConnectionRequest(
  senderId: string,
  receiverId: string,
  note: string
) => Promise<{ success: boolean, error?: string }>
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `senderId` | `string` (UUID) | Current logged-in user's ID |
| `receiverId` | `string` (UUID) | Target student's ID |
| `note` | `string` | Optional connection message (will be sanitized via `sanitizeText()`) |

**Behavior:**
- Calls `sanitizeText(note)` before insert.
- Returns `{ success: false, error: 'RATE_LIMIT' }` if the DB trigger fires.
- Returns `{ success: false, error: 'DUPLICATE' }` if a request already exists.
- Returns `{ success: true }` on successful insert.

**Example:**
```js
import { sendConnectionRequest } from './api.js';

const result = await sendConnectionRequest(
  'sender-uuid',
  'receiver-uuid',
  'Hi! I saw your React skills — want to join my MedBot team?'
);

if (!result.success) {
  if (result.error === 'RATE_LIMIT') {
    alert('You have reached the daily limit of 10 connection requests.');
  }
}
```

---

### `updateConnectionStatus(requestId, status)`

Updates the status of an existing connection request. Enforces that only valid transitions are allowed.

**Signature:**
```js
async function updateConnectionStatus(
  requestId: string,
  status: 'accepted' | 'rejected' | 'cancelled'
) => Promise<{ success: boolean, error?: string }>
```

**Valid Transitions:**

| From | To | Who |
|---|---|---|
| `pending` | `accepted` | Receiver |
| `pending` | `rejected` | Receiver |
| `pending` | `cancelled` | Sender |
| `accepted` | `cancelled` | Either party |

**Example:**
```js
import { updateConnectionStatus } from './api.js';

// Receiver accepts a pending request
const result = await updateConnectionStatus('request-uuid-xyz', 'accepted');

if (result.success) {
  // Contact fields are now unlocked in the UI
  console.log('Connection accepted! WhatsApp button is now active.');
}
```

---

### `formTeam({ teammateId, hackathonName, teamName })`

Officially confirms a hackathon team between two connected students. Both users' statuses are set to `'teamed'`, and their profiles are automatically shielded from public view on `pages/explore.html` so they aren't contacted unnecessarily by other students.

**Signature:**
```js
async function formTeam({ teammateId, hackathonName, teamName }) => Promise<Team>
```

---

### `leaveTeam(teammateId)`

Disbands or leaves an active hackathon team, reverting status back to `'open'` and restoring visibility in the Explore directory.

**Signature:**
```js
async function leaveTeam(teammateId?: string) => Promise<boolean>
```

---

## api.js — Project Functions

### `getProjects(filters)`

Returns hackathon projects with their roles and slot availability.

**Signature:**
```js
async function getProjects(filters = {}) => Promise<Project[]>
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `filters.status` | `'open'` \| `'closed'` \| `'completed'` | `'open'` | Project status filter |
| `filters.hackathon` | `string` \| `null` | `null` | Filter by hackathon name |
| `filters.teamLeadId` | `string` \| `null` | `null` | Filter by creator |

**Returns:** Array of projects with nested `project_roles[]` and `team_lead` profile object.

**Example:**
```js
import { getProjects } from './api.js';

const openProjects = await getProjects({ status: 'open' });

openProjects.forEach(project => {
  const openRoles = project.project_roles.filter(
    r => r.slots_filled < r.slots_available
  );
  console.log(`${project.title}: ${openRoles.length} open roles`);
});
```

---

### `createProject(data)`

Creates a new project with one or more roles in a single transaction.

**Signature:**
```js
async function createProject(data: ProjectInput) => Promise<{ id: string } | null>
```

**`ProjectInput` shape:**
```js
{
  title: string,
  description: string,          // will be sanitized
  tech_stack: string[],
  hackathon_name: string,
  deadline: string,             // ISO date string "YYYY-MM-DD"
  max_team_size: number,
  roles: [
    {
      title: string,            // e.g. "Frontend Developer"
      slots_available: number,
      required_skills: string[] // e.g. ["React", "Tailwind CSS"]
    }
  ]
}
```

**Behavior:**
1. Inserts into `projects` with `team_lead_id = auth.uid()`.
2. Bulk-inserts all roles into `project_roles` with the new `project_id`.
3. Returns the created project's `id` on success, or `null` on error.

**Example:**
```js
import { createProject } from './api.js';

const newProject = await createProject({
  title: 'MedBot — AI Health Assistant',
  description: 'A RAG-based health Q&A chatbot built for Runtime Terror.',
  tech_stack: ['React', 'FastAPI', 'LangChain', 'Supabase'],
  hackathon_name: 'Runtime Terror HackSprint 2026',
  deadline: '2026-11-15',
  max_team_size: 4,
  roles: [
    { title: 'Frontend Developer', slots_available: 1, required_skills: ['React', 'Tailwind CSS'] },
    { title: 'ML Engineer', slots_available: 1, required_skills: ['Python', 'LangChain'] }
  ]
});

if (newProject) {
  window.location.href = `/project.html?id=${newProject.id}`;
}
```

---

### `deleteProject(projectId)`

Deletes an existing project created by the logged-in user. Verifies that `currentUser.id === project.owner_id` before deleting from persistent storage.

**Signature:**
```js
async function deleteProject(projectId: string) => Promise<boolean>
```

**Example:**
```js
import { deleteProject } from './api.js';

await deleteProject('proj-123456');
```

---

## api.js — Profile Functions

### `getCurrentUserProfile()`

Returns the full profile of the currently authenticated user, including skills, interests, and the completeness score.

**Signature:**
```js
async function getCurrentUserProfile() => Promise<UserProfile | null>
```

**Returns:** Full `UserProfile` object including:
- All `profiles` fields (including private ones like `whatsapp_number`)
- `student_skills[]` with skill details
- `student_interests[]` with interest details
- `completenessScore: number` (0–100, computed via `calculateProfileCompleteness()`)

**Example:**
```js
import { getCurrentUserProfile } from './api.js';

const profile = await getCurrentUserProfile();

if (!profile) {
  window.location.href = '/login.html';
} else {
  document.getElementById('completeness-bar').style.width =
    `${profile.completenessScore}%`;
}
```

---

### `updateProfile(userId, data)`

Updates one or more profile fields and returns the updated completeness score.

**Signature:**
```js
async function updateProfile(
  userId: string,
  data: Partial<ProfileFields>
) => Promise<{ success: boolean, completenessScore: number }>
```

**`ProfileFields`** (updatable subset):
```js
{
  full_name?: string,
  college?: string,
  branch?: string,
  year?: number,
  bio?: string,                 // sanitized before upsert
  whatsapp_number?: string,
  github_url?: string,
  portfolio_url?: string,
  availability_hours?: number,
  is_public?: boolean,
  whatsapp_visible?: boolean
}
```

**Behavior:**
- Calls `sanitizeText(data.bio)` before upserting.
- After update, re-fetches the full profile and calls `calculateProfileCompleteness()`.
- Returns the new `completenessScore` so the UI can update the meter immediately.

**Example:**
```js
import { updateProfile } from './api.js';

const result = await updateProfile('user-uuid', {
  bio: 'Final year CSE student passionate about AI and open source.',
  availability_hours: 25,
  whatsapp_visible: true
});

console.log(`New profile strength: ${result.completenessScore}%`);
// → "New profile strength: 85%"
```

---

## utils.js — Utility Functions

### `calculateMatchScore(student, currentUser)`

Computes a 0–100 compatibility score between a candidate student and the currently logged-in user. Powers the Matchmaker Agent (`Agent-Match`).

**Signature:**
```js
function calculateMatchScore(student: StudentProfile, currentUser: UserProfile) => number
```

**Scoring Breakdown (100 points total):**

| Component | Max Points | Logic |
|---|---|---|
| Skill Overlap ($S_{\text{skills}}$) | 70 | `(sharedSkills / currentUser.skills.length) × 70` |
| Availability Overlap ($S_{\text{availability}}$) | 15 | Proportional match of weekly hours, capped at 15 |
| Interest Overlap ($S_{\text{interest}}$) | 10 | `(sharedInterests / totalInterests) × 10` |
| Proficiency Bonus ($S_{\text{proficiency}}$) | 5 | +1 per `advanced`-rated shared skill, max 5 |

**Formula:**

$$\text{Match Score} = S_{\text{skills}} + S_{\text{availability}} + S_{\text{interest}} + S_{\text{proficiency}}$$

**Example:**
```js
import { calculateMatchScore } from './utils.js';

const score = calculateMatchScore(candidateStudent, loggedInUser);

console.log(`Compatibility: ${score}%`);
// → "Compatibility: 87%"

// Used internally in getStudents():
const rankedStudents = students
  .map(s => ({ ...s, matchScore: calculateMatchScore(s, currentUser) }))
  .sort((a, b) => b.matchScore - a.matchScore);
```

---

### `formatWhatsAppUrl(phone, studentName)`

Generates a `wa.me` Click-to-Chat URL with a pre-filled, context-aware message. Powers the WhatsApp Dispatcher Agent (`Agent-WhatsApp`) Phase 4 pipeline.

**Signature:**
```js
function formatWhatsAppUrl(phone: string, studentName: string) => string
```

**Behavior:**
1. Strips all non-digit characters from `phone` (removes `+`, spaces, dashes).
2. Constructs the message: `Hi {studentName}, I saw your profile on Monster Match and would love to connect about a project!`
3. URL-encodes the message.
4. Returns: `https://wa.me/{cleanPhone}?text={encodedMessage}`

**Example:**
```js
import { formatWhatsAppUrl } from './utils.js';

const url = formatWhatsAppUrl('+91 98765 43210', 'Priya Sharma');
console.log(url);
// → "https://wa.me/919876543210?text=Hi%20Priya%20Sharma%2C%20I%20saw%20your%20profile..."

// Usage in DOM:
document.getElementById('whatsapp-btn').href = url;
document.getElementById('whatsapp-btn').target = '_blank';
```

---

### `sanitizeText(input)`

Strips HTML tags and encodes dangerous entities to prevent XSS attacks. Called before any user-generated text is inserted into the database.

**Signature:**
```js
function sanitizeText(input: string) => string
```

**Implementation:**
```js
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 1000);  // Hard cap at 1000 chars
}
```

**Called in these contexts:**

| Context | Field | When |
|---|---|---|
| Connection request form | `message_note` | Before `sendConnectionRequest()` |
| Profile edit form | `bio` | Before `updateProfile()` |
| Project creation form | `description` | Before `createProject()` |
| Chat messages *(future)* | `content` | Before message insert |

**Example:**
```js
import { sanitizeText } from './utils.js';

sanitizeText('<script>alert("xss")</script>Hello!');
// → "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;Hello!"

sanitizeText('Normal bio text about React & Node.js');
// → "Normal bio text about React &amp; Node.js"
```

---

### `calculateProfileCompleteness(profile)`

Evaluates a user's profile against the Profile Optimizer Agent (`Agent-Profile`) scoring weights and returns a score from 0–100 with a per-field breakdown.

**Signature:**
```js
function calculateProfileCompleteness(profile: UserProfile) => CompletenessResult
```

**Scoring Weights:**

| Field | Weight | Condition |
|---|---|---|
| `full_name` | 15% | Non-empty string |
| `avatar_url` | 10% | Non-default / explicitly set |
| `college` | 10% | Non-empty string |
| `branch` + `year` | 10% | Both present |
| `bio` | 15% | Length > 20 characters |
| `whatsapp_number` | 15% | Valid phone number present |
| `student_skills` (≥3) | 15% | At least 3 skills added with proficiency |
| `github_url` or `portfolio_url` | 10% | At least one link present |

**Returns `CompletenessResult`:**
```js
{
  score: number,          // 0–100 total
  breakdown: {
    full_name: boolean,
    avatar: boolean,
    college: boolean,
    branchYear: boolean,
    bio: boolean,
    contact: boolean,
    skills: boolean,
    portfolio: boolean
  },
  missing: string[]       // Human-readable suggestions, e.g. ["Add a GitHub link", "Write a bio"]
}
```

**Example:**
```js
import { calculateProfileCompleteness } from './utils.js';

const result = calculateProfileCompleteness(userProfile);

console.log(`Profile strength: ${result.score}%`);
// → "Profile strength: 70%"

console.log('To improve:', result.missing);
// → ["Add your WhatsApp number", "Add 1 more skill to reach minimum 3"]

// Update the UI meter:
document.querySelector('.completeness-fill').style.width = `${result.score}%`;
result.missing.forEach(tip => renderSuggestionBadge(tip));
```

---

## Error Handling Pattern

All `api.js` functions follow a consistent error handling pattern using Supabase's `{ data, error }` destructuring:

```js
export async function someApiFunction(params) {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('column', params.value);

    if (error) {
      console.error('[Monster Match API Error]', error.message);
      return null;  // or { success: false, error: error.message }
    }

    return data;
  } catch (err) {
    console.error('[Monster Match Unexpected Error]', err);
    return null;
  }
}
```

> [!IMPORTANT]
> All API functions return `null` (or `{ success: false }`) on failure rather than throwing. The calling UI code must always null-check the return value before rendering.

> [!TIP]
> Enable Supabase client-side logging during development by opening the browser console. All Supabase errors include a `hint` field that explains RLS policy violations — extremely useful for debugging access control issues.
