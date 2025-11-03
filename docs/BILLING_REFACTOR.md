# Billing Period Refactoring

## Summary

Refactored all billing period calculation logic into a centralized utility to ensure consistency across the codebase.

## Problem

Multiple endpoints had duplicated logic for:
1. Calculating billing period start dates
2. Counting analyses in the current period
3. Checking analysis limits

**Issues found:**
- `/api/analysis/route.ts` - Using hardcoded 1st of month
- `/api/usage/stats/route.ts` - Using hardcoded 1st of month
- `/api/billing/usage/route.ts` - Had correct logic but was duplicated

This caused inconsistencies where:
- Free analyses done before subscription would count towards paid limits
- Different endpoints showed different "remaining analyses" counts
- Reset dates were inaccurate

## Solution

Created centralized utility: `lib/utils/billing.ts`

### New Utility Functions

#### `getBillingPeriodStart(user)`
Returns the correct period start based on subscription status:
- **Paid users with `currentPeriodStart`**: Returns actual billing cycle start from Stripe
- **Paid users without `currentPeriodStart`**: Fallback to 1st of month (legacy support)
- **Free users**: Returns epoch (count all time)

#### `getUserBillingPeriod(userId)`
Fetches complete billing information:
```typescript
{
  periodStart: Date
  periodEnd: Date | null
  tier: 'monthly' | 'yearly' | 'lifetime' | null
  analysesLimit: number | null
}
```

#### `countAnalysesInPeriod(userId, periodStart?)`
Counts analyses since the period start date

#### `checkAnalysisLimit(userId)`
Comprehensive limit check:
```typescript
{
  allowed: boolean
  used: number
  limit: number | null
  periodStart: Date
  periodEnd: Date | null
}
```

## Files Modified

### 1. **Created:** `lib/utils/billing.ts`
New centralized utility with all billing period logic

### 2. **Refactored:** `app/api/analysis/route.ts`
**Before:**
```typescript
// Hardcoded 1st of month
const monthStart = new Date();
monthStart.setDate(1);
monthStart.setHours(0, 0, 0, 0);

// Manual counting
const thisMonthAnalyses = await db
  .select()
  .from(chartAnalyses)
  .where(...)
```

**After:**
```typescript
// Use utility
const { checkAnalysisLimit } = await import("@/lib/utils/billing");
const limitCheck = await checkAnalysisLimit(session.user.id);

if (!limitCheck.allowed) {
  // Return error with accurate reset date
}
```

### 3. **Refactored:** `app/api/billing/usage/route.ts`
**Before:**
- 50+ lines of duplicated period calculation and counting logic

**After:**
```typescript
const billingInfo = await getUserBillingPeriod(session.user.id)
const analysesUsed = await countAnalysesInPeriod(session.user.id, billingInfo.periodStart)
```
- Reduced from 50+ lines to 3 lines
- Same functionality, more maintainable

### 4. **Refactored:** `app/api/usage/stats/route.ts`
**Before:**
```typescript
// Hardcoded 1st of month
const thisMonthStart = new Date()
thisMonthStart.setDate(1)
thisMonthStart.setHours(0, 0, 0, 0)
```

**After:**
```typescript
const billingInfo = await getUserBillingPeriod(session.user.id)
const thisMonth = await countAnalysesInPeriod(session.user.id, billingInfo.periodStart)
```

## Benefits

✅ **Single source of truth** - All billing logic in one place
✅ **Consistency** - Same logic used everywhere
✅ **Accurate reset dates** - Based on actual billing cycles
✅ **Fair counting** - Free analyses before subscription don't count
✅ **Easier maintenance** - Change once, applies everywhere
✅ **Better testability** - Can test utility functions in isolation

## How It Works Now

### For Monthly Plan (100/month)
1. User subscribes on **Feb 15th** → `currentPeriodStart = Feb 15th`
2. All endpoints count analyses **since Feb 15th**
3. On **March 15th**, Stripe webhook updates → `currentPeriodStart = March 15th`
4. All endpoints automatically count analyses **since March 15th**

### For Yearly Plan (300/month)
- Same as monthly, but with 300 limit
- **Still resets monthly** based on `currentPeriodStart`

### For Lifetime Plan
- `analysesLimit = null` (unlimited)
- No counting or limits applied

## Testing

Verify the refactoring works:

```bash
# Test analysis limit check
curl -X POST http://localhost:3000/api/analysis \
  -H "Authorization: Bearer <token>" \
  -d '{"imageUrl": "..."}'

# Test billing usage
curl http://localhost:3000/api/billing/usage \
  -H "Authorization: Bearer <token>"

# Test usage stats
curl http://localhost:3000/api/usage/stats \
  -H "Authorization: Bearer <token>"
```

All should return consistent analysis counts and limits.

## Migration Notes

- **No database changes required**
- **No breaking API changes**
- **Backwards compatible** - Legacy subscriptions without `currentPeriodStart` still work
- Next Stripe webhook will populate `currentPeriodStart` for existing subscriptions

## Future Improvements

1. Add caching to reduce database queries
2. Add unit tests for billing utility functions
3. Consider adding `periodStart` to API responses for transparency
4. Add logging for billing period calculations
