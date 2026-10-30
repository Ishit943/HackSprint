# 🚀 Monster Match: Deployment & Hosting Guide

> Step-by-step instructions for deploying Monster Match to production environments, configuring Supabase, and hosting static assets.

---

## 1. Hosting Architecture Overview

Monster Match consists of:
- **Client (Frontend):** 100% static assets (HTML, CSS, ES6 JS, images) with zero build tools.
- **Backend (Database & Auth):** Managed Supabase PostgreSQL with Row Level Security.
- **Edge Functions:** Supabase Edge Functions (Deno runtime) for serverless integrations.

---

## 2. Option A: Vercel Deployment (Recommended)

1. Fork or push your code to GitHub (`https://github.com/Ishit943/HackSprint`).
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In **Project Settings**:
   - **Framework Preset:** `Other` (No build system)
   - **Root Directory:** `./`
   - **Build Command:** *(Leave empty)*
   - **Output Directory:** `./`
5. Click **Deploy**. Vercel will instantly generate a live HTTPS URL.

---

## 3. Option B: Netlify Deployment

1. Log in to [Netlify](https://netlify.com) and select **Add new site** > **Import an existing project**.
2. Connect your GitHub repository.
3. Configure build settings:
   - **Base directory:** *(Leave blank)*
   - **Build command:** *(Leave blank)*
   - **Publish directory:** `.`
4. Click **Deploy Monster Match**.

Alternatively, drag and drop the project folder directly into the Netlify Web App dashboard.

---

## 4. Option C: GitHub Pages Deployment

1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / folder: `/ (root)`
3. Save. The platform will be live at `https://<username>.github.io/<repo>/`.

---

## 5. Supabase Production Configuration

To link your live Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the entire contents of [`sql/schema.sql`](../sql/schema.sql).
4. Go to **Project Settings** > **API**.
5. Copy your **Project URL** and **anon public key**.
6. Update [`js/config.js`](../js/config.js) or set environment variables:
   ```javascript
   export const SUPABASE_URL = 'https://your-project.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1Ni...';
   ```
7. *(Optional)* Deploy the WhatsApp edge function:
   ```powershell
   supabase functions deploy send-whatsapp
   supabase secrets set WHATSAPP_ACCESS_TOKEN="your_token"
   ```

---

## 6. Pre-Submission Production Checklist

- [x] All relative script imports use `../js/` or `./js/` with exact case.
- [x] Halloween dark theme verified on mobile and desktop.
- [x] Local storage mock fallback tested with 6 student personas.
- [x] No sensitive secrets (service role keys) committed to public repository.
- [x] WhatsApp click-to-chat links verified with international country code formatting.
- [x] Email addresses shown correctly in profile-view, connections, explore, and dashboard after mutual acceptance.
- [x] Teamed students hidden from Explore directory (Hackathon Privacy Shield active).
- [x] Project delete button visible only to project owner with confirmation safeguard.
- [x] CI pipeline passing: Validate HTML Files ✅, Secrets Lint Check ✅, Verify File Structure ✅.

---

## 7. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Ishit943/HackSprint.git
cd HackSprint

# Serve locally (Python built-in server — zero install required)
python -m http.server 3000 --bind 127.0.0.1

# Open in browser
# http://localhost:3000
```

Use the **6 demo persona buttons** on the login page for instant access — no Supabase setup needed for local testing. All data is stored in `localStorage` automatically.

---

## 8. Automatic Vercel Deployment (Already Live)

The project is connected to Vercel via the `Ishit943/HackSprint` GitHub repository. Every push to the `main` branch automatically triggers a new Vercel deployment — no manual action required.

To check deployment status:
1. Go to [github.com/Ishit943/HackSprint/actions](https://github.com/Ishit943/HackSprint/actions) — CI pipeline results
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) — live deployment URL and logs
