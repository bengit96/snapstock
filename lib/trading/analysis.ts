import {
  TradingSignal,
  NoGoCondition,
  TRADING_SIGNALS,
  NO_GO_CONDITIONS,
} from "./signals";

export interface AnalysisResult {
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  gradeColor: string;
  gradeLabel: string;
  gradeDescription?: string;
  totalScore: number;
  shouldEnter: boolean;
  activeBullishSignals: (TradingSignal & {
    confidence: number;
    explanation?: string;
  })[];
  activeBearishSignals: (TradingSignal & {
    confidence: number;
    explanation?: string;
  })[];
  activeNoGoConditions: (NoGoCondition & {
    confidence?: number;
    explanation?: string;
  })[];
  confluenceCount: number;
  confluenceCategories: string[];
  reasons: string[];
  overallReason?: string;
  chartSummary?: string; // Human-readable summary for users
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
}

export interface StrategyAnalysisInput {
  bullishSignals: { id: string; confidence: number; explanation?: string }[];
  bearishSignals: { id: string; confidence: number; explanation?: string }[];
  noGoSignals: { id: string; confidence: number; explanation?: string }[];
  targetEntry?: number;
  targetExit?: number;
  stopLoss?: number;
  chartDescription?: string;
  plainLanguageAnalysis?: string;
  tradeThesis?: string;
  overallReason?: string;
  confidence: number;
}

export function analyzeChart(input: StrategyAnalysisInput): AnalysisResult {
  // Get active signals with their confidence scores
  let activeBullishSignals = TRADING_SIGNALS.filter(
    (signal) =>
      signal.category === "bullish" &&
      input.bullishSignals.some((s) => s.id === signal.id && s.confidence >= 50)
  ).map((signal) => ({
    ...signal,
    confidence:
      input.bullishSignals.find((s) => s.id === signal.id)?.confidence || 0,
    explanation: input.bullishSignals.find((s) => s.id === signal.id)
      ?.explanation,
  }));

  let activeBearishSignals = TRADING_SIGNALS.filter(
    (signal) =>
      signal.category === "bearish" &&
      input.bearishSignals.some((s) => s.id === signal.id && s.confidence >= 50)
  ).map((signal) => ({
    ...signal,
    confidence:
      input.bearishSignals.find((s) => s.id === signal.id)?.confidence || 0,
    explanation: input.bearishSignals.find((s) => s.id === signal.id)
      ?.explanation,
  }));

  // Step 1: Resolve direct signal conflicts (e.g., macd-green vs macd-red)
  const allActiveSignals = [...activeBullishSignals, ...activeBearishSignals];
  const signalsToRemove = new Set<string>();

  allActiveSignals.forEach((signal) => {
    if (signal.conflictsWith && !signalsToRemove.has(signal.id)) {
      signal.conflictsWith.forEach((conflictId) => {
        const conflictingSignal = allActiveSignals.find(
          (s) => s.id === conflictId
        );
        if (conflictingSignal && !signalsToRemove.has(conflictId)) {
          // Remove the signal with lower confidence
          if (signal.confidence > conflictingSignal.confidence) {
            signalsToRemove.add(conflictId);
          } else if (signal.confidence < conflictingSignal.confidence) {
            signalsToRemove.add(signal.id);
          } else {
            // If confidence is equal, remove the one with fewer points (less important)
            if (Math.abs(signal.points) < Math.abs(conflictingSignal.points)) {
              signalsToRemove.add(signal.id);
            } else {
              signalsToRemove.add(conflictId);
            }
          }
        }
      });
    }
  });

  // Filter out conflicting signals
  activeBullishSignals = activeBullishSignals.filter(
    (s) => !signalsToRemove.has(s.id)
  );
  activeBearishSignals = activeBearishSignals.filter(
    (s) => !signalsToRemove.has(s.id)
  );

  // Step 2: Deconflict by category - each category should appear only once
  // Within bullish signals, keep only the highest confidence signal per category
  const bullishByCategory = new Map<string, (typeof activeBullishSignals)[0]>();
  activeBullishSignals.forEach((signal) => {
    if (signal.confluenceCategory) {
      const existing = bullishByCategory.get(signal.confluenceCategory);
      if (
        !existing ||
        signal.confidence > existing.confidence ||
        (signal.confidence === existing.confidence &&
          Math.abs(signal.points) > Math.abs(existing.points))
      ) {
        bullishByCategory.set(signal.confluenceCategory, signal);
      }
    }
  });

  // Within bearish signals, keep only the highest confidence signal per category
  const bearishByCategory = new Map<string, (typeof activeBearishSignals)[0]>();
  activeBearishSignals.forEach((signal) => {
    if (signal.confluenceCategory) {
      const existing = bearishByCategory.get(signal.confluenceCategory);
      if (
        !existing ||
        signal.confidence > existing.confidence ||
        (signal.confidence === existing.confidence &&
          Math.abs(signal.points) > Math.abs(existing.points))
      ) {
        bearishByCategory.set(signal.confluenceCategory, signal);
      }
    }
  });

  // Step 3: Cross-category deconfliction - if a category appears in both bullish and bearish,
  // keep only the one with higher confidence
  const categoriesToRemoveFromBullish = new Set<string>();
  const categoriesToRemoveFromBearish = new Set<string>();

  bullishByCategory.forEach((bullishSignal, category) => {
    const bearishSignal = bearishByCategory.get(category);
    if (bearishSignal) {
      // Category appears in both - keep the one with higher confidence
      if (bullishSignal.confidence > bearishSignal.confidence) {
        categoriesToRemoveFromBearish.add(category);
      } else if (bearishSignal.confidence > bullishSignal.confidence) {
        categoriesToRemoveFromBullish.add(category);
      } else {
        // Equal confidence - keep the one with more points (stronger signal)
        if (Math.abs(bullishSignal.points) >= Math.abs(bearishSignal.points)) {
          categoriesToRemoveFromBearish.add(category);
        } else {
          categoriesToRemoveFromBullish.add(category);
        }
      }
    }
  });

  // Remove conflicting categories
  categoriesToRemoveFromBullish.forEach((cat) => bullishByCategory.delete(cat));
  categoriesToRemoveFromBearish.forEach((cat) => bearishByCategory.delete(cat));

  // Update final signal lists - only keep signals that made it through category deconfliction
  const finalBullishIds = new Set(
    Array.from(bullishByCategory.values()).map((s) => s.id)
  );
  const finalBearishIds = new Set(
    Array.from(bearishByCategory.values()).map((s) => s.id)
  );

  activeBullishSignals = activeBullishSignals.filter(
    (s) => !s.confluenceCategory || finalBullishIds.has(s.id)
  );
  activeBearishSignals = activeBearishSignals.filter(
    (s) => !s.confluenceCategory || finalBearishIds.has(s.id)
  );

  const activeNoGoConditions = NO_GO_CONDITIONS.filter((condition) =>
    input.noGoSignals.some((s) => s.id === condition.id && s.confidence >= 50)
  ).map((condition) => ({
    ...condition,
    confidence: input.noGoSignals.find((s) => s.id === condition.id)
      ?.confidence,
    explanation: input.noGoSignals.find((s) => s.id === condition.id)
      ?.explanation,
  }));

  // Calculate total score (START FROM 50 BASELINE, then add/deduct points)
  const baseScore = 50;
  const bullishScore = activeBullishSignals.reduce(
    (sum, signal) => sum + signal.points * (signal.confidence / 100),
    0
  );
  let bearishScore = activeBearishSignals.reduce(
    (sum, signal) => sum + Math.abs(signal.points) * (signal.confidence / 100),
    0
  );
  let totalScore = baseScore + bullishScore - bearishScore;

  // Count confluence categories
  const confluenceCategories = new Set<string>();
  activeBullishSignals.forEach((signal) => {
    if (signal.confluenceCategory) {
      confluenceCategories.add(signal.confluenceCategory);
    }
  });
  const confluenceCount = confluenceCategories.size;

  // Check for disqualifying signals
  const hasDisqualifyingSignal = activeBearishSignals.some(
    (signal) => signal.disqualifiesA === true
  );
  const hasNoGo = activeNoGoConditions.length > 0;

  // Determine grade
  let grade: AnalysisResult["grade"];
  let gradeColor: string;
  let gradeLabel: string;
  let gradeDescription: string | undefined;

  if (hasNoGo) {
    grade = "F";
    gradeColor = "#dc2626";
    gradeLabel = "NO-GO!";
    gradeDescription = activeNoGoConditions.map((c) => c.name).join(", ");
  } else if (
    totalScore >= 90 &&
    activeBullishSignals.length >= 5 &&
    confluenceCount >= 3 &&
    !hasDisqualifyingSignal
  ) {
    grade = "A+";
    gradeColor = "#10b981";
    gradeLabel = "TAKE IT!";
    gradeDescription = `${confluenceCount} confluence areas`;
  } else if (
    totalScore >= 75 &&
    activeBullishSignals.length >= 4 &&
    confluenceCount >= 2 &&
    activeBearishSignals.length <= 1
  ) {
    grade = "A";
    gradeColor = "#22c55e";
    gradeLabel = "GREAT!";
    gradeDescription = `${confluenceCount} confluence areas`;
  } else if (totalScore >= 60 && activeBullishSignals.length >= 3) {
    grade = "B+";
    gradeColor = "#84cc16";
    gradeLabel = "GOOD";
    gradeDescription = `${confluenceCount} confluence areas`;
  } else if (totalScore >= 50) {
    grade = "B";
    gradeColor = "#eab308";
    gradeLabel = "DECENT";
  } else if (totalScore >= 40) {
    grade = "C+";
    gradeColor = "#f59e0b";
    gradeLabel = "RISKY";
  } else if (totalScore >= 30) {
    grade = "C";
    gradeColor = "#f97316";
    gradeLabel = "WEAK";
  } else if (totalScore >= 20) {
    grade = "D";
    gradeColor = "#ef4444";
    gradeLabel = "POOR";
  } else {
    grade = "F";
    gradeColor = "#dc2626";
    gradeLabel = "SKIP!";
  }

  // Determine if should enter (D and F are no-go)
  let shouldEnter = grade !== "D" && grade !== "F";

  // Calculate trade parameters if we should enter
  let entryPrice: number | undefined;
  let stopLoss: number | undefined;
  let takeProfit: number | undefined;
  let riskRewardRatio: number | undefined;

  if (shouldEnter) {
    if (typeof input.targetEntry === "number") {
      entryPrice = input.targetEntry;
    }
    if (typeof input.targetExit === "number") {
      takeProfit = input.targetExit;
    }
    if (typeof input.stopLoss === "number") {
      stopLoss = input.stopLoss;
    }

    // Calculate risk/reward ratio if we have all values
    if (entryPrice && stopLoss && takeProfit) {
      const risk = entryPrice - stopLoss;
      const reward = takeProfit - entryPrice;
      if (risk > 0) {
        riskRewardRatio = reward / risk;

        // Add poor risk/reward as a bearish signal if less than 2:1
        if (riskRewardRatio < 2.0) {
          const poorRiskRewardSignal = {
            id: "poor-risk-reward",
            name: "Poor Risk/Reward",
            shortName: "R/R < 2",
            points: -15,
            category: "bearish" as const,
            confluenceCategory: "risk_management",
            confidence: 95,
            explanation: `Risk/reward ratio is ${riskRewardRatio.toFixed(1)}:1 (below minimum 2:1 requirement)`,
            active: true,
            key: "poor-risk-reward",
            conflictsWith: [],
            disqualifiesA: false,
          };

          // Add to bearish signals
          activeBearishSignals.push(poorRiskRewardSignal);

          // Recalculate score with this new signal
          const bearishPenalty = Math.abs(poorRiskRewardSignal.points) * (poorRiskRewardSignal.confidence / 100);
          bearishScore += bearishPenalty;
          totalScore -= bearishPenalty;

          // Re-evaluate grade based on new score
          if (totalScore < 60) {
            shouldEnter = false;
          }
        }
      }
    }

    // Check for red volume spikes mentioned in trade thesis or overall reason
    const textToCheck = [
      input.tradeThesis || '',
      input.overallReason || '',
      input.plainLanguageAnalysis || ''
    ].join(' ').toLowerCase();

    const redVolumePatterns = [
      'red volume spike',
      'large red volume',
      'high red volume',
      'selling pressure',
      'heavy selling',
      'strong selling volume',
      'significant red volume',
      'massive red volume',
      'red volume bar'
    ];

    const hasRedVolumeSpike = redVolumePatterns.some(pattern =>
      textToCheck.includes(pattern)
    );

    // If red volume spike is mentioned but not already in bearish signals
    if (hasRedVolumeSpike && !activeBearishSignals.some(s =>
      s.id === 'red-volume-spike' ||
      s.id === 'heavy-sell-vol' ||
      s.id === 'weak-volume'
    )) {
      const redVolumeSpikeSignal = {
        id: "red-volume-spike",
        name: "Red Volume Spike Detected",
        shortName: "Red Vol Spike",
        points: -20, // Higher penalty for red volume spikes
        category: "bearish" as const,
        confluenceCategory: "volume",
        confidence: 90,
        explanation: "Large red volume spikes indicate institutional selling or strong rejection at this level",
        active: true,
        key: "red-volume-spike",
        conflictsWith: [],
        disqualifiesA: true, // Red volume spikes should disqualify A grades
      };

      // Add to bearish signals
      activeBearishSignals.push(redVolumeSpikeSignal);

      // Recalculate score with this new signal
      const bearishPenalty = Math.abs(redVolumeSpikeSignal.points) * (redVolumeSpikeSignal.confidence / 100);
      bearishScore += bearishPenalty;
      totalScore -= bearishPenalty;

      // Re-evaluate - red volume spikes are very risky
      if (totalScore < 70) {
        shouldEnter = false;
      }
    }
  }

  // Generate reasons - concise and tied to most recent state
  const reasons: string[] = [];

  if (hasNoGo) {
    reasons.push(`${activeNoGoConditions.length} risk factor(s) detected`);
  }

  if (activeBullishSignals.length > 0) {
    const topBull = [...activeBullishSignals].sort(
      (a, b) => b.confidence - a.confidence
    )[0];
    reasons.push(
      `${activeBullishSignals.length} bullish signal(s) — e.g., ${
        topBull.shortName
      }: ${topBull.explanation || "recent confirmation"}`
    );
  }

  if (activeBearishSignals.length > 0) {
    const topBear = [...activeBearishSignals].sort(
      (a, b) => b.confidence - a.confidence
    )[0];
    reasons.push(
      `${activeBearishSignals.length} bearish signal(s) — e.g., ${
        topBear.shortName
      }: ${topBear.explanation || "recent weakness"}`
    );
  }

  if (confluenceCount > 0) {
    reasons.push(`${confluenceCount} confluence area(s)`);
  }

  if (hasDisqualifyingSignal) {
    reasons.push("Disqualifying condition present");
  }

  // Generate human-readable chart summary
  // Prioritize plain language analysis, then chart description, then generate one
  let chartSummary = "";

  if (input.plainLanguageAnalysis) {
    // AI provided a plain language analysis - use it (no jargon)
    chartSummary = input.plainLanguageAnalysis;
  } else if (input.chartDescription) {
    // AI provided a detailed description - use it as is
    chartSummary = input.chartDescription;
  } else if (hasNoGo) {
    const conditionNames = activeNoGoConditions.map(c => c.name).join(" and ");
    chartSummary = `This chart shows significant risk factors including ${conditionNames}. These conditions suggest caution and may indicate an unfavorable trading environment.`;
  } else if (grade === "A+" || grade === "A") {
    const bullishNames = activeBullishSignals.slice(0, 2).map(s => s.name).join(" and ");
    chartSummary = `This chart displays strong bullish momentum with ${activeBullishSignals.length} positive signal${activeBullishSignals.length > 1 ? 's' : ''}, including ${bullishNames}. `;
    if (confluenceCount >= 2) {
      chartSummary += `Multiple technical indicators are aligning (${confluenceCount} confluence areas), which strengthens the bullish case. `;
    }
    if (activeBearishSignals.length > 0) {
      chartSummary += `While there are ${activeBearishSignals.length} bearish signal${activeBearishSignals.length > 1 ? 's' : ''} present, the bullish signals are stronger and more dominant.`;
    } else {
      chartSummary += `The absence of significant bearish signals further supports the positive outlook.`;
    }
  } else if (grade === "B+" || grade === "B") {
    chartSummary = `This chart shows a moderately positive setup with ${activeBullishSignals.length} bullish signal${activeBullishSignals.length > 1 ? 's' : ''}. `;
    if (activeBearishSignals.length > 0) {
      chartSummary += `However, there are ${activeBearishSignals.length} bearish signal${activeBearishSignals.length > 1 ? 's' : ''} that may limit the upside potential. `;
    }
    chartSummary += `Consider this a decent opportunity with moderate risk.`;
  } else if (grade === "C+" || grade === "C") {
    chartSummary = `This chart presents a mixed picture with both bullish and bearish signals. `;
    if (activeBullishSignals.length > activeBearishSignals.length) {
      chartSummary += `While there are more bullish signals (${activeBullishSignals.length}) than bearish (${activeBearishSignals.length}), the overall strength is limited. `;
    } else {
      chartSummary += `The bearish signals (${activeBearishSignals.length}) are offsetting the bullish momentum (${activeBullishSignals.length}). `;
    }
    chartSummary += `This setup carries higher risk and may not provide a favorable risk-reward ratio.`;
  } else {
    // D or F
    if (activeBearishSignals.length > 0) {
      const bearishNames = activeBearishSignals.slice(0, 2).map(s => s.name).join(" and ");
      chartSummary = `This chart is showing bearish characteristics with ${activeBearishSignals.length} negative signal${activeBearishSignals.length > 1 ? 's' : ''}, including ${bearishNames}. `;
    } else {
      chartSummary = `This chart lacks sufficient positive signals to support a strong trading thesis. `;
    }
    if (hasDisqualifyingSignal) {
      chartSummary += `Additionally, there are disqualifying conditions present that make this setup unattractive. `;
    }
    chartSummary += `It's recommended to skip this trade opportunity and wait for a better setup.`;
  }

  return {
    grade,
    gradeColor,
    gradeLabel,
    gradeDescription,
    totalScore,
    shouldEnter,
    activeBullishSignals,
    activeBearishSignals,
    activeNoGoConditions,
    confluenceCount,
    confluenceCategories: Array.from(confluenceCategories),
    reasons,
    overallReason: reasons[0],
    chartSummary,
    entryPrice,
    stopLoss,
    takeProfit,
    riskRewardRatio,
  };
}

export function checkConflicts(activeSignals: TradingSignal[]): string[] {
  const conflicts: string[] = [];
  const activeIds = activeSignals.map((s) => s.id);

  activeSignals.forEach((signal) => {
    if (signal.conflictsWith) {
      signal.conflictsWith.forEach((conflictId) => {
        if (activeIds.includes(conflictId)) {
          conflicts.push(`${signal.name} conflicts with ${conflictId}`);
        }
      });
    }
  });

  return conflicts;
}
