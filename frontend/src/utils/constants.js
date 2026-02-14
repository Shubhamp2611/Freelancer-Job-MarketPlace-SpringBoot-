// src/utils/constants.js

// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

// User Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  FREELANCER: 'FREELANCER',
  USER: 'USER',
};

// Job Status
export const JOB_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

// Job Types
export const JOB_TYPES = [
  { value: 'FIXED_PRICE', label: 'Fixed Price' },
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'CONTRACT', label: 'Contract' },
];

// Proposal Status
export const PROPOSAL_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  EXPIRED: 'EXPIRED',
};

// Contract Status
export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED',
  ON_HOLD: 'ON_HOLD',
  TERMINATED: 'TERMINATED',
};

// Milestone Status
export const MILESTONE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED',
};

// Payment Types
export const PAYMENT_TYPES = {
  ESCROW_DEPOSIT: 'ESCROW_DEPOSIT',
  MILESTONE_PAYMENT: 'MILESTONE_PAYMENT',
  PLATFORM_FEE: 'PLATFORM_FEE',
  REFUND: 'REFUND',
  WITHDRAWAL: 'WITHDRAWAL',
};

// Skills Categories
export const SKILLS_CATEGORIES = {
  DEVELOPMENT: [
    'Web Development',
    'Mobile Development',
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'DevOps',
  ],
  DESIGN: [
    'UI/UX Design',
    'Graphic Design',
    'Web Design',
    'Logo Design',
    'Brand Identity',
  ],
  MARKETING: [
    'Digital Marketing',
    'Social Media Marketing',
    'SEO',
    'Content Marketing',
    'Email Marketing',
  ],
  WRITING: [
    'Content Writing',
    'Copywriting',
    'Technical Writing',
    'Blog Writing',
    'Academic Writing',
  ],
  BUSINESS: [
    'Virtual Assistant',
    'Data Entry',
    'Customer Service',
    'Project Management',
    'Business Consulting',
  ],
};

// Currency
export const CURRENCY = 'USD';

// Platform Fee Percentage
export const PLATFORM_FEE_PERCENTAGE = 10;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  PASSWORD_MATCH: 'Passwords do not match',
  BUDGET_MIN: 'Budget must be at least $1',
  POSITIVE_NUMBER: 'Must be a positive number',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  FULL: 'MMMM DD, YYYY hh:mm A',
};