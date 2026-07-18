import { create } from 'zustand';
import axios from 'axios';
import { 
  User, Organization, Opportunity, Application, Event, Donation, Certificate, Notification, Badge, AvatarConfig 
} from '../types';

// Axios client configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to automatically attach JWT authorization headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('greenbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Default badges
const DEFAULT_BADGES: Badge[] = [
  { id: '1', name: 'First Step', description: 'Completed first activity.', icon: '🌱', xpReward: 150 },
  { id: '2', name: 'Kind Heart', description: 'Made your first donation.', icon: '❤️', xpReward: 75 },
  { id: '3', name: 'Tree Guardian', description: 'Joined a plantation drive.', icon: '🌳', xpReward: 150 },
  { id: '4', name: 'Education Hero', description: 'Participated in education programs.', icon: '📚', xpReward: 100 },
  { id: '5', name: 'Life Saver', description: 'Participated in blood donation.', icon: '🩸', xpReward: 200 },
  { id: '6', name: 'Community Builder', description: 'Completed 10 activities.', icon: '🤝', xpReward: 500 },
];

const LEVEL_NAMES = [
  'Community Beginner',
  'Helping Hand',
  'Volunteer Explorer',
  'Community Builder',
  'Change Maker',
  'Green Guardian',
  'Bridge Builder',
  'Impact Leader',
  'Community Champion',
  'Legacy Creator'
];

interface AuthState {
  // Authentication & Session
  currentUser: User | null;
  currentOrg: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Collections
  users: User[];
  organizations: Organization[];
  opportunities: Opportunity[];
  applications: Application[];
  events: Event[];
  donations: Donation[];
  certificates: Certificate[];
  notifications: Notification[];
  badges: Badge[];
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  
  // Organization Actions
  registerOrganization: (orgData: Omit<Organization, 'id' | 'ownerId' | 'verificationStatus' | 'createdAt'>) => Promise<Organization>;
  adminApproveOrg: (orgId: string) => Promise<void>;
  adminRejectOrg: (orgId: string) => Promise<void>;
  createOpportunity: (oppData: Omit<Opportunity, 'id' | 'organizationId' | 'organizationName' | 'status' | 'applicantsCount'>) => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'organizationId' | 'organizationName' | 'registeredUsers'>) => Promise<void>;
  
  // Volunteer & Event Actions
  applyForOpportunity: (oppId: string, notes?: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  
  // Donation Actions
  uploadDonation: (donationData: Omit<Donation, 'id' | 'ownerId' | 'ownerName' | 'status' | 'createdAt'>) => Promise<void>;
  requestDonation: (donationId: string) => Promise<void>;
  adminDeleteDonation: (donationId: string) => Promise<void>;
  
  // System Actions
  addXP: (amount: number, reason: string) => Promise<void>;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'alert') => void;
  markNotificationsAsRead: () => Promise<void>;
}

// Read initial state from localStorage or load defaults
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`greenbridge_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalStorage = (key: string, data: any) => {
  localStorage.setItem(`greenbridge_${key}`, JSON.stringify(data));
};

const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Admin Moderator',
    email: 'admin@greenbridge.org',
    city: 'Dehradun',
    state: 'Uttarakhand',
    avatar: { hair: 'style-2', eyes: 'neutral', skin: '#FAD7A0', clothing: '#1B4332', accessory: 'tshirt-badge' },
    level: 10,
    xp: 9999,
    badges: ['1', '2', '3', '4', '5', '6'],
    interests: ['Environment', 'Education', 'Health'],
    availability: 'Flexible',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-sonaa',
    name: 'Sonaa Dobriyal',
    email: 'sonaa@gmail.com',
    city: 'Dehradun',
    state: 'Uttarakhand',
    avatar: { hair: 'style-1', eyes: 'happy', skin: '#F5CBA7', clothing: '#2E7D32', accessory: 'plant-leaf' },
    level: 2,
    xp: 320,
    badges: ['1', '3'],
    interests: ['Environment', 'Education'],
    availability: 'Weekends',
    role: 'USER',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ORGS: Organization[] = [
  {
    id: 'org-hope',
    ownerId: 'usr-admin',
    organizationName: 'Hope Foundation',
    description: 'Providing quality education and resources to underprivileged children in Dehradun.',
    mission: 'To eliminate literacy gaps in remote communities.',
    category: 'Education',
    website: 'https://hopefoundation.org',
    phone: '+91 9876543210',
    logo: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=150&auto=format&fit=crop&q=60',
    verificationStatus: 'APPROVED',
    registrationCertificate: 'hope_cert.pdf',
    createdAt: new Date().toISOString()
  },
  {
    id: 'org-eco',
    ownerId: 'usr-sonaa',
    organizationName: 'Eco Warriors Dehradun',
    description: 'A community club focused on afforestation, clean rivers, and zero waste management in Uttarakhand.',
    mission: 'Re-greening the valley one tree at a time.',
    category: 'Environment',
    website: 'https://ecowarriorsddn.org',
    phone: '+91 9876501234',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60',
    verificationStatus: 'PENDING',
    registrationCertificate: 'eco_warriors_cert.pdf',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    organizationId: 'org-eco',
    organizationName: 'Eco Warriors Dehradun',
    organizationLogo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60',
    title: 'Mussorie Road Tree Plantation Drive',
    description: 'Join us this Saturday for planting 100 native saplings along the Mussoorie Road to prevent soil erosion and expand green cover. Equipment, gloves, and refreshments will be provided. Wear comfortable outdoor clothes.',
    category: 'Environment',
    location: 'Mussoorie Diversion, Dehradun',
    date: '2026-07-12',
    time: '08:00 AM',
    duration: '4 Hours',
    skillsRequired: ['Physical Stamina', 'Teamwork'],
    volunteerLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60',
    status: 'OPEN',
    applicantsCount: 14
  },
  {
    id: 'opp-2',
    organizationId: 'org-hope',
    organizationName: 'Hope Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=150&auto=format&fit=crop&q=60',
    title: 'Weekend Math Tutor for Kids',
    description: 'We are seeking passionate individuals to help children (grades 5-8) clear their math concepts. Classes are conducted at our community library in Karanpur on Saturday afternoons.',
    category: 'Education',
    location: 'Karanpur Community Center, Dehradun',
    date: '2026-07-18',
    time: '02:00 PM',
    duration: '3 Hours',
    skillsRequired: ['Mathematics Teaching', 'Patience', 'Communication'],
    volunteerLimit: 8,
    coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60',
    status: 'OPEN',
    applicantsCount: 3
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-1',
    organizationId: 'org-eco',
    organizationName: 'Eco Warriors Dehradun',
    title: 'Robbers Cave Clean-up Camp',
    description: 'A clean-up drive inside Guchhupani (Robbers Cave) to clear plastic waste left by tourists. Let’s clean the water streams together!',
    banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60',
    date: '2026-07-15',
    time: '07:30 AM',
    location: 'Robbers Cave Entrance, Dehradun',
    capacity: 50,
    registeredUsers: ['usr-sonaa'],
    category: 'Environment'
  }
];

const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    ownerId: 'usr-sonaa',
    ownerName: 'Sonaa Dobriyal',
    title: 'Grade 10 ICSE Science Books',
    description: 'Set of physics, chemistry, and biology textbooks in excellent condition. Perfect for self-studying students.',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=60'],
    category: 'Books',
    condition: 'Like New',
    location: 'Dalanwala, Dehradun',
    status: 'AVAILABLE',
    createdAt: new Date().toISOString()
  }
];

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: getLocalStorage<User | null>('currentUser', null),
  currentOrg: getLocalStorage<Organization | null>('currentOrg', null),
  isAuthenticated: getLocalStorage<boolean>('isAuthenticated', false),
  isLoading: false,

  users: getLocalStorage<User[]>('users', INITIAL_USERS),
  organizations: getLocalStorage<Organization[]>('organizations', INITIAL_ORGS),
  opportunities: getLocalStorage<Opportunity[]>('opportunities', INITIAL_OPPORTUNITIES),
  applications: getLocalStorage<Application[]>('applications', []),
  events: getLocalStorage<Event[]>('events', INITIAL_EVENTS),
  donations: getLocalStorage<Donation[]>('donations', INITIAL_DONATIONS),
  certificates: getLocalStorage<Certificate[]>('certificates', []),
  notifications: getLocalStorage<Notification[]>('notifications', []),
  badges: DEFAULT_BADGES,

  initialize: async () => {
    try {
      const token = localStorage.getItem('greenbridge_token');
      if (token) {
        set({ isLoading: true });
        
        // Fetch current user details
        const profileRes = await api.get('/auth/profile');
        const user = profileRes.data;
        
        let org = null;
        if (user.role === 'ORGANIZATION') {
          const orgsRes = await api.get('/organizations');
          org = orgsRes.data.find((o: any) => o.ownerId === user.id) || null;
        }

        // Fetch collections from server
        const [oppsRes, evtsRes, donsRes, certsRes, notifsRes] = await Promise.all([
          api.get('/opportunities'),
          api.get('/events'),
          api.get('/donations'),
          api.get('/certificates').catch(() => ({ data: [] })),
          api.get('/notifications').catch(() => ({ data: [] })),
        ]);

        setLocalStorage('currentUser', user);
        setLocalStorage('currentOrg', org);
        setLocalStorage('isAuthenticated', true);

        set({
          currentUser: user,
          currentOrg: org,
          isAuthenticated: true,
          opportunities: oppsRes.data,
          events: evtsRes.data,
          donations: donsRes.data,
          certificates: certsRes.data,
          notifications: notifsRes.data,
          isLoading: false,
        });
      } else {
        // Fetch public lists even when logged out
        const [oppsRes, evtsRes, donsRes] = await Promise.all([
          api.get('/opportunities'),
          api.get('/events'),
          api.get('/donations'),
        ]);
        set({
          opportunities: oppsRes.data,
          events: evtsRes.data,
          donations: donsRes.data,
        });
      }
    } catch (err) {
      console.warn('Backend API offline, running fully in local simulation mode.', err);
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // 1. Try backend authentication
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user, organization } = res.data;
      
      localStorage.setItem('greenbridge_token', accessToken);
      setLocalStorage('currentUser', user);
      setLocalStorage('currentOrg', organization);
      setLocalStorage('isAuthenticated', true);

      set({
        currentUser: user,
        currentOrg: organization,
        isAuthenticated: true,
        isLoading: false
      });

      // Synchronize list values from backend
      try {
        const [oppsRes, evtsRes, donsRes, certsRes, notifsRes] = await Promise.all([
          api.get('/opportunities'),
          api.get('/events'),
          api.get('/donations'),
          api.get('/certificates').catch(() => ({ data: [] })),
          api.get('/notifications').catch(() => ({ data: [] })),
        ]);
        set({
          opportunities: oppsRes.data,
          events: evtsRes.data,
          donations: donsRes.data,
          certificates: certsRes.data,
          notifications: notifsRes.data
        });
      } catch (e) {
        console.warn('Backend data sync failed post-login.', e);
      }

      get().addNotification(
        'Welcome Back! 🌱',
        `Hello ${user.name}, ready to make a difference today?`,
        'success'
      );

      return user;
    } catch (apiErr: any) {
      console.warn('Backend login failed, using local fallback.', apiErr);
      
      // 2. Client fallback logic (Mock database)
      const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || (email.includes('sonaa') && password !== 'sonaa123' && password !== 'password') || (email.includes('admin') && password !== 'admin123' && password !== 'password')) {
        set({ isLoading: false });
        throw new Error(apiErr.response?.data?.message || 'Invalid email or password.');
      }
      
      let org = null;
      if (user.role === 'ORGANIZATION') {
        org = get().organizations.find(o => o.ownerId === user.id) || null;
      }

      setLocalStorage('currentUser', user);
      setLocalStorage('currentOrg', org);
      setLocalStorage('isAuthenticated', true);

      set({ 
        currentUser: user, 
        currentOrg: org,
        isAuthenticated: true, 
        isLoading: false 
      });

      get().addNotification(
        'Welcome Back (Offline Mode)! 🌱',
        `Hello ${user.name}, currently running offline.`,
        'success'
      );

      return user;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      // 1. Try Backend Registration
      const res = await api.post('/auth/register', userData);
      const user = res.data;
      
      set({ isLoading: false });
      
      // Auto login after registration
      return get().login(userData.email || '', userData.password || '');
    } catch (apiErr: any) {
      console.warn('Backend registration failed, using local fallback.', apiErr);
      
      // 2. Client Fallback (Mock DB)
      const existing = get().users.find(u => u.email.toLowerCase() === userData.email?.toLowerCase());
      if (existing) {
        set({ isLoading: false });
        throw new Error('Email address already registered.');
      }

      const defaultAvatar: AvatarConfig = {
        hair: 'style-1',
        eyes: 'happy',
        skin: '#F5CBA7',
        clothing: '#2E7D32',
        accessory: 'none'
      };

      const newUser: User = {
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name || 'Anonymous Partner',
        email: userData.email || '',
        city: userData.city || 'Dehradun',
        state: userData.state || 'Uttarakhand',
        avatar: userData.avatar || defaultAvatar,
        level: 1,
        xp: 0,
        badges: [],
        interests: userData.interests || [],
        availability: userData.availability || 'Flexible',
        role: 'USER',
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...get().users, newUser];
      setLocalStorage('users', updatedUsers);
      setLocalStorage('currentUser', newUser);
      setLocalStorage('isAuthenticated', true);

      set({ 
        users: updatedUsers,
        currentUser: newUser,
        currentOrg: null,
        isAuthenticated: true,
        isLoading: false 
      });

      get().addNotification(
        'Welcome to GreenBridge! 🌱',
        'Start exploring volunteering opportunities and help make our community stronger.',
        'info'
      );

      return newUser;
    }
  },

  logout: () => {
    localStorage.removeItem('greenbridge_token');
    localStorage.removeItem('greenbridge_currentUser');
    localStorage.removeItem('greenbridge_currentOrg');
    localStorage.removeItem('greenbridge_isAuthenticated');
    set({ 
      currentUser: null, 
      currentOrg: null, 
      isAuthenticated: false 
    });
  },

  updateProfile: async (updates) => {
    const user = get().currentUser;
    if (!user) return;

    try {
      // 1. Try Backend Update
      const res = await api.patch('/users/me', updates);
      const updatedUser = res.data;
      
      setLocalStorage('currentUser', updatedUser);
      set({ currentUser: updatedUser });

      get().addNotification(
        'Profile Updated',
        'Your profile changes have been saved to the server.',
        'success'
      );
    } catch (err) {
      console.warn('Backend update profile failed, performing local updates.', err);
      
      // 2. Local Fallback
      const updatedUser = { ...user, ...updates };
      const updatedUsers = get().users.map(u => u.id === user.id ? updatedUser : u);
      
      setLocalStorage('currentUser', updatedUser);
      setLocalStorage('users', updatedUsers);
      
      set({ 
        currentUser: updatedUser,
        users: updatedUsers
      });

      get().addNotification(
        'Profile Updated (Offline)',
        'Your changes have been saved locally.',
        'success'
      );
    }
  },

  registerOrganization: async (orgData) => {
    const user = get().currentUser;
    if (!user) throw new Error('You must be signed in.');

    set({ isLoading: true });

    try {
      // 1. Try Backend Register Org
      const res = await api.post('/organizations/register', orgData);
      const newOrg = res.data;
      
      // Fetch updated organizations list
      const orgsRes = await api.get('/organizations');
      
      set({ 
        organizations: orgsRes.data,
        isLoading: false 
      });

      get().addNotification(
        'Application Submitted! 🏢',
        'Your organization verification application is pending administrator review.',
        'info'
      );

      return newOrg;
    } catch (err) {
      console.warn('Backend register organization failed, using local fallback.', err);
      
      // 2. Local Fallback
      await new Promise(r => setTimeout(r, 800));

      const newOrg: Organization = {
        ...orgData,
        id: `org-${Math.random().toString(36).substr(2, 9)}`,
        ownerId: user.id,
        verificationStatus: 'PENDING',
        createdAt: new Date().toISOString()
      };

      const updatedOrgs = [...get().organizations, newOrg];
      setLocalStorage('organizations', updatedOrgs);
      set({ 
        organizations: updatedOrgs, 
        isLoading: false 
      });

      get().addNotification(
        'Application Submitted (Offline)! 🏢',
        'Your application has been registered locally.',
        'info'
      );

      return newOrg;
    }
  },

  adminApproveOrg: async (orgId) => {
    try {
      // 1. Backend Approving
      await api.patch(`/organizations/approve/${orgId}`);
      
      // Reload profile, orgs, and users from backend
      const [usersRes, orgsRes, profileRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })), // admin routes fallback
        api.get('/organizations'),
        api.get('/auth/profile')
      ]);

      const user = profileRes.data;
      let org = null;
      if (user.role === 'ORGANIZATION') {
        org = orgsRes.data.find((o: any) => o.ownerId === user.id) || null;
      }

      setLocalStorage('currentUser', user);
      setLocalStorage('currentOrg', org);
      
      set({
        users: usersRes.data.length ? usersRes.data : get().users,
        organizations: orgsRes.data,
        currentUser: user,
        currentOrg: org
      });
      
      get().addNotification('Partner Approved! 🏢', 'Verification status has been updated.', 'success');
    } catch (err) {
      console.warn('Backend approve organization failed, using local fallback.', err);
      
      // 2. Local Fallback
      const org = get().organizations.find(o => o.id === orgId);
      if (!org) return;

      const updatedOrgs = get().organizations.map(o => 
        o.id === orgId ? { ...o, verificationStatus: 'APPROVED' as const } : o
      );

      const updatedUsers = get().users.map(u => 
        u.id === org.ownerId ? { ...u, role: 'ORGANIZATION' as const } : u
      );

      let currentUser = get().currentUser;
      let currentOrg = get().currentOrg;
      if (currentUser && currentUser.id === org.ownerId) {
        currentUser = { ...currentUser, role: 'ORGANIZATION' };
        currentOrg = { ...org, verificationStatus: 'APPROVED' };
        setLocalStorage('currentUser', currentUser);
        setLocalStorage('currentOrg', currentOrg);
      }

      setLocalStorage('organizations', updatedOrgs);
      setLocalStorage('users', updatedUsers);

      set({ 
        organizations: updatedOrgs,
        users: updatedUsers,
        currentUser,
        currentOrg
      });
    }
  },

  adminRejectOrg: async (orgId) => {
    try {
      // 1. Try Backend Rejecting
      await api.patch(`/organizations/reject/${orgId}`);
      
      const orgsRes = await api.get('/organizations');
      set({ organizations: orgsRes.data });
      get().addNotification('Partner Declined ❌', 'Verification declined.', 'alert');
    } catch (err) {
      console.warn('Backend reject organization failed, using local fallback.', err);
      
      // 2. Local Fallback
      const org = get().organizations.find(o => o.id === orgId);
      if (!org) return;

      const updatedOrgs = get().organizations.map(o => 
        o.id === orgId ? { ...o, verificationStatus: 'REJECTED' as const } : o
      );

      setLocalStorage('organizations', updatedOrgs);
      set({ organizations: updatedOrgs });
    }
  },

  createOpportunity: async (oppData) => {
    try {
      // 1. Try Backend Publish
      await api.post('/opportunities', oppData);
      
      // Reload opportunities from backend
      const res = await api.get('/opportunities');
      set({ opportunities: res.data });
      
      get().addNotification(
        'Opportunity Published! 📣',
        `"${oppData.title}" has been saved to database.`,
        'success'
      );
    } catch (err) {
      console.warn('Backend create opportunity failed, using local fallback.', err);
      
      // 2. Local Fallback
      const org = get().currentOrg;
      if (!org) return;

      const newOpp: Opportunity = {
        ...oppData,
        id: `opp-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: org.id,
        organizationName: org.organizationName,
        organizationLogo: org.logo,
        status: 'OPEN',
        applicantsCount: 0
      };

      const updatedOpps = [newOpp, ...get().opportunities];
      setLocalStorage('opportunities', updatedOpps);
      set({ opportunities: updatedOpps });

      get().addNotification(
        'Opportunity Published (Offline)! 📣',
        `"${oppData.title}" is saved locally.`,
        'success'
      );
    }
  },

  createEvent: async (eventData) => {
    try {
      // 1. Try Backend Publish
      await api.post('/events', eventData);
      
      const res = await api.get('/events');
      set({ events: res.data });
      
      get().addNotification(
        'Community Event Scheduled! 📅',
        `"${eventData.title}" has been saved.`,
        'success'
      );
    } catch (err) {
      console.warn('Backend create event failed, using local fallback.', err);
      
      // 2. Local Fallback
      const org = get().currentOrg;
      if (!org) return;

      const newEvent: Event = {
        ...eventData,
        id: `evt-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: org.id,
        organizationName: org.organizationName,
        registeredUsers: []
      };

      const updatedEvts = [newEvent, ...get().events];
      setLocalStorage('events', updatedEvts);
      set({ events: updatedEvts });

      get().addNotification(
        'Community Event Scheduled (Offline)! 📅',
        `"${eventData.title}" has been scheduled locally.`,
        'success'
      );
    }
  },

  applyForOpportunity: async (oppId, notes) => {
    try {
      // 1. Try Backend Application
      await api.post(`/opportunities/apply/${oppId}`, { notes });
      
      // Reload applications and user stats (XP updates)
      const [profileRes, oppsRes, appsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/opportunities'),
        api.get('/opportunities/applications/org').catch(() => ({ data: [] }))
      ]);
      
      setLocalStorage('currentUser', profileRes.data);
      set({ 
        currentUser: profileRes.data,
        opportunities: oppsRes.data,
        applications: appsRes.data.length ? appsRes.data : get().applications
      });

      get().addNotification('Application Submitted! 🌱', 'Your request has been successfully registered.', 'success');
    } catch (err) {
      console.warn('Backend apply opportunity failed, using local fallback.', err);
      
      // 2. Local Fallback
      const user = get().currentUser;
      if (!user) throw new Error('You must be signed in to apply.');

      // Check if already applied
      const alreadyApplied = get().applications.some(a => a.opportunityId === oppId && a.userId === user.id);
      if (alreadyApplied) throw new Error('You have already applied for this opportunity.');

      const opp = get().opportunities.find(o => o.id === oppId);
      if (!opp) return;

      const newApp: Application = {
        id: `app-${Math.random().toString(36).substr(2, 9)}`,
        opportunityId: oppId,
        opportunityTitle: opp.title,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        status: 'PENDING',
        notes,
        createdAt: new Date().toISOString()
      };

      const updatedOpps = get().opportunities.map(o => 
        o.id === oppId ? { ...o, applicantsCount: o.applicantsCount + 1 } : o
      );

      const updatedApps = [newApp, ...get().applications];
      
      setLocalStorage('opportunities', updatedOpps);
      setLocalStorage('applications', updatedApps);
      
      set({ 
        opportunities: updatedOpps,
        applications: updatedApps
      });

      // Notify host locally
      const org = get().organizations.find(o => o.id === opp.organizationId);
      if (org) {
        const orgNotif: Notification = {
          id: `not-${Math.random().toString(36).substr(2, 9)}`,
          userId: org.ownerId,
          title: 'New Volunteer Application! 🤝',
          message: `${user.name} applied for "${opp.title}".`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString()
        };
        const updatedNotifs = [orgNotif, ...get().notifications];
        setLocalStorage('notifications', updatedNotifs);
        set({ notifications: updatedNotifs });
      }

      await get().addXP(50, 'Submitted volunteer application');
    }
  },

  registerForEvent: async (eventId) => {
    try {
      // 1. Try Backend Registration
      await api.post(`/events/register/${eventId}`);
      
      const [profileRes, evtsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/events')
      ]);

      setLocalStorage('currentUser', profileRes.data);
      set({
        currentUser: profileRes.data,
        events: evtsRes.data
      });

      get().addNotification('Event Registered! 📅', 'Looking forward to seeing you there.', 'success');
    } catch (err) {
      console.warn('Backend register event failed, using local fallback.', err);
      
      // 2. Local Fallback
      const user = get().currentUser;
      if (!user) throw new Error('You must be signed in to register.');

      const event = get().events.find(e => e.id === eventId);
      if (!event) return;

      if (event.registeredUsers.includes(user.id)) {
        throw new Error('You are already registered for this event.');
      }

      const updatedEvents = get().events.map(e => 
        e.id === eventId ? { ...e, registeredUsers: [...e.registeredUsers, user.id] } : e
      );

      setLocalStorage('events', updatedEvents);
      set({ events: updatedEvents });

      await get().addXP(100, `Registered for event "${event.title}"`);

      // Give First Step badge if not already unlocked
      if (!user.badges.includes('1')) {
        const updatedUser = { ...user, badges: [...user.badges, '1'] };
        const updatedUsers = get().users.map(u => u.id === user.id ? updatedUser : u);
        setLocalStorage('currentUser', updatedUser);
        setLocalStorage('users', updatedUsers);
        set({ currentUser: updatedUser, users: updatedUsers });
        
        get().addNotification(
          'Badge Unlocked! 🌱',
          'Congratulations! You unlocked the "First Step" achievement badge.',
          'success'
        );
      }
    }
  },

  updateApplicationStatus: async (appId, status) => {
    try {
      // 1. Try Backend Status Change
      await api.patch(`/opportunities/applications/${appId}`, { status });
      
      // Reload org dashboard details
      const [profileRes, appsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/opportunities/applications/org')
      ]);

      set({ 
        applications: appsRes.data,
        currentUser: profileRes.data.id === get().currentUser?.id ? profileRes.data : get().currentUser
      });
      
      get().addNotification('Application Updated', `Volunteer status is marked as ${status.toLowerCase()}.`, 'success');
    } catch (err) {
      console.warn('Backend update application status failed, using local fallback.', err);
      
      // 2. Local Fallback
      const app = get().applications.find(a => a.id === appId);
      if (!app) return;

      const updatedApps = get().applications.map(a => 
        a.id === appId ? { ...a, status } : a
      );

      setLocalStorage('applications', updatedApps);
      set({ applications: updatedApps });

      if (status === 'ACCEPTED') {
        const opp = get().opportunities.find(o => o.id === app.opportunityId);
        
        const newNotif: Notification = {
          id: `not-${Math.random().toString(36).substr(2, 9)}`,
          userId: app.userId,
          title: 'Application Approved! 💚',
          message: `Your application for "${app.opportunityTitle}" has been accepted!`,
          type: 'success',
          read: false,
          createdAt: new Date().toISOString()
        };

        const updatedNotifs = [newNotif, ...get().notifications];
        setLocalStorage('notifications', updatedNotifs);
        set({ notifications: updatedNotifs });

        const newCert: Certificate = {
          id: `cert-${Math.random().toString(36).substr(2, 9)}`,
          userId: app.userId,
          organizationId: opp?.organizationId || 'org-hope',
          organizationName: opp?.organizationName || 'Hope Foundation',
          title: `Volunteer Service Certificate - ${app.opportunityTitle}`,
          pdfUrl: '#',
          issueDate: new Date().toISOString().split('T')[0]
        };

        const updatedCerts = [newCert, ...get().certificates];
        setLocalStorage('certificates', updatedCerts);
        set({ certificates: updatedCerts });

        // Add XP to local list
        const volunteer = get().users.find(u => u.id === app.userId);
        if (volunteer) {
          let newXp = volunteer.xp + 150;
          let newLevel = volunteer.level;
          const xpNeeded = volunteer.level * 500;
          if (newXp >= xpNeeded) {
            newLevel += 1;
            newXp = newXp - xpNeeded;
          }

          const updatedVol = { ...volunteer, xp: newXp, level: newLevel };
          if (opp?.category === 'Environment' && !updatedVol.badges.includes('3')) {
            updatedVol.badges.push('3');
          }
          if (opp?.category === 'Education' && !updatedVol.badges.includes('4')) {
            updatedVol.badges.push('4');
          }

          const updatedUsersList = get().users.map(u => u.id === volunteer.id ? updatedVol : u);
          setLocalStorage('users', updatedUsersList);
          
          if (get().currentUser?.id === volunteer.id) {
            setLocalStorage('currentUser', updatedVol);
            set({ currentUser: updatedVol });
          }
          set({ users: updatedUsersList });
        }
      }
    }
  },

  uploadDonation: async (donationData) => {
    try {
      // 1. Try Backend Upload
      await api.post('/donations', donationData);
      
      const [profileRes, donsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/donations')
      ]);

      setLocalStorage('currentUser', profileRes.data);
      set({ 
        currentUser: profileRes.data,
        donations: donsRes.data
      });

      get().addNotification('Donation Uploaded! ❤️', 'Thank you for supporting the community.', 'success');
    } catch (err) {
      console.warn('Backend upload donation failed, using local fallback.', err);
      
      // 2. Local Fallback
      const user = get().currentUser;
      if (!user) return;

      const newDonation: Donation = {
        ...donationData,
        id: `don-${Math.random().toString(36).substr(2, 9)}`,
        ownerId: user.id,
        ownerName: user.name,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString()
      };

      const updatedDonations = [newDonation, ...get().donations];
      setLocalStorage('donations', updatedDonations);
      set({ donations: updatedDonations });

      await get().addXP(75, 'Uploaded a donation listing');

      if (!user.badges.includes('2')) {
        const updatedUser = { ...user, badges: [...user.badges, '2'] };
        const updatedUsers = get().users.map(u => u.id === user.id ? updatedUser : u);
        setLocalStorage('currentUser', updatedUser);
        setLocalStorage('users', updatedUsers);
        set({ currentUser: updatedUser, users: updatedUsers });
        
        get().addNotification(
          'Badge Unlocked! ❤️',
          'Congratulations! You unlocked the "Kind Heart" donation badge.',
          'success'
        );
      }
    }
  },

  requestDonation: async (donationId) => {
    try {
      // 1. Try Backend Claim
      await api.patch(`/donations/request/${donationId}`);
      
      const donsRes = await api.get('/donations');
      set({ donations: donsRes.data });
      get().addNotification('Donation Requested! 🎁', 'The owner has been notified.', 'success');
    } catch (err) {
      console.warn('Backend request donation failed, using local fallback.', err);
      
      // 2. Local Fallback
      const user = get().currentUser;
      if (!user) throw new Error('You must be signed in to request items.');

      const donation = get().donations.find(d => d.id === donationId);
      if (!donation) return;

      if (donation.ownerId === user.id) {
        throw new Error('You cannot request your own donation.');
      }

      const updatedDonations = get().donations.map(d => 
        d.id === donationId ? { ...d, status: 'REQUESTED' as const, requesterId: user.id, requesterName: user.name } : d
      );

      setLocalStorage('donations', updatedDonations);
      set({ donations: updatedDonations });

      // Local owner notification
      const newNotif: Notification = {
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: donation.ownerId,
        title: 'Donation Request Received! 🎁',
        message: `${user.name} requested your donation "${donation.title}".`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
      };

      const updatedNotifs = [newNotif, ...get().notifications];
      setLocalStorage('notifications', updatedNotifs);
      set({ notifications: updatedNotifs });
    }
  },

  adminDeleteDonation: async (donationId) => {
    try {
      // 1. Try Backend Delete
      await api.delete(`/donations/${donationId}`);
      
      const donsRes = await api.get('/donations');
      set({ donations: donsRes.data });
      get().addNotification('Listing Removed', 'The item has been deleted by administration.', 'success');
    } catch (err) {
      console.warn('Backend delete donation failed, using local fallback.', err);
      
      // 2. Local Fallback
      const updatedDonations = get().donations.filter(d => d.id !== donationId);
      setLocalStorage('donations', updatedDonations);
      set({ donations: updatedDonations });
    }
  },

  addXP: async (amount, reason) => {
    // If backend is active, XP changes happen automatically through API calls (like registering for events or completing applications).
    // Locally, we perform direct simulation.
    const user = get().currentUser;
    if (!user) return;

    let newXp = user.xp + amount;
    let newLevel = user.level;
    const xpNeeded = user.level * 500;
    
    let leveledUp = false;
    if (newXp >= xpNeeded) {
      newLevel += 1;
      newXp = newXp - xpNeeded;
      leveledUp = true;
    }

    const updatedUser = { ...user, xp: newXp, level: newLevel };
    const updatedUsers = get().users.map(u => u.id === user.id ? updatedUser : u);

    setLocalStorage('currentUser', updatedUser);
    setLocalStorage('users', updatedUsers);

    set({ currentUser: updatedUser, users: updatedUsers });

    get().addNotification(
      `Earned +${amount} XP! 🌱`,
      reason,
      'success'
    );

    if (leveledUp) {
      const levelUpNotif: Notification = {
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        title: 'Level Up! 🌟',
        message: `Congratulations! You reached Level ${newLevel}: "${LEVEL_NAMES[newLevel - 1] || 'Change Leader'}"!`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedNotifs = [levelUpNotif, ...get().notifications];
      setLocalStorage('notifications', updatedNotifs);
      set({ notifications: updatedNotifs });
    }
  },

  addNotification: (title, message, type) => {
    const user = get().currentUser;
    if (!user) return;

    const newNotif: Notification = {
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };

    const updatedNotifs = [newNotif, ...get().notifications];
    setLocalStorage('notifications', updatedNotifs);
    set({ notifications: updatedNotifs });
  },

  markNotificationsAsRead: async () => {
    try {
      // 1. Try Backend Read Notifs
      await api.patch('/notifications/read');
      
      const res = await api.get('/notifications');
      set({ notifications: res.data });
    } catch (err) {
      console.warn('Backend mark notifications read failed, using local fallback.', err);
      
      // 2. Local Fallback
      const user = get().currentUser;
      if (!user) return;

      const updatedNotifs = get().notifications.map(n => 
        n.userId === user.id ? { ...n, read: true } : n
      );

      setLocalStorage('notifications', updatedNotifs);
      set({ notifications: updatedNotifs });
    }
  }
}));

export { LEVEL_NAMES };
export default useAuthStore;
