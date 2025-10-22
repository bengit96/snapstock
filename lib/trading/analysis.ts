import { TradingSignal, NoGoCondition, TRADING_SIGNALS, NO_GO_CONDITIONS } from './signals'

export interface AnalysisResult {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  gradeColor: string
  gradeLabel: string
  gradeDescription?: string
  totalScore: number
  shouldEnter: boolean
  activeBullishSignals: TradingSignal[]
  activeBearishSignals: TradingSignal[]
  activeNoGoConditions: NoGoCondition[]
  confluenceCount: number
  confluenceCategories: string[]
  reasons: string[]
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  riskRewardRatio?: number
}

export interface ChartAnalysisInput {
  activeSignalIds: string[]
  activeNoGoIds: string[]
  currentPrice?: number
  supportLevel?: number
  resistanceLevel?: number
}

export function analyzeChart(input: ChartAnalysisInput): AnalysisResult {
  // Get active signals
  const activeBullishSignals = TRADING_SIGNALS.filter(
    signal => signal.category === 'bullish' && input.activeSignalIds.includes(signal.id)
  )

  const activeBearishSignals = TRADING_SIGNALS.filter(
    signal => signal.category === 'bearish' && input.activeSignalIds.includes(signal.id)
  )

  const activeNoGoConditions = NO_GO_CONDITIONS.filter(
    condition => input.activeNoGoIds.includes(condition.id)
  )

  // Calculate total score
  const bullishScore = activeBullishSignals.reduce((sum, signal) => sum + signal.points, 0)
  const bearishScore = activeBearishSignals.reduce((sum, signal) => sum + Math.abs(signal.points), 0)
  const totalScore = bullishScore - bearishScore

  // Count confluence categories
  const confluenceCategories = new Set<string>()
  activeBullishSignals.forEach(signal => {
    if (signal.confluenceCategory) {
      confluenceCategories.add(signal.confluenceCategory)
    }
  })
  const confluenceCount = confluenceCategories.size

  // Check for disqualifying signals
  const hasDisqualifyingSignal = activeBearishSignals.some(signal => signal.disqualifiesA === true)
  const hasNoGo = activeNoGoConditions.length > 0

  // Determine grade
  let grade: AnalysisResult['grade']
  let gradeColor: string
  let gradeLabel: string
  let gradeDescription: string | undefined

  if (hasNoGo) {
    grade = 'F'
    gradeColor = '#dc2626'
    gradeLabel = 'NO-GO!'
    gradeDescription = activeNoGoConditions.map(c => c.name).join(', ')
  } else if (totalScore >= 90 && activeBullishSignals.length >= 5 && confluenceCount >= 3 && !hasDisqualifyingSignal) {
    grade = 'A+'
    gradeColor = '#10b981'
    gradeLabel = 'TAKE IT!'
    gradeDescription = `${confluenceCount} confluence areas`
  } else if (totalScore >= 75 && activeBullishSignals.length >= 4 && confluenceCount >= 2 && activeBearishSignals.length <= 1) {
    grade = 'A'
    gradeColor = '#22c55e'
    gradeLabel = 'GREAT!'
    gradeDescription = `${confluenceCount} confluence areas`
  } else if (totalScore >= 60 && activeBullishSignals.length >= 3) {
    grade = 'B+'
    gradeColor = '#84cc16'
    gradeLabel = 'GOOD'
    gradeDescription = `${confluenceCount} confluence areas`
  } else if (totalScore >= 50) {
    grade = 'B'
    gradeColor = '#eab308'
    gradeLabel = 'DECENT'
  } else if (totalScore >= 40) {
    grade = 'C+'
    gradeColor = '#f59e0b'
    gradeLabel = 'RISKY'
  } else if (totalScore >= 30) {
    grade = 'C'
    gradeColor = '#f97316'
    gradeLabel = 'WEAK'
  } else if (totalScore >= 20) {
    grade = 'D'
    gradeColor = '#ef4444'
    gradeLabel = 'POOR'
  } else {
    grade = 'F'
    gradeColor = '#dc2626'
    gradeLabel = 'SKIP!'
  }

  // Determine if should enter (D and F are no-go)
  const shouldEnter = grade !== 'D' && grade !== 'F'

  // Calculate trade parameters if we should enter
  let entryPrice: number | undefined
  let stopLoss: number | undefined
  let takeProfit: number | undefined
  let riskRewardRatio: number | undefined

  if (shouldEnter && input.currentPrice && input.supportLevel && input.resistanceLevel) {
    entryPrice = input.currentPrice
    stopLoss = input.supportLevel - (input.currentPrice - input.supportLevel) * 0.1 // Stop below support
    takeProfit = input.resistanceLevel - (input.resistanceLevel - input.currentPrice) * 0.1 // Target near resistance

    const risk = entryPrice - stopLoss
    const reward = takeProfit - entryPrice
    riskRewardRatio = reward / risk
  }

  // Generate reasons
  const reasons: string[] = []

  if (hasNoGo) {
    reasons.push('NO-GO conditions present: ' + activeNoGoConditions.map(c => c.name).join(', '))
  }

  if (activeBullishSignals.length > 0) {
    reasons.push(`Bullish signals (${activeBullishSignals.length}): ${activeBullishSignals.slice(0, 3).map(s => s.shortName).join(', ')}`)
  }

  if (activeBearishSignals.length > 0) {
    reasons.push(`Bearish signals (${activeBearishSignals.length}): ${activeBearishSignals.slice(0, 3).map(s => s.shortName).join(', ')}`)
  }

  if (confluenceCount > 0) {
    reasons.push(`Confluence areas (${confluenceCount}): ${Array.from(confluenceCategories).join(', ')}`)
  }

  if (hasDisqualifyingSignal) {
    reasons.push('Disqualifying signal present')
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
    entryPrice,
    stopLoss,
    takeProfit,
    riskRewardRatio,
  }
}

export function checkConflicts(activeSignals: TradingSignal[]): string[] {
  const conflicts: string[] = []
  const activeIds = activeSignals.map(s => s.id)

  activeSignals.forEach(signal => {
    if (signal.conflictsWith) {
      signal.conflictsWith.forEach(conflictId => {
        if (activeIds.includes(conflictId)) {
          conflicts.push(`${signal.name} conflicts with ${conflictId}`)
        }
      })
    }
  })

  return conflicts
}