// ==========================================
// Application Constants
// ==========================================

// Application Config
export const APP_NAME = "SnapPChart";
export const APP_DESCRIPTION =
  "AI-powered chart analysis for momentum traders. Get instant trade plans with precise entry, stop loss, and profit targets for stocks, forex, crypto, and futures.";
export const APP_URL =
  process.env.APP_URL || "http://localhost:3000";

// Social Links
export const DISCORD_INVITE_URL = "https://discord.gg/HekJUQSSaE";

// Logo SVG (for use in metadata, favicons, etc.)
export const LOGO_SVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" stroke="#3B82F6" stroke-width="3" fill="none" />
  <circle cx="50" cy="50" r="35" stroke="#3B82F6" stroke-width="2" fill="none" opacity="0.3" />
  <rect x="20" y="45" width="8" height="25" fill="#10B981" rx="1" />
  <line x1="24" y1="40" x2="24" y2="45" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <line x1="24" y1="70" x2="24" y2="75" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <rect x="35" y="35" width="8" height="30" fill="#10B981" rx="1" />
  <line x1="39" y1="30" x2="39" y2="35" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <line x1="39" y1="65" x2="39" y2="70" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <rect x="50" y="40" width="8" height="15" fill="#EF4444" rx="1" />
  <line x1="54" y1="35" x2="54" y2="40" stroke="#EF4444" stroke-width="2" stroke-linecap="round" />
  <line x1="54" y1="55" x2="54" y2="60" stroke="#EF4444" stroke-width="2" stroke-linecap="round" />
  <rect x="65" y="25" width="8" height="35" fill="#10B981" rx="1" />
  <line x1="69" y1="20" x2="69" y2="25" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <line x1="69" y1="60" x2="69" y2="65" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
  <path d="M75 15 L70 25 L75 25 L72 35 L78 23 L73 23 Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1" />
</svg>`;

// Logo metadata
export const LOGO_INFO = {
  description: "SnapPChart logo featuring candlestick chart and lightning bolt",
  colors: {
    primary: "#3B82F6", // Blue
    bullish: "#10B981", // Green
    bearish: "#EF4444", // Red
    accent: "#FBBF24", // Yellow/Gold
  },
  viewBox: "0 0 100 100",
} as const;

// Authentication
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 3;
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// File Upload
export const ACCEPTED_IMAGE_TYPES = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
};
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_IMAGE_WIDTH = 400;
export const MIN_IMAGE_HEIGHT = 300;

// Analysis Config
export const ANALYSIS_TIMEOUT = 30000; // 30 seconds
export const MIN_CONFIDENCE_THRESHOLD = 50;
export const AI_MODEL = "gpt-4o-mini";
export const AI_MAX_TOKENS = 1500;
export const AI_TEMPERATURE = 0.2;
export const EXPECTED_ANALYSIS_TIME = 5; // seconds

// Momentum Trading Criteria (For Best Results)
export const MOMENTUM_TRADING_CRITERIA = {
  trend: {
    label: "Strong trend",
    description: "Clear uptrend with momentum",
  },
  volume: {
    label: "High volume",
    description: "Above-average trading volume",
  },
  volatility: {
    label: "Good volatility",
    description: "Sufficient price movement for targets",
  },
  catalyst: {
    label: "News/catalyst",
    description: "News event or market catalyst",
  },
  liquidity: {
    label: "High liquidity",
    description: "Adequate market depth and activity",
  },
} as const;

export const MOMENTUM_TRADING_CHECKLIST = [
  MOMENTUM_TRADING_CRITERIA.trend.label,
  MOMENTUM_TRADING_CRITERIA.volume.label,
  MOMENTUM_TRADING_CRITERIA.volatility.label,
  MOMENTUM_TRADING_CRITERIA.catalyst.label,
  MOMENTUM_TRADING_CRITERIA.liquidity.label,
] as const;

// Legacy export for backwards compatibility
export const STOCK_SELECTION_CRITERIA = MOMENTUM_TRADING_CRITERIA;
export const STOCK_SELECTION_CHECKLIST = MOMENTUM_TRADING_CHECKLIST;

// Trading Rules
export const MIN_RISK_REWARD_RATIO = 2.0;
export const MIN_PROFIT_CENTS = 10;
export const MAX_ATTEMPTS_THIRD_PULLBACK = 3;

// Grading Thresholds
export const GRADE_THRESHOLDS = {
  "A+": { score: 90, bullishCount: 5, confluenceCount: 3 },
  A: { score: 75, bullishCount: 4, confluenceCount: 2 },
  "B+": { score: 60, bullishCount: 3, confluenceCount: 0 },
  B: { score: 50, bullishCount: 0, confluenceCount: 0 },
  "C+": { score: 40, bullishCount: 0, confluenceCount: 0 },
  C: { score: 30, bullishCount: 0, confluenceCount: 0 },
  D: { score: 20, bullishCount: 0, confluenceCount: 0 },
  F: { score: 0, bullishCount: 0, confluenceCount: 0 },
};

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
} as const;

// Pricing Plans - Combined features and display data
export const PRICING_PLANS = [
  {
    tier: "free" as const,
    title: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for trying out the platform",
    features: [
      "5 chart analyses",
      "AI-powered analysis",
      "Basic trade recommendations",
    ],
    badge: "Everyone Starts Here",
    badgeVariant: "default" as const,
    buttonVariant: "outline" as const,
    buttonText: "Get Started Free",
  },
  {
    tier: "monthly" as const,
    title: "Monthly",
    price: 19.99,
    period: "per month",
    description: "Perfect for trying out the platform",
    features: [
      "100 chart analyses per month",
      "Trade history tracking",
      "Cancel anytime",
    ],
    buttonVariant: "outline" as const,
    buttonText: "Start Monthly",
  },
  {
    tier: "yearly" as const,
    title: "Yearly",
    price: 199.99,
    period: "per year",
    description: "Most popular choice for serious traders",
    features: [
      "300 chart analyses per month",
      "Trade history tracking",
      "Historical Trade analysis (in progress)",
      "24/7 support",
    ],
    badge: "MOST POPULAR",
    badgeVariant: "popular" as const,
    isPopular: true,
    savings: "Save 17%",
    buttonVariant: "default" as const,
    buttonText: "Start Yearly - Best Value",
  },
  {
    tier: "lifetime" as const,
    title: "Lifetime",
    price: 599,
    period: "one-time",
    description: "Ultimate value for committed traders",
    features: [
      "Unlimited chart analyses",
      "Trade history tracking",
      "24/7 support",
    ],
    badge: "BEST VALUE",
    badgeVariant: "lifetime" as const,
    savings: "Save 70%",
    buttonVariant: "default" as const,
    buttonText: "Get Lifetime Access",
  },
] as const;

// Legacy Pricing - Keep for backward compatibility
export const PRICING = {
  monthly: {
    price: 19.99,
    label: "Monthly",
    description: "Perfect for trying out the platform",
    features: PRICING_PLANS[0].features,
  },
  yearly: {
    price: 199.99,
    label: "Yearly",
    description: "Most popular choice for serious traders",
    savings: "17%",
    features: PRICING_PLANS[1].features,
  },
  lifetime: {
    price: 599,
    label: "Lifetime",
    description: "Ultimate value for committed traders",
    features: PRICING_PLANS[2].features,
  },
};

// API Endpoints
export const API_ROUTES = {
  auth: {
    sendOTP: "/api/auth/send-otp",
    signIn: "/api/auth/signin",
    signOut: "/api/auth/signout",
  },
  analysis: "/api/analysis",
  stripe: {
    checkout: "/api/stripe/checkout",
    portal: "/api/stripe/portal",
    webhook: "/api/stripe/webhook",
  },
  trades: "/api/trades",
  user: "/api/user",
} as const;

// Page Routes
export const ROUTES = {
  landing: "/",
  home: "/home",
  analyze: "/analyze", // Public analyze page (shows chart, prompts login)
  dashboardAnalyze: "/dashboard/analyze", // Protected analyze page (processes analysis)
  dashboard: "/dashboard", // Dashboard home
  billing: "/billing",
  login: "/login",
  pricing: "/pricing",
  settings: "/settings",
  about: "/about",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  disclaimer: "/disclaimer",
  blog: "/blog",
  unauthorized: "/unauthorized",
  admin: "/admin",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  generic: "An error occurred. Please try again.",
  unauthorized: "Please sign in to continue.",
  invalidChart:
    "The uploaded image does not appear to be a valid trading chart.",
  uploadFailed: "Failed to upload chart. Please try again.",
  analysisFailed: "Failed to analyze chart. Please try again.",
  subscriptionRequired: "Active subscription required to access this feature.",
  invalidEmail: "Please enter a valid email address.",
  otpRequired: "Please enter the verification code.",
  otpInvalid: "Invalid or expired verification code.", // Generic message for security - don't reveal if OTP is wrong or expired
  networkError: "Network error. Please check your connection.",
  serverError: "Server error. Please try again later.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  otpSent: "Verification code sent to your email.",
  loginSuccess: "Successfully logged in.",
  logoutSuccess: "Successfully logged out.",
  analysisComplete: "Chart analysis complete.",
  tradeCreated: "Trade successfully created.",
  subscriptionActive: "Subscription activated successfully.",
} as const;

// Chart Analysis Messages
export const ANALYSIS_MESSAGES = {
  uploading: "Uploading chart...",
  analyzing: "Analyzing chart with AI...",
  processing: "Processing results...",
  complete: "Analysis complete!",
} as const;

// Feature Flags
export const FEATURES = {
  enableMockData: process.env.NODE_ENV === "development",
  enableDebugLogging: process.env.NODE_ENV === "development",
  enableAnalytics: process.env.NODE_ENV === "production",
  requireSubscription: process.env.NODE_ENV === "production",
} as const;
