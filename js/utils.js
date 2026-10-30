/**
 * MONSTER MATCH - UTILITIES MODULE
 * Common helper functions, theme management, toast notifications,
 * URL builders, match score calculations, and sanitization.
 */

// --- 1. Theme Management (Dark / Light Mode) ---
export function initTheme() {
  const savedTheme = localStorage.getItem('mm_theme') || (
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  return savedTheme;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mm_theme', next);
  updateThemeIcon(next);
  return next;
}

function updateThemeIcon(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

// --- 2. Toast Notifications ---
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: '✅',
    error: '❌',
    info: '👾',
    warning: '⚠️'
  };

  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${iconMap[type] || '👾'}</span>
    <div style="flex: 1; font-weight: 500;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- 3. Security: HTML Sanitization ---
export function escapeHtml(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- 4. Search Debouncer ---
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// --- 5. WhatsApp & Call URL Builders ---
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

export function formatWhatsAppUrl(phone, message = '') {
  const cleanPhone = cleanPhoneNumber(phone);
  if (!cleanPhone) return '#';
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

export function formatTelUrl(phone) {
  const cleanPhone = cleanPhoneNumber(phone);
  if (!cleanPhone) return '#';
  return `tel:+${cleanPhone}`;
}

// --- 6. Smart Match Score Algorithm ---
/**
 * Formula from Phase 5 of roadmap:
 * score = (matched required skills / total required skills) * 70
 *       + availability overlap * 15
 *       + interest overlap * 10
 *       + proficiency bonus * 5
 */
export function calculateMatchScore({
  studentSkills = [],        // Array of { name, level } or string names
  requiredSkills = [],       // Array of string names
  studentAvailability = 10,  // Hours per week
  minHoursRequired = 8,
  studentInterests = [],
  projectCategory = ''
}) {
  if (!requiredSkills || requiredSkills.length === 0) return 85;

  const normalize = (s) => (typeof s === 'string' ? s : s.name || '').toLowerCase().trim();
  const studentSkillNames = studentSkills.map(normalize);
  const requiredSkillNames = requiredSkills.map(normalize);

  // 1. Skill overlap (up to 70 points)
  let matchedCount = 0;
  let proficiencyBonusCount = 0;

  requiredSkillNames.forEach(req => {
    const foundIndex = studentSkillNames.findIndex(s => s === req || s.includes(req) || req.includes(s));
    if (foundIndex !== -1) {
      matchedCount++;
      const userSkill = studentSkills[foundIndex];
      if (typeof userSkill === 'object' && userSkill.level === 'advanced') {
        proficiencyBonusCount += 1;
      } else if (typeof userSkill === 'object' && userSkill.level === 'intermediate') {
        proficiencyBonusCount += 0.5;
      }
    }
  });

  const skillScore = (matchedCount / requiredSkillNames.length) * 70;

  // 2. Availability overlap (up to 15 points)
  const availabilityScore = studentAvailability >= minHoursRequired ? 15 : (studentAvailability / minHoursRequired) * 15;

  // 3. Interest overlap (up to 10 points)
  const interestMatch = studentInterests.some(i => 
    i.toLowerCase().includes(projectCategory.toLowerCase()) || 
    projectCategory.toLowerCase().includes(i.toLowerCase())
  );
  const interestScore = interestMatch ? 10 : 4;

  // 4. Proficiency bonus (up to 5 points)
  const maxBonus = Math.min(5, proficiencyBonusCount * 2.5);

  const total = Math.round(skillScore + availabilityScore + interestScore + maxBonus);
  return Math.min(100, Math.max(10, total));
}

// --- 7. Profile Completeness Meter ---
export function calculateProfileCompleteness(user) {
  if (!user) return 0;
  let score = 0;

  if (user.full_name) score += 15;
  if (user.avatar_url) score += 10;
  if (user.college) score += 10;
  if (user.branch && user.year) score += 10;
  if (user.bio && user.bio.length > 20) score += 15;
  if (user.phone || user.whatsapp_number) score += 15;
  if (user.skills && user.skills.length >= 3) score += 15;
  else if (user.skills && user.skills.length > 0) score += 8;
  if (user.github_url || user.linkedin_url || user.portfolio_url) score += 10;

  return Math.min(100, score);
}

// --- 8. Monster Mascot Avatar Generator ---
export function getMonsterAvatar(seed = 'monster', size = 120) {
  // Uses high-contrast, cute, and responsive DiceBear Bottts monster avatars
  const safeSeed = encodeURIComponent(seed.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${safeSeed}&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

// --- 9. Format Dates ---
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
