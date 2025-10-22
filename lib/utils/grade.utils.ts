import { GRADE_THRESHOLDS } from '@/lib/constants'
import type { TradeGrade, TradingSignal, NoGoCondition } from '@/lib/types'
import { GRADE_BADGES, GRADE_COLORS } from '@/lib/types'

/**
 * Get badge color class for a grade
 */
export function getGradeBadgeClass(grade: TradeGrade): string {
  return GRADE_BADGES[grade] || 'bg-gray-500'
}

/**
 * Get color hex value for a grade
 */
export function getGradeColor(grade: TradeGrade): string {
  return GRADE_COLORS[grade] || '#6b7280'
}

/**
 * Calculate grade from signals
 */
export function calculateGrade(
  totalScore: number,
  bullishCount: number,
  confluenceCount: number,
  hasNoGo: boolean,
  hasDisqualifyingSignal: boolean,
  activeBearishCount: number
): TradeGrade {
  // NO-GO conditions override everything
  if (hasNoGo) {
    return 'F'
  }

  // Check A+ criteria
  if (
    totalScore >= GRADE_THRESHOLDS['A+'].score &&
    bullishCount >= GRADE_THRESHOLDS['A+'].bullishCount &&
    confluenceCount >= GRADE_THRESHOLDS['A+'].confluenceCount &&
    !hasDisqualifyingSignal
  ) {
    return 'A+'
  }

  // Check A criteria
  if (
    totalScore >= GRADE_THRESHOLDS['A'].score &&
    bullishCount >= GRADE_THRESHOLDS['A'].bullishCount &&
    confluenceCount >= GRADE_THRESHOLDS['A'].confluenceCount &&
    activeBearishCount <= 1
  ) {
    return 'A'
  }

  // Check B+ criteria
  if (
    totalScore >= GRADE_THRESHOLDS['B+'].score &&
    bullishCount >= GRADE_THRESHOLDS['B+'].bullishCount
  ) {
    return 'B+'
  }

  // Score-based grades
  if (totalScore >= GRADE_THRESHOLDS['B'].score) return 'B'
  if (totalScore >= GRADE_THRESHOLDS['C+'].score) return 'C+'
  if (totalScore >= GRADE_THRESHOLDS['C'].score) return 'C'
  if (totalScore >= GRADE_THRESHOLDS['D'].score) return 'D'

  return 'F'
}

/**
 * Get grade label
 */
export function getGradeLabel(grade: TradeGrade): string {
  const labels: Record<TradeGrade, string> = {
    'A+': 'TAKE IT!',
    'A': 'GREAT!',
    'B+': 'GOOD',
    'B': 'DECENT',
    'C+': 'RISKY',
    'C': 'WEAK',
    'D': 'POOR',
    'F': 'SKIP!',
  }
  return labels[grade] || 'UNKNOWN'
}

/**
 * Get grade description
 */
export function getGradeDescription(
  grade: TradeGrade,
  confluenceCount: number,
  noGoConditions: NoGoCondition[]
): string | undefined {
  if (grade === 'F' && noGoConditions.length > 0) {
    return noGoConditions.map(c => c.name).join(', ')
  }

  if (grade === 'A+' || grade === 'A' || grade === 'B+') {
    return `${confluenceCount} confluence areas`
  }

  return undefined
}

/**
 * Check if trade should be entered based on grade
 */
export function shouldEnterTrade(grade: TradeGrade): boolean {
  return grade !== 'D' && grade !== 'F'
}