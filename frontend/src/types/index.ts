export type UserRole = 'USER' | 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type OpportunityStatus = 'OPEN' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type DonationStatus = 'AVAILABLE' | 'REQUESTED' | 'DONATED';

export interface AvatarConfig {
  hair: string;      // 'style-1' | 'style-2' | 'style-3' | 'style-4'
  eyes: string;      // 'happy' | 'neutral' | 'sparkle' | 'glasses'
  skin: string;      // '#F5CBA7' (light) | '#D35400' (brown) | '#FAD7A0' (cream) | '#F5B041' (dark)
  clothing: string;  // '#2E7D32' (green) | '#1A5276' (blue) | '#E67E22' (orange) | '#7D3C98' (purple)
  accessory: string; // 'none' | 'cap' | 'backpack' | 'plant-leaf' | 'tshirt-badge'
}

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  avatar: AvatarConfig;
  level: number;
  xp: number;
  badges: string[]; // Badge IDs
  interests: string[];
  availability: string; // 'Weekends' | 'Weekdays' | 'Flexible'
  role: UserRole;
  createdAt: string;
}

export interface Organization {
  id: string;
  ownerId: string;
  organizationName: string;
  description: string;
  mission: string;
  category: string;
  website: string;
  phone: string;
  logo: string;
  verificationStatus: VerificationStatus;
  registrationCertificate: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  skillsRequired: string[];
  volunteerLimit: number;
  coverImage: string;
  status: OpportunityStatus;
  applicantsCount: number;
  contactInfo?: string;
  deadline?: string;
}

export interface ApplicationFormData {
  fullName: string;
  age: string;
  phone: string;
  whatsapp: string;
  location: string;
  skills: string;
  whyVolunteer: string;
  availability: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  userId: string;
  userName: string;
  userAvatar: AvatarConfig;
  status: ApplicationStatus;
  notes?: string;
  formData?: ApplicationFormData;
  createdAt: string;
}


export interface Event {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  banner: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredUsers: string[]; // Array of User IDs
  category: string;
  registrationLink?: string;
  contactInfo?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: AvatarConfig;
  formData?: ApplicationFormData;
  createdAt: string;
}


export interface Donation {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  images: string[];
  category: string; // 'Books' | 'Clothes' | 'Furniture' | 'Stationery' | 'Electronics'
  condition: string; // 'New' | 'Like New' | 'Good' | 'Fair'
  location: string;
  status: DonationStatus;
  requesterId?: string;
  requesterName?: string;
  createdAt: string;
  contactInfo?: string;
  notes?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  organizationId: string;
  organizationName: string;
  title: string;
  pdfUrl: string;
  issueDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path or Lucide component name
  xpReward: number;
  unlockDate?: string;
}

export interface Vendor {
  id: string;
  ownerId: string;
  businessName: string;
  description: string;
  category: string;
  ecoPracticeStatement: string;
  whatsapp: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  businessName: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  whatsapp: string;
  createdAt: string;
  verificationStatus?: VerificationStatus;
}

export interface EventExperience {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: AvatarConfig;
  eventId: string;
  eventTitle: string;
  reflection: string;
  images: string[];
  status: VerificationStatus;
  createdAt: string;
}

export interface FeedbackLetter {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  text: string;
  image?: string;
  status: VerificationStatus;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RecommendationScoreBreakdown {
  skillsScore: number;
  interestsScore: number;
  availabilityScore: number;
  locationScore: number;
}

export interface RecommendedOpportunity {
  opportunity: Opportunity;
  matchScore: number; // 0 - 100 percentage
  scoreBreakdown: RecommendationScoreBreakdown;
  reasons: string[];
}

export interface VolunteerAnalytics {
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalVolunteerHours: number;
  upcomingActivitiesCount: number;
  categoryDistribution: { category: string; count: number; hours: number }[];
  monthlyActivity: { month: string; hours: number; drives: number }[];
  xpProgression: { currentXp: number; level: number; nextLevelXp: number };
}

export interface OrgAnalytics {
  activeOpportunities: number;
  totalEvents: number;
  totalApplicationsReceived: number;
  acceptedVolunteersCount: number;
  pendingApplicationsCount: number;
  acceptanceRate: number;
  opportunityApplicantBreakdown: { title: string; applicants: number; accepted: number }[];
  monthlyApplicantTrends: { month: string; applicants: number }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  totalOrganizations: number;
  orgsByStatus: { status: string; count: number }[];
  totalOpportunities: number;
  totalApplications: number;
  totalDonations: number;
  totalVendors: number;
  impactMetrics: {
    estimatedVolunteerHours: number;
    treesPlanted: number;
    itemsDonated: number;
    activeCities: number;
  };
  monthlyPlatformGrowth: { month: string; users: number; opportunities: number }[];
}
