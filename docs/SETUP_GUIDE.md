# 🛠️ Monster Match: Local Setup & Developer Guide

> Quickstart guide for setting up and running the Monster Match repository locally on Windows, macOS, or Linux.

---

## 1. Prerequisites

- **Python 3.8+** (recommended for running the built-in HTTP server) OR Node.js / any static web server.
- **Git** installed on your terminal.
- A modern web browser (Google Chrome, Edge, Firefox, or Safari).

---

## 2. Quickstart (Under 2 Minutes)

### Step 1: Clone the Repository
```powershell
git clone https://github.com/Ishit943/HackSprint.git
cd HackSprint
```

### Step 2: Start the Local Development Server
Because Monster Match uses pure ES6 modules without bundling, files must be served over `http://` rather than `file:///`:

```powershell
python -m http.server 3000 --bind 127.0.0.1
```

> **Note on Windows / VS Code:** Always use `--bind 127.0.0.1` to prevent `[::]:3000` IPv6 resolution errors.

### Step 3: Launch in Your Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 3. Demo Persona Credentials

No signup or database configuration is required to test Monster Match! On [`pages/login.html`](../pages/login.html), click any one-click persona button:

1. **Aarav Sharma:** Full-Stack Web Developer (React, Node.js, PostgreSQL)
2. **Ananya Verma:** AI/ML Researcher (Python, PyTorch, Machine Learning)
3. **Rohan Mehra:** UI/UX & Product Designer (Figma, Tailwind CSS, UI/UX)
4. **Sneha Patel:** IoT & Embedded Systems (C++, Arduino, Robotics)
5. **Kabir Joshi:** Web3 & Smart Contracts (Solidity, Ethereum, Ethers.js)
6. **Tanvi Saxena:** Cloud & DevOps Architect (Docker, Kubernetes, AWS, CI/CD)

---

## 4. Resetting Demo State
To restore the mock database to its default factory seed data:
1. Open Developer Tools (`F12`) in your browser.
2. Go to the **Application** or **Storage** tab.
3. Under **Local Storage**, select `http://localhost:3000`.
4. Clear all keys beginning with `mm_`.
5. Refresh the page.
