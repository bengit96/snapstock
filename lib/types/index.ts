// ==========================================
// Core Type Definitions
// ==========================================

// User Types
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  subscriptionStatus?: "active" | "inactive" | "cancelled" | "past_due" | null;
  subscriptionTier?: "monthly" | "yearly" | "lifetime" | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionEndDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Trading Signal Types
export interface TradingSignal {
  id: string;
  name: string;
  shortName: string;
  points: number;
  category: "bullish" | "bearish";
  confluenceCategory?: string;
  conflictsWith?: string[];
  definition?: string;
  disqualifiesA?: boolean;
  active: boolean;
  key: string;
  confidence?: number;
  explanation?: string;
}

export interface NoGoCondition {
  id: string;
  name: string;
  description: string;
  active: boolean;
  confidence?: number;
}

// Pullback Types
export interface PullbackRecommendation {
  hasPullback: boolean;
  isPullbackEntry: boolean;
  pullbackLevel?: number;
  pullbackPattern?: string;
  pullbackConfirmation?: string;
  recommendation: string;
  entryTrigger?: string;
  pullbackStrength?: "weak" | "moderate" | "strong";
  supportLevel?: number;
  waitForPullback?: boolean;
}

// Analysis Types
export interface ChartAnalysisInput {
  activeSignalIds: string[];
  activeNoGoIds: string[];
  currentPrice?: number;
  supportLevel?: number;
  resistanceLevel?: number;
}

export interface AnalysisResult {
  grade: TradeGrade;
  gradeColor: string;
  gradeLabel: string;
  gradeDescription?: string;
  totalScore: number;
  shouldEnter: boolean;
  activeBullishSignals: TradingSignal[];
  activeBearishSignals: TradingSignal[];
  activeNoGoConditions: NoGoCondition[];
  confluenceCount: number;
  confluenceCategories: string[];
  reasons: string[];
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  // Pullback recommendation fields
  pullbackRecommendation?: PullbackRecommendation;
}

export interface ChartAnalysisResult {
  isValidChart: boolean;
  stockSymbol?: string;
  currentPrice?: number;
  supportLevel?: number;
  resistanceLevel?: number;
  activeSignals: string[];
  activeNoGoConditions: string[];
  chartDescription?: string;
  confidence: number;
}

export interface DetailedAnalysisResult extends AnalysisResult {
  id: string;
  stockSymbol?: string;
  chartDescription?: string;
  timeframe?: string;
  chartQuality?: number;
  tradeThesis?: string;
  keyStrengths?: string[];
  keyConcerns?: string[];
  aiConfidence?: number;
  detectedSignals?: {
    bullish: Array<{ name: string; points: number; explanation?: string }>;
    bearish: Array<{ name: string; points: number; explanation?: string }>;
    noGo: string[];
  };
  pullbackRecommendation?: PullbackRecommendation;
}

// Chart Analysis Database Types
export interface ChartAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  stockSymbol?: string | null;
  isValidChart: boolean;
  grade?: TradeGrade | null;
  gradeLabel?: string | null;
  gradeColor?: string | null;
  totalScore?: string | null;
  shouldEnter?: boolean | null;
  entryPrice?: string | null;
  stopLoss?: string | null;
  takeProfit?: string | null;
  riskRewardRatio?: string | null;
  activeBullishSignals?: TradingSignal[] | null;
  activeBearishSignals?: TradingSignal[] | null;
  activeNoGoConditions?: NoGoCondition[] | null;
  confluenceCount?: number | null;
  confluenceCategories?: string[] | null;
  analysisReasons?: string[] | null;
  chartSummary?: string | null;
  chartDescription?: string | null;
  // Additional AI analysis data
  timeframe?: string | null;
  chartQuality?: number | null;
  tradeThesis?: string | null;
  plainLanguageAnalysis?: string | null;
  overallReason?: string | null;
  keyStrengths?: string[] | null;
  keyConcerns?: string[] | null;
  // Pullback analysis
  pullbackRecommendation?: PullbackRecommendation | null;
  createdAt: Date;
  updatedAt: Date;
}

// Trade Types
export interface Trade {
  id: string;
  userId: string;
  analysisId?: string;
  stockSymbol: string;
  entryDate: Date;
  entryPrice: string;
  position: "long" | "short";
  quantity: number;
  stopLoss?: string;
  takeProfit?: string;
  exitDate?: Date;
  exitPrice?: string;
  profitLoss?: string;
  profitLossPercent?: string;
  status: "open" | "closed" | "stopped_out";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Grade Types
export type TradeGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

export const GRADE_COLORS: Record<TradeGrade, string> = {
  "A+": "#10b981", // green-500
  A: "#22c55e", // green-400
  "B+": "#84cc16", // lime-400
  B: "#eab308", // yellow-400
  "C+": "#f59e0b", // orange-400
  C: "#f97316", // orange-500
  D: "#ef4444", // red-500
  F: "#dc2626", // red-600
};

export const GRADE_BADGES: Record<TradeGrade, string> = {
  "A+": "bg-green-500",
  A: "bg-green-400",
  "B+": "bg-lime-400",
  B: "bg-yellow-400",
  "C+": "bg-orange-400",
  C: "bg-orange-500",
  D: "bg-red-500",
  F: "bg-red-600",
};

// Subscription Types
export interface SubscriptionTier {
  price: number;
  priceId: string;
  name: string;
  description: string;
}

export interface SubscriptionTiers {
  monthly: SubscriptionTier;
  yearly: SubscriptionTier;
  lifetime: SubscriptionTier;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartUploadResponse
  extends ApiResponse<DetailedAnalysisResult> {}

export interface OTPResponse extends ApiResponse {
  message: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  code?: string;
}

// Component Props Types
export interface ProviderProps {
  children: React.ReactNode;
}

export interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isDragActive: boolean;
  uploading: boolean;
}

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}
