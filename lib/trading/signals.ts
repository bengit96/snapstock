export interface TradingSignal {
  id: string
  name: string
  shortName: string
  points: number
  category: 'bullish' | 'bearish'
  confluenceCategory?: string
  conflictsWith?: string[]
  definition?: string
  disqualifiesA?: boolean
  active: boolean
  key: string
}

export const TRADING_SIGNALS: TradingSignal[] = [
  // ========== BULLISH SIGNALS ==========

  // VOLUME CATEGORY
  { id: 'high-buy-vol', name: 'High Buying Volume', shortName: 'Buy Vol', points: 12, category: 'bullish', confluenceCategory: 'volume', conflictsWith: ['heavy-sell-vol', 'decreasing-buy-vol'], active: false, key: '1' },
  { id: 'low-sell-vol', name: 'Low Selling Volume', shortName: 'Low Sell', points: 6, category: 'bullish', confluenceCategory: 'volume', active: false, key: 'z' },

  // MOMENTUM CATEGORY
  { id: 'macd-green', name: 'MACD Green', shortName: 'MACD+', points: 12, category: 'bullish', confluenceCategory: 'momentum', conflictsWith: ['macd-red'], active: false, key: '2' },
  { id: 'tech-align', name: 'Technical Indicators Aligned', shortName: 'Tech Align', points: 12, category: 'bullish', confluenceCategory: 'momentum', active: false, key: '9' },

  // TREND CATEGORY
  { id: 'close-9ema', name: 'Close to 9 EMA', shortName: '9 EMA', points: 12, category: 'bullish', confluenceCategory: 'trend', active: false, key: '3' },
  { id: 'strong-rejection-support', name: 'Strong Rejection off Support', shortName: 'Support Reject', points: 15, category: 'bullish', confluenceCategory: 'trend', conflictsWith: ['topping-tail', 'sudden-rejection'], active: false, key: '4' },
  { id: 'first-two-pullbacks', name: 'First 2 Pullbacks', shortName: '1st/2nd PB', points: 13, category: 'bullish', confluenceCategory: 'trend', conflictsWith: ['third-pullback'], active: false, key: '8', definition: 'The first or second pullback in an uptrend. These offer the best risk/reward as the trend is still fresh. After the 3rd pullback, momentum typically weakens.' },
  { id: 'good-risk-reward', name: '2:1 Profit/Loss Ratio', shortName: '2:1 R/R', points: 15, category: 'bullish', confluenceCategory: 'trend', active: false, key: 'c', definition: 'Risk/reward ratio of at least 2:1. If risking $1, potential profit is $2 or more. Essential for profitable trading over time. Clear stop loss and profit target identified.' },

  // TIMEFRAME CATEGORY
  { id: 'mtf-align', name: 'Multi-Timeframe Alignment', shortName: 'MTF', points: 15, category: 'bullish', confluenceCategory: 'timeframe', active: false, key: '5' },

  // PATTERN CATEGORY
  { id: 'three-green-candles', name: '3 Green Candles', shortName: '3 Green', points: 12, category: 'bullish', confluenceCategory: 'pattern', conflictsWith: ['three-red-candles'], active: false, key: '6' },
  { id: 'bullish-engulfing', name: 'Bullish Engulfing', shortName: 'Engulfing', points: 12, category: 'bullish', confluenceCategory: 'pattern', conflictsWith: ['bearish-engulfing'], active: false, key: 'a' },
  { id: 'hammer', name: 'Hammer/Pinbar', shortName: 'Hammer', points: 10, category: 'bullish', confluenceCategory: 'pattern', conflictsWith: ['shooting-star'], active: false, key: 's' },
  { id: 'cup-handle', name: 'Cup and Handle Formation', shortName: 'Cup&Handle', points: 14, category: 'bullish', confluenceCategory: 'pattern', active: false, key: 'j', definition: 'Bullish continuation pattern. Rounded bottom (cup) followed by small consolidation (handle). Breakout from handle suggests strong upward move. High probability setup when volume confirms.' },

  // SUPPORT/RESISTANCE CATEGORY
  { id: 'at-whole-dollar', name: 'At Whole Dollar Support', shortName: 'Whole $', points: 10, category: 'bullish', confluenceCategory: 'support_resistance', conflictsWith: ['resistance-whole', 'resistance-half'], active: false, key: '0' },
  { id: 'at-half-dollar', name: 'At Half Dollar Support', shortName: 'Half $', points: 8, category: 'bullish', confluenceCategory: 'support_resistance', conflictsWith: ['resistance-whole', 'resistance-half'], active: false, key: '-' },

  // CATALYST CATEGORY
  { id: 'news', name: 'News Catalyst', shortName: 'News', points: 10, category: 'bullish', confluenceCategory: 'catalyst', active: false, key: 'd' },

  // ========== BEARISH SIGNALS ==========

  // VOLUME CATEGORY
  { id: 'heavy-sell-vol', name: 'Heavy Selling Volume', shortName: 'Sell Vol', points: -12, category: 'bearish', confluenceCategory: 'volume', conflictsWith: ['high-buy-vol'], active: false, key: 'q' },
  { id: 'decreasing-buy-vol', name: 'Decreasing Buying Volume', shortName: 'Decr Buy Vol', points: -12, category: 'bearish', confluenceCategory: 'volume', conflictsWith: ['high-buy-vol'], active: false, key: 'x' },

  // MOMENTUM CATEGORY
  { id: 'macd-red', name: 'MACD Red', shortName: 'MACD-', points: -12, category: 'bearish', confluenceCategory: 'momentum', conflictsWith: ['macd-green'], active: false, key: 'w' },
  { id: 'macd-weakening', name: 'MACD Weakening', shortName: 'MACD Weak', points: -10, category: 'bearish', confluenceCategory: 'momentum', conflictsWith: ['macd-green'], active: false, key: 'n', definition: 'MACD histogram getting shorter, signal line approaching or crossing below MACD line. Momentum is fading - trend may be losing steam.' },

  // TREND CATEGORY
  { id: 'topping-tail', name: 'Topping Tail', shortName: 'Top Tail', points: -15, category: 'bearish', confluenceCategory: 'pattern', conflictsWith: ['strong-rejection-support', 'hammer'], active: false, key: 'e' },
  { id: 'sudden-rejection', name: 'Sudden Strong Rejection', shortName: 'Rejection', points: -15, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, conflictsWith: ['strong-rejection-support'], active: false, key: 'r' },
  { id: 'extended-move', name: 'Extended/Parabolic Move', shortName: 'Extended', points: -13, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, active: false, key: 't', definition: 'Stock has moved too far too fast in near-vertical price action. Steep angle (>45°), multiple consecutive green candles, large % gain in short time. High risk of pullback/reversal. Avoid chasing.' },
  { id: 'poor-risk-reward', name: 'Risk/Reward <2:1 or Profit <10¢', shortName: 'Poor R/R', points: -15, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, conflictsWith: ['good-risk-reward'], active: false, key: 'm', definition: 'Risk/reward ratio less than 2:1 OR potential profit less than 10 cents per share. Not worth the risk - either the upside is too small or the stop is too far away. Skip this trade.' },
  { id: 'far-from-9ema', name: 'Too Far from 9 EMA', shortName: 'Far 9EMA', points: -12, category: 'bearish', confluenceCategory: 'trend', conflictsWith: ['close-9ema'], active: false, key: '7', definition: 'Price has extended too far away from the 9 EMA. Increases risk of sharp pullback to the moving average. Wait for price to come back closer to support before entering.' },
  { id: 'retraced-50', name: 'Retraced >50% of Move', shortName: '50% Retrace', points: -14, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, active: false, key: 'y', definition: 'Stock has given back more than 50% of its recent upward move. This suggests weakening momentum and potential trend reversal. Fibonacci traders often use 50% retracement as a bearish signal.' },
  { id: 'third-pullback', name: '3rd Pullback', shortName: '3rd PB', points: -13, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, conflictsWith: ['first-two-pullbacks'], active: false, key: 'f', definition: 'The third or later pullback in a trend. By this point, momentum is fading and risk increases significantly. Trend may be exhausting.' },
  { id: 'back-side', name: 'Back Side of Move', shortName: 'Back Side', points: -14, category: 'bearish', confluenceCategory: 'trend', disqualifiesA: true, active: false, key: 'v', definition: 'Stock has already made its move and is declining/consolidating. Entering here means buying at or near the top. High risk of being trapped in the reversal.' },

  // PATTERN CATEGORY
  { id: 'three-red-candles', name: '3 Red Candles', shortName: '3 Red', points: -12, category: 'bearish', confluenceCategory: 'pattern', conflictsWith: ['three-green-candles'], active: false, key: 'u' },
  { id: 'doji', name: 'Doji Pattern', shortName: 'Doji', points: -10, category: 'bearish', confluenceCategory: 'pattern', active: false, key: 'i' },
  { id: 'red-morning-star', name: 'Red Morning Star', shortName: 'Red Star', points: -12, category: 'bearish', confluenceCategory: 'pattern', active: false, key: 'o' },
  { id: 'bearish-engulfing', name: 'Bearish Engulfing', shortName: 'Bear Engulf', points: -12, category: 'bearish', confluenceCategory: 'pattern', conflictsWith: ['bullish-engulfing'], active: false, key: 'p' },
  { id: 'shooting-star', name: 'Shooting Star', shortName: 'Shoot Star', points: -12, category: 'bearish', confluenceCategory: 'pattern', conflictsWith: ['hammer'], active: false, key: '[' },

  // SUPPORT/RESISTANCE CATEGORY
  { id: 'resistance-whole', name: 'At Whole Dollar Resistance', shortName: 'Resist Whole', points: -12, category: 'bearish', confluenceCategory: 'support_resistance', conflictsWith: ['at-whole-dollar', 'at-half-dollar'], active: false, key: 'g' },
  { id: 'resistance-half', name: 'At Half Dollar Resistance', shortName: 'Resist Half', points: -10, category: 'bearish', confluenceCategory: 'support_resistance', conflictsWith: ['at-whole-dollar', 'at-half-dollar'], active: false, key: 'h' },
]

export interface NoGoCondition {
  id: string
  name: string
  description: string
  active: boolean
}

export const NO_GO_CONDITIONS: NoGoCondition[] = [
  { id: 'below-vwap', name: 'Below VWAP', description: 'Price trading below Volume Weighted Average Price - weak institutional support', active: false },
  { id: 'prior-rejection', name: 'Prior Sudden Rejection (Hidden Seller)', description: 'Recent sharp rejection at this level indicates strong resistance/seller', active: false },
  { id: 'near-200ema', name: 'Very Close to Daily 200 EMA', description: 'Major resistance level that often causes reversals', active: false }
]