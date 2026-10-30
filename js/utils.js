/**
 * MONSTER MATCH - UTILITIES MODULE
 * Common helper functions, theme management, toast notifications,
 * URL builders, match score calculations, and sanitization.
 */

// --- 1. Theme Management (Halloween Spooky Dark / Light Mode) ---
export function initTheme() {
  const savedTheme = localStorage.getItem('mm_theme') || 'dark';
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

// --- 6. Smart Match Score & Teammate Compatibility Algorithm ---

// Technical domains for calculating complementary teammate synergy
export const SKILL_DOMAINS = {
  frontend: ['react', 'vue.js', 'vue', 'next.js', 'html5/css3', 'html', 'css', 'tailwind css', 'tailwind', 'javascript', 'typescript', 'frontend'],
  backend: ['node.js', 'node', 'fastapi', 'django', 'python', 'go (golang)', 'go', 'express', 'backend', 'rest api', 'microservices', 'graphql'],
  database_devops: ['postgresql', 'postgres', 'docker', 'kubernetes', 'aws', 'ci/cd', 'cloud', 'devops', 'firebase', 'mongodb', 'sql'],
  ai_ml: ['pytorch', 'machine learning', 'ai/ml', 'deep learning', 'pandas', 'numpy', 'tensorflow', 'llm', 'computer vision', 'nlp'],
  design_uiux: ['ui/ux design', 'ui/ux', 'figma', 'product design', 'wireframing', 'design', 'prototyping'],
  web3: ['solidity / web3', 'solidity', 'web3', 'ethereum', 'smart contracts', 'ethers.js', 'blockchain'],
  mobile_iot: ['flutter', 'kotlin / android', 'kotlin', 'android', 'c++', 'arduino', 'robotics', 'iot', 'embedded']
};

export function getSkillDomains(skills = []) {
  const normalize = (s) => (typeof s === 'string' ? s : s.name || '').toLowerCase().trim();
  const names = skills.map(normalize);
  const matchedDomains = new Set();
  
  for (const [domain, domainSkills] of Object.entries(SKILL_DOMAINS)) {
    if (names.some(name => domainSkills.some(ds => ds === name || name.includes(ds) || ds.includes(name)))) {
      matchedDomains.add(domain);
    }
  }
  return matchedDomains;
}

/**
 * Calculates dynamic compatibility between two students or between a student and search filters / project.
 * What it signifies:
 * - When activeFilterSkills are selected: how accurately the candidate matches the searched skills.
 * - When comparing two teammates: complementary skill coverage (filling gaps), shared tech foundation,
 *   alignment in hackathon interest domains, availability overlap, and proficiency tiers.
 */
export function calculateTeammateCompatibility({
  student,
  currentUser = null,
  activeFilterSkills = [],
  referenceProject = null
}) {
  if (!student) return { score: 50, reason: 'Candidate profile' };
  
  // If viewing self, compatibility is 100%
  if (currentUser && currentUser.id === student.id) {
    return { score: 100, reason: 'This is you!' };
  }

  const normalize = (s) => (typeof s === 'string' ? s : s.name || '').toLowerCase().trim();
  const studentSkillNames = (student.skills || []).map(normalize);

  // CASE 1: Project Role Requirements given
  if (referenceProject && referenceProject.roles) {
    const requiredSkills = referenceProject.roles.flatMap(r => r.skills || []).map(normalize);
    if (requiredSkills.length === 0) return { score: 85, reason: 'General project fit' };

    let matched = 0;
    let bonus = 0;
    requiredSkills.forEach(req => {
      const idx = studentSkillNames.findIndex(s => s === req || s.includes(req) || req.includes(s));
      if (idx !== -1) {
        matched++;
        const sk = student.skills[idx];
        if (typeof sk === 'object' && sk.level === 'advanced') bonus += 2.5;
        else if (typeof sk === 'object' && sk.level === 'intermediate') bonus += 1.25;
      }
    });

    const skillScore = (matched / requiredSkills.length) * 70;
    const availScore = (student.availability_hours || 10) >= 10 ? 15 : ((student.availability_hours || 10) / 10) * 15;
    const interestMatch = (student.interests || []).some(i => 
      referenceProject.category && i.toLowerCase().includes(referenceProject.category.toLowerCase())
    );
    const score = Math.round(Math.min(100, Math.max(15, skillScore + availScore + (interestMatch ? 10 : 4) + Math.min(5, bonus))));
    return { score, reason: `Matches ${matched} of ${requiredSkills.length} project skills` };
  }

  // CASE 2: User is actively searching/filtering for specific skills on the Explore page
  if (activeFilterSkills && activeFilterSkills.length > 0) {
    const filterNames = activeFilterSkills.map(s => s.toLowerCase().trim());
    let matchedCount = 0;
    let proficiencyBonus = 0;

    filterNames.forEach(req => {
      const idx = studentSkillNames.findIndex(s => s === req || s.includes(req) || req.includes(s));
      if (idx !== -1) {
        matchedCount++;
        const sk = student.skills[idx];
        if (typeof sk === 'object' && sk.level === 'advanced') proficiencyBonus += 4;
        else if (typeof sk === 'object' && sk.level === 'intermediate') proficiencyBonus += 2;
      }
    });

    const skillRatio = matchedCount / filterNames.length;
    const skillScore = skillRatio * 70;
    const availScore = Math.min(15, ((student.availability_hours || 10) / 15) * 15);
    const bonus = Math.min(10, proficiencyBonus);
    const baseInterest = 5;

    const score = Math.round(Math.min(100, Math.max(10, skillScore + availScore + bonus + baseInterest)));
    return {
      score,
      reason: `Matches ${matchedCount} of ${filterNames.length} filtered skills (${Math.round(skillRatio * 100)}% match)`
    };
  }

  // CASE 3: Peer Teammate Synergy (Evaluating student against currentUser's skills & gaps)
  if (currentUser && currentUser.skills) {
    const userSkillNames = currentUser.skills.map(normalize);
    const userDomains = getSkillDomains(currentUser.skills);
    const studentDomains = getSkillDomains(student.skills);

    // 1. Complementary Skill Coverage (up to 30 pts)
    // Does candidate cover areas the user lacks (e.g. Designer for a Coder, ML for a Frontend dev)?
    let complementaryCount = 0;
    studentDomains.forEach(domain => {
      if (!userDomains.has(domain)) complementaryCount++;
    });
    const complementaryScore = complementaryCount >= 2 ? 30 : (complementaryCount === 1 ? 22 : 12);

    // 2. Shared Tech Foundation & Collaboration Alignment (up to 25 pts)
    // Can they code together on a shared stack?
    let sharedDirectSkills = 0;
    studentSkillNames.forEach(ss => {
      if (userSkillNames.some(us => us === ss || us.includes(ss) || ss.includes(us))) {
        sharedDirectSkills++;
      }
    });
    const sharedDomainOverlap = [...studentDomains].filter(d => userDomains.has(d)).length;
    const collaborationScore = sharedDirectSkills >= 2 ? 25 : (sharedDirectSkills === 1 ? 20 : (sharedDomainOverlap > 0 ? 15 : 8));

    // 3. Shared Hackathon Domain Interests (up to 20 pts)
    const userInterests = (currentUser.interests || []).map(i => i.toLowerCase().trim());
    const studentInterests = (student.interests || []).map(i => i.toLowerCase().trim());
    let sharedInterestsCount = 0;
    studentInterests.forEach(si => {
      if (userInterests.some(ui => ui === si || ui.includes(si) || si.includes(ui))) {
        sharedInterestsCount++;
      }
    });
    const interestScore = sharedInterestsCount >= 2 ? 20 : (sharedInterestsCount === 1 ? 14 : 6);

    // 4. Availability Alignment (up to 15 pts)
    const userHours = currentUser.availability_hours || 15;
    const studentHours = student.availability_hours || 15;
    const hourDiff = Math.abs(userHours - studentHours);
    const availabilityScore = hourDiff <= 3 ? 15 : (hourDiff <= 6 ? 11 : 6);

    // 5. Proficiency Bonus (up to 10 pts)
    let proficiencyBonus = 0;
    (student.skills || []).forEach(sk => {
      if (typeof sk === 'object') {
        if (sk.level === 'advanced') proficiencyBonus += 3.5;
        else if (sk.level === 'intermediate') proficiencyBonus += 1.75;
      }
    });
    const bonusScore = Math.min(10, proficiencyBonus);

    const total = Math.round(Math.min(98, Math.max(25, complementaryScore + collaborationScore + interestScore + availabilityScore + bonusScore)));

    let reason = 'Balanced teammate match';
    if (complementaryCount > 0 && sharedDirectSkills > 0) {
      reason = `Synergy: adds ${[...studentDomains].filter(d => !userDomains.has(d)).map(d => d.replace('_', ' ')).slice(0, 1)} + shared stack`;
    } else if (complementaryCount > 0) {
      const newDomains = [...studentDomains].filter(d => !userDomains.has(d)).map(d => d.replace('_', ' '));
      reason = `Complementary: adds ${newDomains.slice(0, 2).join(' & ')}`;
    } else if (sharedDirectSkills > 0) {
      reason = `Shared stack collaborator (${sharedDirectSkills} overlapping skill${sharedDirectSkills > 1 ? 's' : ''})`;
    } else if (sharedInterestsCount > 0) {
      reason = `Aligned on hackathon track interests`;
    }

    return { score: total, reason };
  }

  // Fallback if no user is logged in
  const baseScore = Math.round(Math.min(90, Math.max(30, 45 + (student.skills?.length || 0) * 8)));
  return { score: baseScore, reason: 'General compatibility' };
}

/**
 * Backward compatible helper that returns an integer match score.
 */
export function calculateMatchScore({
  studentSkills = [],
  requiredSkills = [],
  studentAvailability = 10,
  minHoursRequired = 8,
  studentInterests = [],
  projectCategory = '',
  currentUser = null,
  activeFilterSkills = []
}) {
  // If requiredSkills or activeFilterSkills provided, evaluate match
  const targetSkills = requiredSkills.length > 0 ? requiredSkills : activeFilterSkills;
  
  if (targetSkills.length > 0) {
    const res = calculateTeammateCompatibility({
      student: { skills: studentSkills, availability_hours: studentAvailability, interests: studentInterests },
      activeFilterSkills: targetSkills
    });
    return res.score;
  }

  if (currentUser) {
    const res = calculateTeammateCompatibility({
      student: { skills: studentSkills, availability_hours: studentAvailability, interests: studentInterests },
      currentUser
    });
    return res.score;
  }

  // Legacy calculation
  const normalize = (s) => (typeof s === 'string' ? s : s.name || '').toLowerCase().trim();
  const studentSkillNames = studentSkills.map(normalize);
  const requiredSkillNames = requiredSkills.map(normalize);

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

  const skillScore = requiredSkillNames.length > 0 ? (matchedCount / requiredSkillNames.length) * 70 : 50;
  const availabilityScore = studentAvailability >= minHoursRequired ? 15 : (studentAvailability / minHoursRequired) * 15;
  const interestMatch = studentInterests.some(i => 
    i.toLowerCase().includes(projectCategory.toLowerCase()) || 
    projectCategory.toLowerCase().includes(i.toLowerCase())
  );
  const interestScore = interestMatch ? 10 : 4;
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
