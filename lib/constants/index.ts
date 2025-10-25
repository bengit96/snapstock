// ==========================================
// Application Constants
// ==========================================

// Application Config
export const APP_NAME = 'SnapPChart'
export const APP_DESCRIPTION = 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Authentication
export const OTP_EXPIRY_MINUTES = 10
export const OTP_MAX_ATTEMPTS = 3
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

// File Upload
export const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
}
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MIN_IMAGE_WIDTH = 400
export const MIN_IMAGE_HEIGHT = 300

// Analysis Config
export const ANALYSIS_TIMEOUT = 30000 // 30 seconds
export const MIN_CONFIDENCE_THRESHOLD = 50
export const AI_MODEL = 'gpt-4-vision-preview'
export const AI_MAX_TOKENS = 1500
export const AI_TEMPERATURE = 0.2
export const EXPECTED_ANALYSIS_TIME = 5 // seconds

// Stock Selection Criteria (Momentum Trading Focus)
export const STOCK_SELECTION_CRITERIA = {
  priceRange: {
    min: 2,
    max: 20,
    label: '$2-$20',
    description: 'Price range: $2-$20'
  },
  float: {
    max: 10000000, // 10 million
    label: 'Less than 10M float',
    description: 'Float under 10 million shares'
  },
  movePercentage: {
    min: 20,
    label: 'At least 20% move',
    description: 'Minimum 20% intraday move'
  },
  relativeVolume: {
    min: 5,
    label: '5x average volume',
    description: '5x or more of average daily volume'
  },
  catalyst: {
    required: true,
    label: 'News catalyst present',
    description: 'Active news event or catalyst'
  }
} as const

export const STOCK_SELECTION_CHECKLIST = [
  STOCK_SELECTION_CRITERIA.priceRange.label,
  STOCK_SELECTION_CRITERIA.float.label,
  STOCK_SELECTION_CRITERIA.movePercentage.label,
  STOCK_SELECTION_CRITERIA.relativeVolume.label,
  STOCK_SELECTION_CRITERIA.catalyst.label,
] as const

// Trading Rules
export const MIN_RISK_REWARD_RATIO = 2.0
export const MIN_PROFIT_CENTS = 10
export const MAX_ATTEMPTS_THIRD_PULLBACK = 3

// Grading Thresholds
export const GRADE_THRESHOLDS = {
  'A+': { score: 90, bullishCount: 5, confluenceCount: 3 },
  'A': { score: 75, bullishCount: 4, confluenceCount: 2 },
  'B+': { score: 60, bullishCount: 3, confluenceCount: 0 },
  'B': { score: 50, bullishCount: 0, confluenceCount: 0 },
  'C+': { score: 40, bullishCount: 0, confluenceCount: 0 },
  'C': { score: 30, bullishCount: 0, confluenceCount: 0 },
  'D': { score: 20, bullishCount: 0, confluenceCount: 0 },
  'F': { score: 0, bullishCount: 0, confluenceCount: 0 },
}

// Subscription Limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    monthlyAnalyses: 0, // Free users get freeAnalysesLimit (default 1) total, not monthly
  },
  monthly: {
    monthlyAnalyses: 100,
  },
  yearly: {
    monthlyAnalyses: 300,
  },
  lifetime: {
    monthlyAnalyses: null, // null = unlimited
  },
} as const

// Pricing
export const PRICING = {
  monthly: {
    price: 19.99,
    label: 'Monthly',
    description: 'Perfect for trying out the platform',
    features: [
      '100 chart analyses per month',
      'Advanced AI analysis',
      'All 40+ trading signals',
      'Trade history tracking',
      'Cancel anytime'
    ]
  },
  yearly: {
    price: 99.99,
    label: 'Yearly',
    description: 'Most popular choice for serious traders',
    savings: '58%',
    features: [
      '300 chart analyses per month',
      'Everything in Monthly',
      'Priority AI processing',
      'Advanced analytics',
      'Export trade data',
      'Email support'
    ]
  },
  lifetime: {
    price: 599,
    label: 'Lifetime',
    description: 'Ultimate value for committed traders',
    features: [
      'Unlimited chart analyses',
      'Everything in Yearly',
      'Lifetime updates',
      'Early access features',
      'Priority support',
      '1-on-1 onboarding'
    ]
  }
}

// API Endpoints
export const API_ROUTES = {
  auth: {
    sendOTP: '/api/auth/send-otp',
    signIn: '/api/auth/signin',
    signOut: '/api/auth/signout',
  },
  analysis: '/api/analysis',
  stripe: {
    checkout: '/api/stripe/checkout',
    portal: '/api/stripe/portal',
    webhook: '/api/stripe/webhook',
  },
  trades: '/api/trades',
  user: '/api/user',
} as const

// Page Routes
export const ROUTES = {
  landing: '/',
  home: '/home',
  analyze: '/analyze',
  dashboard: '/dashboard',
  billing: '/billing',
  login: '/auth/login',
  pricing: '/pricing',
  settings: '/settings',
  about: '/about',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  disclaimer: '/disclaimer',
  blog: '/blog',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'An error occurred. Please try again.',
  unauthorized: 'Please sign in to continue.',
  invalidChart: 'The uploaded image does not appear to be a valid stock chart.',
  uploadFailed: 'Failed to upload chart. Please try again.',
  analysisFailed: 'Failed to analyze chart. Please try again.',
  subscriptionRequired: 'Active subscription required to access this feature.',
  invalidEmail: 'Please enter a valid email address.',
  otpRequired: 'Please enter the verification code.',
  otpInvalid: 'Invalid or expired verification code.',
  otpExpired: 'Verification code has expired. Please request a new one.',
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  otpSent: 'Verification code sent to your email.',
  loginSuccess: 'Successfully logged in.',
  logoutSuccess: 'Successfully logged out.',
  analysisComplete: 'Chart analysis complete.',
  tradeCreated: 'Trade successfully created.',
  subscriptionActive: 'Subscription activated successfully.',
} as const

// Chart Analysis Messages
export const ANALYSIS_MESSAGES = {
  uploading: 'Uploading chart...',
  analyzing: 'Analyzing chart with AI...',
  processing: 'Processing results...',
  complete: 'Analysis complete!',
} as const

// Feature Flags
export const FEATURES = {
  enableMockData: process.env.NODE_ENV === 'development',
  enableDebugLogging: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  requireSubscription: process.env.NODE_ENV === 'production',
} as const