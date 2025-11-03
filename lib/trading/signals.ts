export interface TradingSignal {
  id: string;
  name: string;
  shortName: string;
  points: number;
  category: "bullish" | "bearish";
  confluenceCategory?: string;
  conflictsWith?: string[];
  definition?: string;
  explanation?: string; // Brief explanation for why this is bullish/bearish
  disqualifiesA?: boolean;
  active: boolean;
  key: string;
}

export const TRADING_SIGNALS: TradingSignal[] = [
  // ========== BULLISH SIGNALS ==========

  // VOLUME CATEGORY
  {
    id: "high-buy-vol",
    name: "High Buying Volume",
    shortName: "Buy Vol",
    points: 12,
    category: "bullish",
    confluenceCategory: "volume",
    conflictsWith: ["heavy-sell-vol", "decreasing-buy-vol", "weak-volume"],
    explanation:
      "Strong institutional buying pressure with volume bars significantly above average",
    active: false,
    key: "1",
  },
  {
    id: "low-sell-vol",
    name: "Low Selling Volume",
    shortName: "Low Sell",
    points: 6,
    category: "bullish",
    confluenceCategory: "volume",
    explanation:
      "Sellers exhausted - minimal selling pressure indicates potential upward move",
    active: false,
    key: "z",
  },

  // MOMENTUM CATEGORY
  {
    id: "macd-green",
    name: "MACD Positive (Bullish Crossover)",
    shortName: "MACD+",
    points: 12,
    category: "bullish",
    confluenceCategory: "momentum",
    conflictsWith: ["macd-red", "macd-weakening"],
    explanation:
      "MACD line crossed above signal line (positive/bullish crossover) - momentum shifting to the upside",
    definition:
      "The MACD line (fast line) has crossed above the signal line (slow line), indicating bullish momentum. This is a positive crossover, not just histogram color. Look for the actual MACD line position relative to the signal line.",
    active: false,
    key: "2",
  },
  {
    id: "tech-align",
    name: "Technical Indicators Aligned",
    shortName: "Tech Align",
    points: 12,
    category: "bullish",
    confluenceCategory: "momentum",
    explanation:
      "Multiple indicators (RSI, MACD, momentum) all showing bullish signals simultaneously",
    active: false,
    key: "9",
  },

  // TREND CATEGORY
  {
    id: "higher-high-higher-low",
    name: "Higher High, Higher Low",
    shortName: "HH HL",
    points: 15,
    category: "bullish",
    confluenceCategory: "trend",
    conflictsWith: ["lower-high-lower-low"],
    explanation:
      "Clear uptrend structure - each high and low is higher than the previous, strong bullish momentum",
    definition:
      "Classic uptrend pattern where price is making higher highs and higher lows. This shows buyers are in control and willing to pay progressively higher prices. Strong trend continuation signal.",
    active: false,
    key: "u",
  },
  {
    id: "close-9ema",
    name: "Close to 9 EMA",
    shortName: "9 EMA",
    points: 12,
    category: "bullish",
    confluenceCategory: "trend",
    conflictsWith: ["far-from-9ema"],
    explanation:
      "Price near 9 EMA support - optimal entry point with trend intact",
    active: false,
    key: "3",
  },
  {
    id: "strong-rejection-support",
    name: "Strong Rejection off Support",
    shortName: "Support Reject",
    points: 15,
    category: "bullish",
    confluenceCategory: "trend",
    conflictsWith: ["topping-tail", "sudden-rejection"],
    explanation:
      "Long lower wick shows buyers stepped in strongly at support level",
    active: false,
    key: "4",
  },
  {
    id: "first-two-pullbacks",
    name: "First 2 Pullbacks",
    shortName: "1st/2nd PB",
    points: 13,
    category: "bullish",
    confluenceCategory: "trend",
    conflictsWith: ["third-pullback"],
    explanation:
      "Fresh trend with strong momentum - best risk/reward entry points",
    definition:
      "The first or second pullback in an uptrend. These offer the best risk/reward as the trend is still fresh. After the 3rd pullback, momentum typically weakens.",
    active: false,
    key: "8",
  },
  {
    id: "good-risk-reward",
    name: "2:1 Profit/Loss Ratio",
    shortName: "2:1 R/R",
    points: 15,
    category: "bullish",
    confluenceCategory: "trend",
    explanation:
      "Favorable risk/reward setup - potential profit is at least 2x the risk",
    definition:
      "Risk/reward ratio of at least 2:1. If risking $1, potential profit is $2 or more. Essential for profitable trading over time. Clear stop loss and profit target identified.",
    active: false,
    key: "c",
  },

  // PATTERN CATEGORY
  {
    id: "bullish-engulfing",
    name: "Bullish Engulfing",
    shortName: "Engulfing",
    points: 12,
    category: "bullish",
    confluenceCategory: "pattern",
    conflictsWith: ["bearish-engulfing"],
    explanation:
      "Large green candle completely engulfs previous red candle - strong reversal signal",
    active: false,
    key: "a",
  },
  {
    id: "hammer",
    name: "Hammer/Pinbar",
    shortName: "Hammer",
    points: 10,
    category: "bullish",
    confluenceCategory: "pattern",
    conflictsWith: ["shooting-star"],
    explanation:
      "Long lower wick with small body - rejection of lower prices indicates buying pressure",
    active: false,
    key: "s",
  },
  {
    id: "cup-handle",
    name: "Cup and Handle Formation",
    shortName: "Cup&Handle",
    points: 14,
    category: "bullish",
    confluenceCategory: "pattern",
    explanation:
      "Classic continuation pattern - consolidation followed by breakout with volume",
    definition:
      "Bullish continuation pattern. Rounded bottom (cup) followed by small consolidation (handle). Breakout from handle suggests strong upward move. High probability setup when volume confirms.",
    active: false,
    key: "j",
  },

  // SUPPORT/RESISTANCE CATEGORY
  {
    id: "at-whole-dollar",
    name: "At Whole Dollar Support",
    shortName: "Whole $",
    points: 10,
    category: "bullish",
    confluenceCategory: "support_resistance",
    conflictsWith: ["resistance-whole", "resistance-half"],
    explanation:
      "Price bouncing at psychological whole dollar level ($5, $10, $15, etc.)",
    active: false,
    key: "0",
  },
  {
    id: "at-half-dollar",
    name: "At Half Dollar Support",
    shortName: "Half $",
    points: 8,
    category: "bullish",
    confluenceCategory: "support_resistance",
    conflictsWith: ["resistance-whole", "resistance-half"],
    explanation:
      "Price finding support at half dollar level ($5.50, $10.50, etc.)",
    active: false,
    key: "-",
  },

  // CATALYST CATEGORY
  {
    id: "news",
    name: "News Catalyst",
    shortName: "News",
    points: 10,
    category: "bullish",
    confluenceCategory: "catalyst",
    explanation:
      "Positive news or catalyst driving unusual volume and price action",
    active: false,
    key: "d",
  },

  // ========== BEARISH SIGNALS ==========

  // VOLUME CATEGORY
  {
    id: "heavy-sell-vol",
    name: "Heavy Selling Volume",
    shortName: "Sell Vol",
    points: -12,
    category: "bearish",
    confluenceCategory: "volume",
    conflictsWith: ["high-buy-vol"],
    explanation:
      "Strong institutional selling with volume bars significantly above average",
    active: false,
    key: "q",
  },
  {
    id: "decreasing-buy-vol",
    name: "Decreasing Buying Volume",
    shortName: "Decr Buy Vol",
    points: -12,
    category: "bearish",
    confluenceCategory: "volume",
    conflictsWith: ["high-buy-vol"],
    explanation: "Volume declining on green candles - buyers losing interest",
    active: false,
    key: "x",
  },
  {
    id: "weak-volume",
    name: "Weak Volume Profile",
    shortName: "Weak Vol",
    points: -10,
    category: "bearish",
    confluenceCategory: "volume",
    conflictsWith: ["high-buy-vol"],
    explanation:
      "Low volume during uptrend indicates lack of conviction - move likely unsustainable",
    active: false,
    key: "l",
  },

  // MOMENTUM CATEGORY
  {
    id: "macd-red",
    name: "MACD Negative (Bearish Crossover)",
    shortName: "MACD-",
    points: -12,
    category: "bearish",
    confluenceCategory: "momentum",
    conflictsWith: ["macd-green"],
    explanation:
      "MACD line crossed below signal line (negative/bearish crossover) - momentum shifting to downside",
    definition:
      "The MACD line (fast line) has crossed below the signal line (slow line), indicating bearish momentum. This is a negative crossover, not just histogram color. Look for the actual MACD line position relative to the signal line.",
    active: false,
    key: "w",
  },
  {
    id: "macd-weakening",
    name: "MACD Weakening",
    shortName: "MACD Weak",
    points: -10,
    category: "bearish",
    confluenceCategory: "momentum",
    conflictsWith: ["macd-green"],
    explanation:
      "MACD histogram shrinking - momentum fading, trend may be exhausting",
    definition:
      "MACD histogram getting shorter, signal line approaching or crossing below MACD line. Momentum is fading - trend may be losing steam.",
    active: false,
    key: "n",
  },

  // TREND CATEGORY
  {
    id: "lower-high-lower-low",
    name: "Lower High, Lower Low",
    shortName: "LH LL",
    points: -15,
    category: "bearish",
    confluenceCategory: "trend",
    conflictsWith: ["higher-high-higher-low"],
    explanation:
      "Clear downtrend structure - each high and low is lower than the previous, strong bearish momentum",
    definition:
      "Classic downtrend pattern where price is making lower highs and lower lows. This shows sellers are in control and buyers are unwilling to pay higher prices. Strong bearish signal indicating trend weakness or reversal.",
    active: false,
    key: "k",
  },
  {
    id: "topping-tail",
    name: "Topping Tail",
    shortName: "Top Tail",
    points: -15,
    category: "bearish",
    confluenceCategory: "pattern",
    conflictsWith: ["strong-rejection-support", "hammer"],
    explanation:
      "Long upper wick shows sellers rejected higher prices - bearish reversal signal",
    active: false,
    key: "e",
  },
  {
    id: "sudden-rejection",
    name: "Sudden Strong Rejection",
    shortName: "Rejection",
    points: -15,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    conflictsWith: ["strong-rejection-support"],
    explanation:
      "Sharp rejection from resistance - hidden seller at this level",
    active: false,
    key: "r",
  },
  {
    id: "extended-move",
    name: "Extended/Parabolic Move",
    shortName: "Extended",
    points: -13,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    explanation:
      "Stock has moved too far too fast - high risk of sharp pullback, avoid chasing",
    definition:
      "Stock has moved too far too fast in near-vertical price action. Steep angle (>45°), multiple consecutive green candles, large % gain in short time. High risk of pullback/reversal. Avoid chasing.",
    active: false,
    key: "t",
  },
  {
    id: "poor-risk-reward",
    name: "Risk/Reward <2:1 or Profit <10¢",
    shortName: "Poor R/R",
    points: -15,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    conflictsWith: ["good-risk-reward"],
    explanation:
      "Unfavorable setup - potential profit too small or stop too far",
    definition:
      "Risk/reward ratio less than 2:1 OR potential profit less than 10 cents per share. Not worth the risk - either the upside is too small or the stop is too far away. Skip this trade.",
    active: false,
    key: "m",
  },
  {
    id: "no-pullback",
    name: "No Pullback - Chasing Price",
    shortName: "No Pullback",
    points: -12,
    category: "bearish",
    confluenceCategory: "trend",
    conflictsWith: ["close-9ema", "first-two-pullbacks"],
    explanation:
      "Price is extended without a proper pullback - wait for a retest of support before entering",
    definition:
      "Stock is running up without a healthy pullback to support levels (9 EMA, 20 EMA, VWAP, etc.). Entering here means chasing price at resistance. Better to wait for price to pull back and test support before taking a position. Increases risk of buying the high.",
    active: false,
    key: "np",
  },
  {
    id: "far-from-9ema",
    name: "Too Far from 9 EMA",
    shortName: "Far 9EMA",
    points: -12,
    category: "bearish",
    confluenceCategory: "trend",
    conflictsWith: ["close-9ema"],
    explanation:
      "Overextended from support - high risk of pullback to moving average",
    definition:
      "Price has extended too far away from the 9 EMA. Increases risk of sharp pullback to the moving average. Wait for price to come back closer to support before entering.",
    active: false,
    key: "7",
  },
  {
    id: "retraced-50",
    name: "Retraced >50% of Move",
    shortName: "50% Retrace",
    points: -14,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    explanation:
      "Stock gave back over half its gains - momentum weakening, potential reversal",
    definition:
      "Stock has given back more than 50% of its recent upward move. This suggests weakening momentum and potential trend reversal. Fibonacci traders often use 50% retracement as a bearish signal.",
    active: false,
    key: "y",
  },
  {
    id: "third-pullback",
    name: "3rd Pullback",
    shortName: "3rd PB",
    points: -13,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    conflictsWith: ["first-two-pullbacks"],
    explanation:
      "Third pullback signals exhaustion - momentum fading, risk increasing",
    definition:
      "The third or later pullback in a trend. By this point, momentum is fading and risk increases significantly. Trend may be exhausting.",
    active: false,
    key: "f",
  },
  {
    id: "back-side",
    name: "Back Side of Move / Downtrending",
    shortName: "Back Side",
    points: -14,
    category: "bearish",
    confluenceCategory: "trend",
    disqualifiesA: true,
    explanation:
      "Chart is trending downwards overall - move already happened, entering now means buying near the top or in a downtrend",
    definition:
      "Stock has already made its move and is declining/consolidating OR the overall chart is trending downwards. Entering here means buying at or near the top or fighting the downtrend. High risk of being trapped in the reversal or continued downward move.",
    active: false,
    key: "v",
  },

  // PATTERN CATEGORY
  {
    id: "doji",
    name: "Doji Pattern",
    shortName: "Doji",
    points: -10,
    category: "bearish",
    confluenceCategory: "pattern",
    explanation:
      "Indecision candle at resistance - buyers unable to push higher, potential reversal",
    active: false,
    key: "i",
  },
  {
    id: "red-morning-star",
    name: "Evening Star",
    shortName: "Evening Star",
    points: -12,
    category: "bearish",
    confluenceCategory: "pattern",
    explanation: "Three-candle bearish reversal pattern - trend may be topping",
    active: false,
    key: "o",
  },
  {
    id: "bearish-engulfing",
    name: "Bearish Engulfing",
    shortName: "Bear Engulf",
    points: -12,
    category: "bearish",
    confluenceCategory: "pattern",
    conflictsWith: ["bullish-engulfing"],
    explanation:
      "Large red candle engulfs previous green - strong reversal signal",
    active: false,
    key: "p",
  },
  {
    id: "shooting-star",
    name: "Shooting Star",
    shortName: "Shoot Star",
    points: -12,
    category: "bearish",
    confluenceCategory: "pattern",
    conflictsWith: ["hammer"],
    explanation:
      "Long upper wick with small body - rejection of higher prices, bearish reversal",
    active: false,
    key: "[",
  },

  // SUPPORT/RESISTANCE CATEGORY
  {
    id: "resistance-whole",
    name: "At Whole Dollar Resistance",
    shortName: "Resist Whole",
    points: -12,
    category: "bearish",
    confluenceCategory: "support_resistance",
    conflictsWith: ["at-whole-dollar", "at-half-dollar"],
    explanation: "Price hitting psychological resistance at whole dollar level",
    active: false,
    key: "g",
  },
  {
    id: "resistance-half",
    name: "At Half Dollar Resistance",
    shortName: "Resist Half",
    points: -10,
    category: "bearish",
    confluenceCategory: "support_resistance",
    conflictsWith: ["at-whole-dollar", "at-half-dollar"],
    explanation: "Price struggling at half dollar resistance level",
    active: false,
    key: "h",
  },
];

export interface NoGoCondition {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export const NO_GO_CONDITIONS: NoGoCondition[] = [
  {
    id: "below-vwap",
    name: "Below VWAP",
    description:
      "Price trading below Volume Weighted Average Price - weak institutional support",
    active: false,
  },
  {
    id: "prior-rejection",
    name: "Prior Sudden Rejection (Hidden Seller)",
    description:
      "Recent sharp rejection at this level indicates strong resistance/seller",
    active: false,
  },
  {
    id: "near-200ema",
    name: "Very Close to Daily 200 EMA",
    description: "Major resistance level that often causes reversals",
    active: false,
  },
];
