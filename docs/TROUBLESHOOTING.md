# 🔧 Monster Match: Troubleshooting & FAQs

> Common issues encountered during development, local testing, and judge demonstrations, along with verified fixes.

---

## 1. Browser shows `ERR_ADDRESS_INVALID (-108)` at `http://[::]:3000`

- **Cause:** On Windows, Python's default `http.server` may bind to the IPv6 loopback interface `[::]`, which some internal browser webviews cannot parse.
- **Fix:** Explicitly bind to IPv4 `127.0.0.1`:
  ```powershell
  python -m http.server 3000 --bind 127.0.0.1
  ```
  Then open **`http://localhost:3000`** directly in Chrome or Edge.

---

## 2. Changes in Profile View / Explore Don't Appear After Editing

- **Cause:** Browser aggressive caching of ES6 modules or stale `localStorage` keys.
- **Fix:**
  1. Perform a hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (macOS).
  2. If using mock data, clear `localStorage` key `mm_students` and refresh to reload fresh state.

---

## 3. After Logging Out, Still Seeing Previous User

- **Cause:** Previous session cookie/token was not cleared in mock storage.
- **Fix:** This was resolved in v0.8.0. `logoutUser()` explicitly removes `mm_current_user` and redirects to `login.html`. Ensure you are testing the latest commit.

---

## 4. DiceBear Monster Avatars Fail to Render (Broken Images)

- **Cause:** Offline environment without access to `api.dicebear.com`.
- **Fix:** The app contains fallback inline initials rendering if the external SVG fails to load. Ensure internet connectivity is active during presentation.

---

## 5. WhatsApp Click-to-Chat Doesn't Open Desktop Client

- **Cause:** Browser popup blocker or desktop WhatsApp app not installed.
- **Fix:** The `wa.me` URL automatically falls back to **WhatsApp Web** (`web.whatsapp.com`) if the desktop client protocol is not recognized by the operating system.

---

## 6. Git Push Rejected in Sandbox Environment

- **Cause:** Sandbox terminal runs in standard isolated mode without outbound network access.
- **Fix:** Run git push commands with elevated network bypass permissions (`BypassSandbox: true`).
