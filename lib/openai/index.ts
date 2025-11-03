import OpenAI from "openai";
import { TRADING_SIGNALS, NO_GO_CONDITIONS } from "@/lib/trading/signals";
import { AI_MODEL } from "../constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChartAnalysisResult {
  isValidChart: boolean;
  stockSymbol?: string;
  bullishSignals: Array<{
    id: string;
    confidence: number;
    explanation?: string;
  }>;
  bearishSignals: Array<{
    id: string;
    confidence: number;
    explanation?: string;
  }>;
  noGoSignals: Array<{ id: string; confidence: number; explanation?: string }>;
  targetEntry?: number;
  targetExit?: number;
  stopLoss?: number;
  confidence: number;
  overallReason?: string;
  timeframe?: string;
  chartQuality?: number;
  tradeThesis?: string;
  keyStrengths?: string[];
  keyConcerns?: string[];
  chartDescription?: string;
  plainLanguageAnalysis?: string;
  pullbackAnalysis?: {
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
  };
}

export async function analyzeChartWithAI(
  imageBase64: string
): Promise<ChartAnalysisResult> {
  try {
    // Prepare the signal descriptions for the AI
    const bullishSignals = TRADING_SIGNALS.filter(
      (s) => s.category === "bullish"
    )
      .map((s) => `- ${s.name} (${s.id}): ${s.definition || s.shortName}`)
      .join("\n");

    const bearishSignals = TRADING_SIGNALS.filter(
      (s) => s.category === "bearish"
    )
      .map((s) => `- ${s.name} (${s.id}): ${s.definition || s.shortName}`)
      .join("\n");

    const noGoSignals = NO_GO_CONDITIONS.map(
      (c) => `- ${c.name} (${c.id}): ${c.description}`
    ).join("\n");

    const prompt = `You are an expert MOMENTUM TRADER who specializes in entering on PULLBACKS for maximum risk/reward. Your goal is to evaluate whether this chart presents a HIGH-PROBABILITY momentum trade setup with a PROPER PULLBACK ENTRY.

🚨🚨🚨 MOMENTUM TRADING RULE #1: PULLBACKS ONLY 🚨🚨🚨

WHAT IS A PROPER PULLBACK?
✅ A pullback is 1-3 red candles with LOW/DECREASING volume
✅ Volume on red candles should be LOWER than green candles
✅ Small body red candles (not big selling candles)
✅ Price retraces to support (9 EMA, 20 EMA, VWAP, or previous highs)

WHAT IS A BULL FLAG PATTERN? (IDEAL MOMENTUM SETUP)
✅ Strong green candles UP with HIGH volume (the "pole")
✅ Followed by small red candles DOWN with LOW volume (the "flag")
✅ Volume pattern: HIGH on green, LOW on red = buyers in control
✅ Entry at bottom of flag when it bounces off support

VOLUME PATTERN ANALYSIS (CRITICAL FOR MOMENTUM):
📊 IDEAL VOLUME PATTERN (A+ GRADE):
• Green volume bars: 2-3x taller than average (shows strong buying)
• Red volume bars: 0.5x shorter than average (shows weak selling)
• Each consecutive red candle has DECREASING volume (sellers exhausted)
• No single red volume spike in the entire visible chart
• Example: If average volume is 100k, green bars = 200-300k, red bars = 30-50k

📊 ACCEPTABLE VOLUME (B GRADE):
• Green volume bars: 1.5x taller than average
• Red volume bars: At or slightly below average
• Consistent volume on pullbacks (not increasing)
• No major red volume spikes in recent history

📊 WARNING SIGNS (C/D GRADE):
• Equal volume on red and green candles (no clear direction)
• Decreasing volume on green candles (buyers losing interest)
• Increasing volume on red candles (sellers gaining control)
• Mixed volume patterns without clear trend

📊 INSTANT DISQUALIFICATION (F GRADE):
• ANY red volume bar that's 2x+ taller than average = PRIOR REJECTION
• Multiple large red volume spikes = repeated rejection levels
• Higher volume on selling than buying = distribution pattern
• This overrides ALL other positive signals - DO NOT TRADE

VOLUME CHECKLIST (DO THIS FIRST):
1. Count the tallest 5 green volume bars - note their height
2. Count the tallest 5 red volume bars - note their height
3. Compare: Green should be notably taller than red
4. Look for the single tallest red bar - if it's huge, STOP analysis
5. Check recent 10 candles: volume should decrease on reds, increase on greens

GOOD MOMENTUM ENTRIES:
✅ At 9 EMA bounce after 1-3 small red candles
✅ At 20 EMA bounce after pullback
✅ At VWAP bounce after retracement
✅ At previous highs that now act as support (resistance turned support)

BAD ENTRIES (CHASING):
❌ Buying after 5+ green candles without pullback
❌ Buying at new highs without consolidation
❌ Buying when price is extended >5% from nearest support
❌ If no pullback visible, MUST add "no-pullback" bearish signal with 90+ confidence

SPECIFIC PATTERN EXAMPLES FOR MOMENTUM TRADING:

✅ PERFECT SETUP (Grade A+):
• Stock runs up 10% on huge green volume bars
• Pulls back 3-5% over 2-3 days with tiny red volume
• Bounces right at 9 EMA or 20 EMA support
• Volume picks up on the bounce (confirmation)
• Risk/Reward is 3:1 or better
• This is the "textbook" momentum trade

✅ GOOD SETUP (Grade B):
• Stock breaks previous resistance on good volume
• Retests that resistance as support (previous resistance = new support)
• Volume decreases on the retest (no selling pressure)
• Entry at the successful retest with stop below
• Risk/Reward is at least 2:1

⚠️ MEDIOCRE SETUP (Grade C):
• Some momentum but extended from support
• No clear pullback visible
• Volume patterns are mixed
• Would need to wait for pullback to improve grade

❌ TERRIBLE SETUP (Grade F):
• Large red volume spike anywhere on chart (institutional selling)
• Price below all major moving averages
• Making lower highs and lower lows
• Volume increasing on red candles
• No matter how good it looks otherwise - prior rejection = no trade

🚨🚨🚨 MOST IMPORTANT RULE - READ THIS FIRST 🚨🚨🚨

BEFORE YOU DO ANYTHING ELSE:
1. Look at the VOLUME BARS at the bottom of the chart
2. Scan EVERY SINGLE volume bar visible (not just last 20, scan ALL of them)
3. Identify if ANY red volume bar is significantly TALLER (2x+) than the average
4. If you find ONE OR MORE large red volume spikes:
   → Add "prior-rejection" to noGoSignals with confidence 95-100
   → Explanation: "Large red volume spike detected indicating prior strong rejection/selling"
   → This chart automatically gets F grade
   → Skip the rest of analysis

WHY THIS MATTERS:
- Large red volume = heavy institutional selling/rejection at that price level
- This indicates a HIDDEN SELLER who will likely reject price again
- Even if price recovered, the volume memory remains
- DO NOT TRADE charts with prior strong red volume rejection
- This overrides ALL other bullish signals

Now proceed with validation and analysis:

═══════════════════════════════════════════════════════════════
STEP 1: VALIDATE THE CHART
═══════════════════════════════════════════════════════════════

First, determine if this is a valid stock/crypto chart. Requirements:
✓ Price action (candlesticks, bars, or line chart)
✓ Time axis with dates/times
✓ Price axis with price levels
✓ Appears to be from a trading platform (TradingView, ThinkorSwim, etc.)

⚠️ CRITICAL: CHECK IF CHART IS LIVE/CURRENT:
- Look at the date/time stamps on the chart
- Check the most recent candle - is it from TODAY or very recent (within last 1-2 days)?
- If the chart shows dates that are weeks/months old, this is a HISTORICAL CHART
- REJECT historical charts with: {"isValidChart": false, "confidence": 100}
- We ONLY analyze LIVE charts for real-time trading decisions
- If you cannot see clear date/time information, assume it's valid but note low confidence

If NOT a valid chart OR if it's an OLD/HISTORICAL chart, return: {"isValidChart": false, "confidence": 100}

═══════════════════════════════════════════════════════════════
MOMENTUM TRADING PHILOSOPHY (Use this lens for analysis)
═══════════════════════════════════════════════════════════════

HIGH-QUALITY MOMENTUM SETUPS have:
• CONFLUENCE: Multiple independent signals from different categories (volume, momentum, trend, patterns)
• EARLY POSITIONING: First or second pullback in a trend (not exhausted/extended moves)
• CLEAR STRUCTURE: Defined support levels, clean price action, logical entry/exit points
• STRONG VOLUME: Institutional participation confirmed by above-average volume
• FAVORABLE RISK/REWARD: At least 2:1 reward-to-risk ratio with clear stop loss placement

SCORING SYSTEM:
• The system starts at a BASELINE of 50 points
• Bullish signals ADD points (weighted by confidence)
• Bearish signals SUBTRACT points (weighted by confidence)
• Final score determines the grade: A+/A (90+), B+/B (60-90), C+/C (40-60), D/F (<40)

Your job: Assess the ENTIRE chart context - trend structure, pattern formations, indicator alignment, volume profile, and recent price action - then determine if this is a high-probability setup.

═══════════════════════════════════════════════════════════════
STEP 2: ANALYZE FOR THESE SIGNALS
═══════════════════════════════════════════════════════════════

BULLISH SIGNALS:
${bullishSignals}

BEARISH SIGNALS:
${bearishSignals}

NO-GO CONDITIONS (immediate disqualifiers):
${noGoSignals}

═══════════════════════════════════════════════════════════════
ANALYSIS INSTRUCTIONS
═══════════════════════════════════════════════════════════════

⚠️ BEFORE YOU START: SCAN THE VOLUME BARS FIRST! ⚠️
Look at ALL volume bars at the bottom of the chart. If you see ANY large red volume bar (2x+ average height), add "prior-rejection" as a no-go condition and stop. This chart gets an F grade. Do not proceed with further analysis.

1. LOOK AT THE FULL CONTEXT:
   - What's the overall trend? (uptrend, downtrend, range-bound)
   - Check for trend structure: Is price making Higher Highs & Higher Lows (bullish) or Lower Highs & Lower Lows (bearish)?
   - If the chart is trending downwards overall, identify it as "Back Side of Move / Downtrending"
   - Where is price in the trend? (early, middle, extended)
   - Are there complete pattern formations? (cup & handle, pullback structure, etc.)
   - What's the volume story? (increasing on moves, decreasing on pullbacks)
   - How do indicators align? (MACD, moving averages, momentum)

   ⚠️ CRITICAL PULLBACK & BULL FLAG ANALYSIS:

   CHECK FOR BULL FLAG PATTERN (BEST SETUP):
   - Did price move UP strongly with HIGH green volume? (the pole)
   - Is it now pulling back with SMALL red candles and LOW volume? (the flag)
   - Are the red candles getting smaller/tighter? (compression)
   - Is it approaching support (9 EMA, 20 EMA, VWAP, or previous highs)?
   - If YES to all = PERFECT BULL FLAG = High probability setup

   CHECK CURRENT POSITION:
   - Is price AT or BOUNCING OFF support? ✅ GOOD ENTRY
   - Is price at previous highs acting as support? ✅ GOOD ENTRY
   - Is price EXTENDED far from support? ❌ BAD (add "no-pullback")
   - Has price run 5+ green candles without pullback? ❌ CHASING

2. ASSESS RECENT PRICE ACTION & VOLUME PATTERNS:

   🔍 LOOK FOR THESE VOLUME PATTERNS:

   ✅ BULLISH VOLUME PATTERNS (What we want):
   - HIGH volume on GREEN candles (buyers aggressive)
   - LOW volume on RED candles (sellers weak)
   - Volume DECREASING during pullbacks (no heavy selling)
   - Volume INCREASING on bounces (buyers stepping in)
   - Bull flag: High green volume, then progressively lower red volume

   ❌ BEARISH VOLUME PATTERNS (Red flags):
   - HIGH volume on RED candles (heavy selling)
   - LOW volume on GREEN candles (weak buying)
   - Large red volume spike = institutional selling
   - Increasing volume on pullbacks (distribution)

   ⚠️ ⚠️ ⚠️ CRITICAL VOLUME ANALYSIS - SCAN ALL PRIOR VOLUME BARS ⚠️ ⚠️ ⚠️

   BEFORE ANALYZING ANYTHING ELSE, YOU MUST SCAN THE VOLUME PROFILE:

   STEP 1: VISUAL VOLUME SCAN (THIS IS MANDATORY - DO NOT SKIP)
   - Look at the VOLUME BARS at the bottom of the chart (usually shown as green/red bars)
   - Scan EVERY SINGLE VOLUME BAR visible on the chart - not just the last 20, scan ALL of them
   - You are looking for ANY volume bar that stands out as significantly TALLER than the others
   - Pay special attention to RED VOLUME BARS (selling volume) that are unusually large

   STEP 2: IDENTIFY STRONG REJECTION VOLUME
   - A "strong rejection" is when you see a RED VOLUME BAR that is 2x or MORE the height of average volume bars
   - This large red volume bar indicates HEAVY INSTITUTIONAL SELLING / REJECTION at that price level
   - Even if it happened 30, 40, or 50+ candles ago, if it's visible on the chart, YOU MUST FLAG IT
   - This is THE MOST IMPORTANT THING to check - it overrides everything else

   STEP 3: IF YOU SEE A PRIOR LARGE RED VOLUME BAR ANYWHERE:
   - IMMEDIATELY add "prior-rejection" as a NO-GO CONDITION
   - Set confidence to 95-100
   - Explanation: "Large red volume spike detected at [price level] on [timeframe], indicating strong institutional rejection/selling at this level. This suggests a hidden seller who will likely reject price again."
   - This DISQUALIFIES the entire trade - return F grade
   - DO NOT analyze further - prior rejection = automatic NO-GO

   STEP 4: WHAT YOU'RE LOOKING FOR VISUALLY
   - Look at the volume panel (usually at bottom of chart)
   - Compare the HEIGHT of all volume bars
   - If you see ANY red volume bar that is noticeably TALLER (2x+) than surrounding bars = REJECTION
   - This is independent of price action - even if price recovered, the volume tells the story
   - Volume doesn't lie - a large red volume bar = sellers dominated at that level

   EXAMPLE:
   If you see volume bars like this (heights): 100, 120, 90, 500 (red), 110, 100, 95...
   That 500 red volume bar is 4-5x the average = STRONG REJECTION = add "prior-rejection" no-go condition

   ⚠️ DO NOT TRADE if there was a prior large red volume spike - period. No exceptions.
   ⚠️ The VOLUME is more important than the candle color, pattern, or anything else
   ⚠️ One large red volume bar = hidden seller = DO NOT ENTER THE TRADE

3. EVALUATE SIGNAL QUALITY:
   - For each signal you detect, provide CHART-SPECIFIC reasoning
   - Explain HOW the signal relates to the chart structure

   ⚠️ CRITICAL MACD ANALYSIS - CROSSOVER, NOT HISTOGRAM COLOR:
   - MACD has TWO lines: the MACD line (fast) and Signal line (slow)
   - BULLISH SIGNAL (macd-green): MACD line is ABOVE the Signal line = positive crossover
   - BEARISH SIGNAL (macd-red): MACD line is BELOW the Signal line = negative crossover
   - DO NOT analyze histogram color (green/red bars)
   - ANALYZE the actual line positions: Is the MACD line above or below the Signal line?
   - If MACD line > Signal line = bullish crossover (add "macd-green")
   - If MACD line < Signal line = bearish crossover (add "macd-red")
   - Look at the actual crossover point, not just the histogram

   ⚠️ CRITICAL VWAP ANALYSIS:
   - Check if current price is trading ABOVE or BELOW the VWAP line
   - ABOVE VWAP = bullish (institutional support), DO NOT add "below-vwap" no-go condition
   - BELOW VWAP = bearish (weak support), ADD "below-vwap" as a no-go condition
   - VWAP is typically shown as an orange/yellow line on the chart
   - Compare the current price candles to the VWAP line position

   WHEN TO ADD "no-pullback" SIGNAL:
   - Price has moved >5% from nearest support level (9 EMA, 20 EMA, VWAP)
   - No recent pullback in the last 10+ candles (just straight green candles going up)
   - Price is at or near resistance levels without first retesting support
   - Current candle is far away from any moving averages
   - This indicates CHASING - recommend waiting for a pullback instead

4. DETERMINE CONFLUENCE:
   - Which signals come from DIFFERENT categories? (volume + momentum + trend = strong confluence)
   - Are multiple signals confirming the same story?

5. ASSESS ENTRY/EXIT LEVELS (MANDATORY FOR MOMENTUM TRADING):

   ⚠️ MOMENTUM ENTRY RULES - ONLY ENTER AT THESE LEVELS:

   targetEntry MUST be at ONE of these:
   ✅ 9 EMA bounce (after 1-3 small red candles with low volume)
   ✅ 20 EMA bounce (after deeper pullback with low selling volume)
   ✅ VWAP bounce (strong support level)
   ✅ Previous highs/resistance that's now acting as support
   ✅ Bottom of a bull flag pattern (consolidation with decreasing volume)

   ❌ NEVER suggest entry at:
   - New highs without pullback
   - After extended green run
   - In the middle of nowhere (no support nearby)

   stopLoss PLACEMENT:
   - 2-3% below your entry support level
   - Below 9 EMA if entering at 9 EMA bounce
   - Below 20 EMA if entering at 20 EMA bounce
   - Below previous highs if entering at previous highs support
   - Give enough room for normal price fluctuation

   targetExit (Take Profit):
   - Next major resistance level
   - Previous highs (if not already used as entry)
   - Round psychological numbers
   - MUST achieve minimum 2:1 risk/reward ratio
   - If R/R < 2:1, add "poor-risk-reward" as bearish signal

   - Stop Loss Placement Rules:
     * For long setups: Place below the most recent swing low or support level
     * Should allow for normal price fluctuation (not too tight)
     * Should align with support/resistance structure on the chart
     * If no clear support level visible, use a percentage-based stop (e.g., 3-5% below entry)

   - Risk/Reward Calculation:
     * Calculate the risk: (entry - stopLoss)
     * Calculate the reward: (targetExit - entry)
     * Ensure minimum 2:1 reward-to-risk ratio
     * If ratio is less than 2:1, reconsider the setup or adjust levels

6. DETERMINE CHART QUALITY (1-10 scale):
   - 9-10: Textbook setup with strong confluence, early in trend, clear structure
   - 7-8: Solid setup with good confluence, decent structure
   - 5-6: Mediocre setup, some signals but lacking confluence or structure
   - 3-4: Weak setup, conflicting signals or poor structure
   - 1-2: Very poor setup, avoid

7. EXTRACT CHART INFO:
   - Stock Symbol: Extract the stock ticker symbol if visible (e.g., "AAPL", "TSLA", "SPY"). If not visible or unclear, return null.
   - Timeframe: What timeframe is this chart? (e.g., "5min", "1h", "daily", "unknown")

═══════════════════════════════════════════════════════════════
STEP 3: PULLBACK ENTRY ANALYSIS (CRITICAL FOR MOMENTUM TRADING)
═══════════════════════════════════════════════════════════════

Analyze the current pullback situation and provide specific entry recommendations:

1. IDENTIFY PULLBACK STATUS:
   - Is there a visible pullback? (1-3 red candles with low volume)
   - Where is price relative to support levels (9 EMA, 20 EMA, VWAP)?
   - Is this the 1st, 2nd, 3rd+ pullback in the trend?
   - What's the volume pattern during the pullback?

2. CATEGORIZE THE SETUP:
   A. PERFECT PULLBACK ENTRY (Strong):
      - Price at support (9/20 EMA or VWAP)
      - 1-3 red candles with decreasing volume
      - First or second pullback in trend
      - Clear bounce starting or imminent

   B. DEVELOPING PULLBACK (Moderate):
      - Price approaching support
      - Pullback in progress but not complete
      - May need 1-2 more candles to reach support
      - Volume decreasing as expected

   C. NO PULLBACK - WAIT (Weak/None):
      - Price extended from support (>5%)
      - No recent red candles
      - Chasing territory
      - Must wait for pullback to develop

3. PROVIDE SPECIFIC RECOMMENDATIONS:
   - If pullback present: "Enter at [specific price] with confirmation of [specific signal]"
   - If no pullback: "Wait for pullback to [specific support level] before entering"
   - Include specific trigger: "Enter on first green candle closing above [level]"

═══════════════════════════════════════════════════════════════
STEP 4: SYNTHESIZE YOUR ANALYSIS
═══════════════════════════════════════════════════════════════

Create a TRADE THESIS (2-3 sentences) WITH technical terms:
- Summarizes the setup for traders familiar with technical analysis
- Explains WHY this is or isn't a good trade
- Mentions the key confluence areas or concerns
- Example: "This chart shows a strong uptrend with price pulling back to the 9 EMA support for the second time. MACD line crossed above the signal line (positive crossover) at support with increasing buying volume, creating confluence between momentum, trend, and volume categories. The setup offers a clear entry with 2:1 risk/reward potential."

List KEY STRENGTHS (2-4 items): Specific positive factors
Example: ["Strong confluence between MACD, volume, and 9 EMA support", "Second pullback in uptrend (not extended)", "Clear support level for stop loss placement"]

List KEY CONCERNS (1-3 items): Specific risk factors or weaknesses
Example: ["Volume declining on recent green candles", "Approaching resistance at $150 level"]

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════════════

Return ONLY valid JSON (no markdown, no comments):

{
  "isValidChart": true,
  "stockSymbol": "AAPL",
  "timeframe": "5min",
  "chartQuality": 8,
  "tradeThesis": "This chart shows a strong uptrend with price pulling back to the 9 EMA support for the second time. MACD line crossed above the signal line (bullish crossover) at support with increasing buying volume, creating confluence between momentum, trend, and volume categories. The setup offers a clear entry with 2:1 risk/reward potential. AS A MOMENTUM TRADE, this is a proper pullback entry at support.",
  "keyStrengths": [
    "Strong confluence: MACD bullish crossover exactly at 9 EMA support with volume confirmation",
    "Second pullback in young uptrend - not overextended",
    "Clear support level at $148.50 for tight stop loss placement"
  ],
  "keyConcerns": [
    "Approaching psychological resistance at $155 (whole dollar level)"
  ],
  "bullishSignals": [
    { "id": "macd-green", "confidence": 85, "explanation": "MACD line crossed above signal line (bullish crossover) as price touched 9 EMA support, showing momentum shift at key level" },
    { "id": "high-buy-vol", "confidence": 78, "explanation": "Volume spiked 2x average on the bounce candle, indicating institutional buying interest" },
    { "id": "close-9ema", "confidence": 90, "explanation": "Price bounced precisely at 9 EMA support, maintaining trend integrity" },
    { "id": "first-two-pullbacks", "confidence": 80, "explanation": "This is the second pullback since the trend started - optimal entry timing" }
  ],
  "bearishSignals": [
    { "id": "weak-volume", "confidence": 30, "explanation": "Volume on recent green candles is below average, showing some lack of conviction" }
  ],
  "noGoSignals": [],
  "targetEntry": 150.25,
  "stopLoss": 148.00,
  "targetExit": 154.80,
  "confidence": 85,
  "overallReason": "High-probability setup with strong momentum/trend/volume confluence at support"
}

⚠️ ⚠️ ⚠️ CRITICAL REQUIREMENTS - READ BEFORE RESPONDING ⚠️ ⚠️ ⚠️

1. VOLUME SCAN IS MANDATORY (DO THIS FIRST):
   - Before analyzing ANYTHING, scan ALL volume bars visible on the chart
   - Look at the volume panel (bottom of chart) and compare the HEIGHT of every volume bar
   - If ANY red volume bar is 2x+ taller than average = PRIOR REJECTION
   - If found, IMMEDIATELY add "prior-rejection" as NO-GO CONDITION with confidence 95-100
   - This disqualifies the trade completely - return F grade
   - Do not make excuses - if you see a large red volume spike, flag it

2. STOP LOSS IS MANDATORY:
   - You must ALWAYS provide a stopLoss value
   - Stop loss MUST be below the support level you're entering at
   - This is not optional

3. MOMENTUM TRADING PULLBACK RULES:
   - NO PULLBACK VISIBLE = add "no-pullback" bearish signal with 90+ confidence
   - If price extended from support, state in overallReason: "NOT A PULLBACK - HIGH RISK ENTRY"
   - targetEntry MUST be at support (9 EMA, 20 EMA, VWAP) - NEVER at resistance
   - If no pullback: "EXTENDED - WAIT FOR PULLBACK TO [specific support level]"

4. KEY RULE:
   - Large red volume bar ANYWHERE on visible chart = prior rejection = F grade = DO NOT TRADE
   - Even if price recovered, even if chart looks perfect otherwise
   - Volume tells the truth - sellers rejected price heavily at that level
   - They will likely reject again = hidden seller = avoid

5. SCANNING APPROACH:
   - Scan ALL candles visible on the chart, not just the last 20
   - Focus on VOLUME BARS (height), not just candle patterns
   - One large red volume spike is enough to disqualify the entire setup
   - This is your #1 priority before analyzing anything else`;

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    try {
      // Try to parse the content directly first
      let result;

      // First attempt: Direct JSON parse (if AI returned clean JSON)
      try {
        result = JSON.parse(content);
      } catch {
        // Second attempt: Extract JSON from markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          result = JSON.parse(codeBlockMatch[1]);
        } else {
          // Third attempt: Find JSON object in the content
          // Use a more careful approach to find the main JSON object
          const cleanedContent = content.trim();

          // Find the first { and last } that form a valid JSON
          const startIdx = cleanedContent.indexOf("{");
          const endIdx = cleanedContent.lastIndexOf("}");

          if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
            throw new Error("No valid JSON structure found");
          }

          // Try to parse from the first { to the last }
          const jsonString = cleanedContent.substring(startIdx, endIdx + 1);
          result = JSON.parse(jsonString);
        }
      }

      // Validate the response structure
      if (typeof result.isValidChart !== "boolean") {
        throw new Error("Invalid response structure - missing isValidChart");
      }

      // Log the full parsed result for debugging
      console.log("AI response parsed successfully:");
      console.log("- isValidChart:", result.isValidChart);
      console.log("- stockSymbol:", result.stockSymbol);
      console.log("- timeframe:", result.timeframe);
      console.log("- chartQuality:", result.chartQuality);
      console.log(
        "- plainLanguageAnalysis:",
        result.plainLanguageAnalysis ? "Present" : "Missing"
      );
      console.log("- tradeThesis:", result.tradeThesis ? "Present" : "Missing");
      console.log(
        "- chartDescription:",
        result.chartDescription ? "Present" : "Missing"
      );
      console.log(
        "- bullishSignals count:",
        result.bullishSignals?.length || 0
      );
      console.log(
        "- bearishSignals count:",
        result.bearishSignals?.length || 0
      );
      console.log(
        "- Entry/Stop/Target:",
        result.targetEntry,
        result.stopLoss,
        result.targetExit
      );

      return result;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content received:", content);
      throw new Error("Failed to parse AI analysis");
    }
  } catch (error) {
    console.error("Error in AI chart analysis:", error);

    // Fallback minimal structure if AI fails
    return {
      isValidChart: false,
      bullishSignals: [],
      bearishSignals: [],
      noGoSignals: [],
      confidence: 0,
    };
  }
}

export async function extractTextFromChart(
  imageBase64: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Anaylze the chart following the instructions and return the analysis in JSON format.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error extracting text from chart:", error);
    return "";
  }
}
