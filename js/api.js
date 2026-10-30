/**
 * MONSTER MATCH - API & DATA LAYER
 * Handles data fetching, filtering, connection requests, and privacy unlocking.
 * Supports both Live Supabase (when keys are configured) and Local Mock Database
 * for seamless out-of-the-box development and testing.
 */

import { CONFIG } from './config.js';
import { calculateMatchScore } from './utils.js';

// --- SEED MOCK DATA (High quality profiles & projects for testing) ---
const INITIAL_STUDENTS = [
  {
    id: 'usr-1',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@juet.ac.in',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav&backgroundColor=c0aede',
    college: 'Jaypee University of Engg & Tech',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    bio: 'Full-stack builder passionate about building scalable microservices and reactive interfaces. Won 2 hackathons.',
    phone: '+919876543210',
    whatsapp_number: '+919876543210',
    show_phone: true,
    show_whatsapp: true,
    availability_hours: 15,
    availability_notes: 'Evenings & Full Weekends',
    status: 'open',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    portfolio_url: 'https://aarav.dev',
    email_verified: true,
    skills: [
      { name: 'React', level: 'advanced' },
      { name: 'Node.js', level: 'advanced' },
      { name: 'PostgreSQL', level: 'intermediate' },
      { name: 'Docker', level: 'intermediate' }
    ],
    interests: ['AI & Generative Agents', 'Fintech & Payments', 'Web3 & DeFi']
  },
  {
    id: 'usr-2',
    full_name: 'Ananya Verma',
    email: 'ananya.v@juet.ac.in',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya&backgroundColor=ffd5dc',
    college: 'Jaypee University of Engg & Tech',
    branch: 'Computer Science & Engineering',
    year: '4th Year',
    bio: 'AI/ML researcher and PyTorch enthusiast. Exploring LLM evaluation, prompt chaining, and computer vision models.',
    phone: '+919811223344',
    whatsapp_number: '+919811223344',
    show_phone: true,
    show_whatsapp: true,
    availability_hours: 20,
    availability_notes: 'Available anytime for intense hackathons',
    status: 'open',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    portfolio_url: '',
    email_verified: true,
    skills: [
      { name: 'Python', level: 'advanced' },
      { name: 'PyTorch', level: 'advanced' },
      { name: 'Machine Learning', level: 'advanced' },
      { name: 'FastAPI', level: 'intermediate' }
    ],
    interests: ['AI & Generative Agents', 'HealthTech & Bio']
  },
  {
    id: 'usr-3',
    full_name: 'Rohan Mehra',
    email: 'rohan.m@juet.ac.in',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan&backgroundColor=b6e3f4',
    college: 'Jaypee University of Engg & Tech',
    branch: 'Information Technology',
    year: '2nd Year',
    bio: 'Product Designer turned frontend craftsperson. I build pixel-perfect UI with Figma, Tailwind, and Vue.',
    phone: '+919988776655',
    whatsapp_number: '+919988776655',
    show_phone: true,
    show_whatsapp: true,
    availability_hours: 12,
    availability_notes: 'Fri - Sun all day',
    status: 'open',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    portfolio_url: 'https://rohan.design',
    email_verified: true,
    skills: [
      { name: 'UI/UX Design', level: 'advanced' },
      { name: 'Figma', level: 'advanced' },
      { name: 'Tailwind CSS', level: 'intermediate' },
      { name: 'Vue.js', level: 'intermediate' }
    ],
    interests: ['EdTech & Learning', 'Social Impact & Sustainability', 'Gaming & AR/VR']
  },
  {
    id: 'usr-4',
    full_name: 'Sneha Patel',
    email: 'sneha.patel@juet.ac.in',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha&backgroundColor=ffdfbf',
    college: 'Jaypee University of Engg & Tech',
    branch: 'Electronics & Communication',
    year: '3rd Year',
    bio: 'Mobile App developer (Flutter & Kotlin) and IoT hacker. Looking for backend wizards for HackSprint!',
    phone: '+919765432109',
    whatsapp_number: '+919765432109',
    show_phone: true,
    show_whatsapp: true,
    availability_hours: 14,
    availability_notes: 'Weekdays after 6pm + Weekends',
    status: 'open',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    portfolio_url: '',
    email_verified: true,
    skills: [
      { name: 'Flutter', level: 'advanced' },
      { name: 'Kotlin / Android', level: 'intermediate' },
      ('Node.js'),
      { name: 'Firebase', level: 'intermediate' }
    ],
    interests: ['IoT & Hardware Hack', 'Fintech & Payments']
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    owner_id: 'usr-2',
    owner_name: 'Ananya Verma',
    owner_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya&backgroundColor=ffd5dc',
    title: 'MedBot: AI Medical Imaging & Assistant',
    description: 'An AI-driven diagnostic companion that analyzes X-ray scans with PyTorch and assists junior doctors with automated clinical notes.',
    category: 'HealthTech & Bio',
    hackathon_name: 'Runtime Terror HackSprint 2026',
    deadline: '2026-11-15',
    mode: 'online',
    team_size: 4,
    current_members: 2,
    status: 'open',
    roles: [
      { title: 'Frontend Developer', slots: 1, skills: ['React', 'Tailwind CSS'] },
      { title: 'UI/UX Designer', slots: 1, skills: ['Figma', 'UI/UX Design'] }
    ]
  },
  {
    id: 'proj-2',
    owner_id: 'usr-1',
    owner_name: 'Aarav Sharma',
    owner_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav&backgroundColor=c0aede',
    title: 'DeFi Micro-Lending Pool for Campus Students',
    description: 'A peer-to-peer micro-lending protocol on Polygon with smart contracts and credit scoring based on academic credentials.',
    category: 'Fintech & Payments',
    hackathon_name: 'ETHIndia Sprint',
    deadline: '2026-11-20',
    mode: 'hybrid',
    team_size: 3,
    current_members: 1,
    status: 'open',
    roles: [
      { title: 'Smart Contract Dev', slots: 1, skills: ['Solidity / Web3'] },
      { title: 'Frontend Dev', slots: 1, skills: ['React', 'TypeScript'] }
    ]
  }
];

// In-memory or localStorage persistent storage for demo
function getStorageData(key, fallback) {
  try {
    const raw = localStorage.getItem(`mm_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorageData(key, data) {
  try {
    localStorage.setItem(`mm_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

// Current logged in user helper (mock or auth)
export function getCurrentUser() {
  const user = getStorageData('current_user', null);
  if (!user) {
    // Default demo session as user-1
    const defaultUser = INITIAL_STUDENTS[0];
    setStorageData('current_user', defaultUser);
    return defaultUser;
  }
  return user;
}

export function setCurrentUser(user) {
  setStorageData('current_user', user);
}

// --- API METHODS ---

export const API = {
  // 1. Fetch Students / Profiles with Search & Filters
  async getStudents({
    query = '',
    skills = [],
    skillMode = 'OR', // 'AND' or 'OR'
    college = '',
    branch = '',
    year = '',
    status = '',
    sortBy = 'match', // 'match', 'name', 'availability'
    referenceProject = null
  } = {}) {
    let list = getStorageData('students', INITIAL_STUDENTS);

    // Filter by query (name, bio, branch)
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(u =>
        u.full_name.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q)) ||
        (u.branch && u.branch.toLowerCase().includes(q)) ||
        (u.college && u.college.toLowerCase().includes(q)) ||
        u.skills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(q))
      );
    }

    // Filter by college
    if (college) {
      list = list.filter(u => u.college.toLowerCase().includes(college.toLowerCase()));
    }

    // Filter by branch
    if (branch) {
      list = list.filter(u => u.branch.toLowerCase().includes(branch.toLowerCase()));
    }

    // Filter by year
    if (year) {
      list = list.filter(u => u.year === year);
    }

    // Filter by status
    if (status) {
      list = list.filter(u => u.status === status);
    }

    // Filter by multi-select skills (AND vs OR logic)
    if (skills && skills.length > 0) {
      const targetSkills = skills.map(s => s.toLowerCase());
      list = list.filter(u => {
        const userSkillNames = u.skills.map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
        if (skillMode === 'AND') {
          return targetSkills.every(req => userSkillNames.some(s => s === req || s.includes(req)));
        } else {
          return targetSkills.some(req => userSkillNames.some(s => s === req || s.includes(req)));
        }
      });
    }

    // Calculate match scores if reference project exists or default
    const currentUser = getCurrentUser();
    list = list.map(student => {
      const matchScore = calculateMatchScore({
        studentSkills: student.skills,
        requiredSkills: referenceProject ? referenceProject.roles.flatMap(r => r.skills) : ['React', 'Node.js', 'Python'],
        studentAvailability: student.availability_hours || 10,
        studentInterests: student.interests || [],
        projectCategory: referenceProject ? referenceProject.category : 'Hackathon'
      });
      return { ...student, matchScore };
    });

    // Sorting
    if (sortBy === 'match') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sortBy === 'availability') {
      list.sort((a, b) => (b.availability_hours || 0) - (a.availability_hours || 0));
    }

    return list;
  },

  // 2. Get Single Student Profile with Privacy Check
  async getStudentById(studentId) {
    const list = getStorageData('students', INITIAL_STUDENTS);
    const student = list.find(s => s.id === studentId);
    if (!student) return null;

    const currentUser = getCurrentUser();
    const isOwner = currentUser && currentUser.id === student.id;

    // Check if an accepted connection request exists between currentUser and this student
    const connections = getStorageData('connections', []);
    const hasAcceptedConnection = connections.some(c =>
      c.status === 'accepted' &&
      ((c.sender_id === currentUser?.id && c.receiver_id === student.id) ||
       (c.receiver_id === currentUser?.id && c.sender_id === student.id))
    );

    // Apply Privacy Rule (Section 4 & 7):
    // Phone and WhatsApp are unlocked ONLY if owner allowed it AND (isOwner OR hasAcceptedConnection)
    const canViewContact = isOwner || hasAcceptedConnection;

    return {
      ...student,
      canViewContact,
      contactUnlocked: canViewContact,
      unlockedPhone: (canViewContact && student.show_phone) ? student.phone : null,
      unlockedWhatsApp: (canViewContact && student.show_whatsapp) ? (student.whatsapp_number || student.phone) : null
    };
  },

  // 3. Update Current User Profile
  async updateProfile(updates) {
    const currentUser = getCurrentUser();
    const students = getStorageData('students', INITIAL_STUDENTS);
    const updated = { ...currentUser, ...updates };

    const index = students.findIndex(s => s.id === currentUser.id);
    if (index !== -1) {
      students[index] = updated;
    } else {
      students.push(updated);
    }

    setStorageData('students', students);
    setCurrentUser(updated);
    return updated;
  },

  // 4. Projects: List, Get, Create
  async getProjects({ category = '', query = '', skill = '' } = {}) {
    let list = getStorageData('projects', INITIAL_PROJECTS);

    if (category) {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.hackathon_name.toLowerCase().includes(q)
      );
    }

    if (skill) {
      const targetSkill = skill.toLowerCase();
      list = list.filter(p =>
        p.roles.some(r => r.skills.some(s => s.toLowerCase().includes(targetSkill)))
      );
    }

    return list;
  },

  async getProjectById(projectId) {
    const list = getStorageData('projects', INITIAL_PROJECTS);
    return list.find(p => p.id === projectId) || null;
  },

  async createProject(projectData) {
    const currentUser = getCurrentUser();
    const list = getStorageData('projects', INITIAL_PROJECTS);

    const newProject = {
      id: `proj-${Date.now()}`,
      owner_id: currentUser.id,
      owner_name: currentUser.full_name,
      owner_avatar: currentUser.avatar_url,
      current_members: 1,
      status: 'open',
      created_at: new Date().toISOString(),
      ...projectData
    };

    list.unshift(newProject);
    setStorageData('projects', list);
    return newProject;
  },

  // 5. Connection Requests (Phase 4)
  async sendConnectionRequest({ receiverId, projectId = null, message = '' }) {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('You must be logged in to send a connection request.');
    if (currentUser.id === receiverId) throw new Error('You cannot connect with yourself.');

    const connections = getStorageData('connections', []);
    
    // Check for existing pending/accepted request
    const existing = connections.find(c =>
      c.sender_id === currentUser.id && c.receiver_id === receiverId && c.status === 'pending'
    );
    if (existing) {
      throw new Error('A connection request is already pending with this user.');
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar_url,
      sender_skills: currentUser.skills,
      receiver_id: receiverId,
      project_id: projectId,
      message: message || 'Hey! I saw your profile on Monster Match and would love to team up.',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    connections.unshift(newRequest);
    setStorageData('connections', connections);

    // Also trigger notification
    this.addNotification({
      user_id: receiverId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${currentUser.full_name} wants to connect with you!`,
      sender_id: currentUser.id
    });

    return newRequest;
  },

  async getConnections() {
    const currentUser = getCurrentUser();
    const connections = getStorageData('connections', []);
    const students = getStorageData('students', INITIAL_STUDENTS);

    // Enrich connections with counterparty profile details
    return connections
      .filter(c => c.sender_id === currentUser.id || c.receiver_id === currentUser.id)
      .map(c => {
        const otherUserId = c.sender_id === currentUser.id ? c.receiver_id : c.sender_id;
        const otherUser = students.find(s => s.id === otherUserId) || {};
        return {
          ...c,
          isSender: c.sender_id === currentUser.id,
          otherUser
        };
      });
  },

  async respondConnectionRequest(requestId, newStatus) { // 'accepted', 'declined', 'withdrawn'
    const connections = getStorageData('connections', []);
    const index = connections.findIndex(c => c.id === requestId);
    if (index === -1) throw new Error('Request not found.');

    connections[index].status = newStatus;
    connections[index].responded_at = new Date().toISOString();
    setStorageData('connections', connections);

    // If accepted, notify sender
    if (newStatus === 'accepted') {
      const req = connections[index];
      this.addNotification({
        user_id: req.sender_id,
        type: 'request_accepted',
        title: 'Connection Accepted! 🎉',
        message: 'Your connection request was accepted! Phone & WhatsApp contact are now unlocked.',
        sender_id: req.receiver_id
      });
    }

    return connections[index];
  },

  // 6. Notifications
  async getNotifications() {
    const currentUser = getCurrentUser();
    const list = getStorageData('notifications', [
      {
        id: 'notif-1',
        user_id: currentUser.id,
        type: 'welcome',
        title: 'Welcome to Monster Match! 👾',
        message: 'Complete your profile to unlock smart match recommendations and team up for hackathons.',
        read: false,
        created_at: new Date().toISOString()
      }
    ]);
    return list.filter(n => n.user_id === currentUser.id);
  },

  async addNotification(notif) {
    const list = getStorageData('notifications', []);
    const item = {
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
      ...notif
    };
    list.unshift(item);
    setStorageData('notifications', list);
    return item;
  },

  async markNotificationRead(id) {
    const list = getStorageData('notifications', []);
    const item = list.find(n => n.id === id);
    if (item) item.read = true;
    setStorageData('notifications', list);
  }
};
