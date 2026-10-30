/**
 * MONSTER MATCH - AUTHENTICATION MODULE
 * Handles user login, signup, logout, session persistence, and college email verification.
 */

import { getCurrentUser, setCurrentUser, API } from './api.js';
import { showToast, getMonsterAvatar } from './utils.js';

export const Auth = {
  // Check if user is logged in
  isAuthenticated() {
    const user = getCurrentUser();
    return !!user && !!user.id;
  },

  // Get current active user
  getUser() {
    return getCurrentUser();
  },

  // College email domain verification check
  isCollegeEmail(email) {
    if (!email) return false;
    const lower = email.toLowerCase();
    // Recognizes college domains like .ac.in, .edu, juet.ac.in, etc.
    return lower.endsWith('.ac.in') || lower.endsWith('.edu') || lower.includes('college') || lower.includes('juet');
  },

  // Sign up new user
  async signUp({ email, password, full_name, college = 'JUET', branch = 'CSE', year = '3rd Year' }) {
    if (!email || !password || !full_name) {
      throw new Error('Please fill in all required fields.');
    }

    const isVerifiedCollege = this.isCollegeEmail(email);

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      full_name,
      avatar_url: getMonsterAvatar(full_name),
      college: college || 'Jaypee University of Engg & Tech',
      branch: branch || 'Computer Science & Engineering',
      year: year || '3rd Year',
      bio: 'Excited to build awesome hackathon projects with monstrously talented teammates!',
      phone: '',
      whatsapp_number: '',
      show_phone: false,
      show_whatsapp: false,
      availability_hours: 12,
      availability_notes: 'Weekends & Evenings',
      status: 'open',
      github_url: '',
      linkedin_url: '',
      portfolio_url: '',
      email_verified: isVerifiedCollege,
      skills: [
        { name: 'JavaScript', level: 'intermediate' },
        { name: 'HTML5/CSS3', level: 'intermediate' }
      ],
      interests: ['AI & Generative Agents', 'Fintech & Payments']
    };

    setCurrentUser(newUser);

    // Save into students list as well
    await API.updateProfile(newUser);

    showToast(
      isVerifiedCollege 
        ? 'Account created with College Verification badge! 🎓' 
        : 'Account created successfully! Welcome to Monster Match 👾',
      'success'
    );

    return newUser;
  },

  // Sign in existing user
  async signIn(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const students = await API.getStudents();
    const existing = students.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.full_name}! 👾`, 'success');
      return existing;
    }

    // If not found in seed, create login session
    const user = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      avatar_url: getMonsterAvatar(email),
      college: 'Jaypee University of Engg & Tech',
      branch: 'Computer Science',
      year: '3rd Year',
      status: 'open',
      email_verified: this.isCollegeEmail(email),
      skills: [{ name: 'React', level: 'intermediate' }],
      interests: ['AI & Generative Agents']
    };

    setCurrentUser(user);
    showToast(`Signed in as ${user.full_name}! 👾`, 'success');
    return user;
  },

  // Log out
  logout() {
    localStorage.removeItem('mm_current_user');
    showToast('Logged out successfully.', 'info');
    setTimeout(() => {
      window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    }, 500);
  },

  // Update navigation bar with user state
  renderNavAuth() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const user = this.getUser();
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '' : 'pages/';

    // Keep theme toggle button
    const themeBtn = navActions.querySelector('.theme-toggle-btn');
    const themeBtnHtml = themeBtn ? themeBtn.outerHTML : `
      <button class="btn-icon-toggle theme-toggle-btn" id="theme-toggle">🌙</button>
    `;

    if (user && user.full_name) {
      navActions.innerHTML = `
        ${themeBtnHtml}
        <a href="${basePath}dashboard.html" class="nav-link" style="display:flex; align-items:center; gap:8px;">
          <img src="${user.avatar_url || getMonsterAvatar(user.full_name)}" alt="Avatar" style="width:34px; height:34px; border-radius:50%; border:2px solid var(--color-primary);" />
          <span style="font-weight:600; font-size:var(--font-size-sm);">${user.full_name.split(' ')[0]}</span>
        </a>
        <button id="nav-logout-btn" class="btn btn-outline btn-sm">Logout</button>
      `;

      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
      }
    } else {
      navActions.innerHTML = `
        ${themeBtnHtml}
        <a href="${basePath}login.html" class="btn btn-outline btn-sm">Log in</a>
        <a href="${basePath}signup.html" class="btn btn-primary btn-sm">Sign up</a>
      `;
    }

    // Re-attach theme toggle listener
    const newThemeBtn = document.querySelector('.theme-toggle-btn');
    if (newThemeBtn) {
      import('./utils.js').then(({ toggleTheme }) => {
        newThemeBtn.onclick = () => toggleTheme();
      });
    }
  }
};
