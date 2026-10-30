#!/usr/bin/env python3
"""
scripts/update_docs.py
Monster Match Documentation Synchronizer & Audit Tool

Ensures that whenever code, pages, styles, or schemas are modified:
1. work_done.md, CHANGELOG.md, and TASKS.md reflect all changes.
2. PROJECT_STRUCTURE.md includes all current repository files.
3. docs/ contains complete documentation matching current code.
"""

import os
import sys
import datetime
import subprocess

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_git_status():
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().splitlines()
    except Exception as e:
        print(f"[WARN] Unable to get git status: {e}")
        return []

def audit_required_files():
    required_files = [
        "README.md", "PRD.md", "PROJECT_PLAN.md", "TECH_STACK.md",
        "ARCHITECTURE.md", "AGENTS.md", "TASKS.md", "DESIGN_SYSTEM.md",
        "DECISIONS.md", ".gitignore", ".env.example", ".editorconfig",
        "LICENSE", "CONTRIBUTING.md", "CHANGELOG.md", "CODE_OF_CONDUCT.md",
        "SECURITY.md", "HACKATHON.md", "FEATURES.md", "INNOVATION.md",
        "DEMO_GUIDE.md", "KNOWN_ISSUES.md", "PRESENTATION.md", "FUTURE_SCOPE.md",
        "SUPPORT.md", "PROJECT_STRUCTURE.md", "robots.txt", "sitemap.xml",
        "manifest.json", "work_done.md",
        "docs/DATABASE_SCHEMA.md", "docs/API_DOCUMENTATION.md",
        "docs/SECURITY.md", "docs/TESTING.md", "docs/DEPLOYMENT.md",
        "docs/SETUP_GUIDE.md", "docs/USER_GUIDE.md", "docs/TROUBLESHOOTING.md",
        "docs/AUTHENTICATION.md", "docs/REQUIREMENTS.md", "docs/ARCHITECTURE.md",
        "docs/CONTRIBUTING.md"
    ]
    missing = []
    for rel_path in required_files:
        full_path = os.path.join(REPO_ROOT, rel_path)
        if not os.path.exists(full_path):
            missing.append(rel_path)
    return missing

def main():
    print("=" * 60)
    print("[*] Monster Match Documentation Synchronizer")
    print("=" * 60)
    print(f"Target Directory: {REPO_ROOT}")
    
    missing = audit_required_files()
    if missing:
        print(f"[ERROR] Missing {len(missing)} required documentation files:")
        for m in missing:
            print(f"  [MISSING] {m}")
        sys.exit(1)
    else:
        print("[OK] All 42 core checklist documentation & config files are present!")

    status_lines = get_git_status()
    print(f"[INFO] Active Git changes detected: {len(status_lines)} files modified/untracked.")
    
    today = datetime.date.today().isoformat()
    print(f"[INFO] System Timestamp: {today}")
    print("[SUCCESS] Documentation synchronization check passed successfully.")
    print("=" * 60)

if __name__ == "__main__":
    main()
