# Blob Storage Security Implementation

## Overview

This document outlines the security measures implemented to protect user-uploaded images stored in Vercel Blob Storage.

## Problem Statement

Initially, all uploaded images were stored with public access (`access: "public"`), making the URLs accessible to anyone who had the link. This created several security concerns:

1. **Unauthorized Access**: Anyone with the blob storage URL could view images
2. **No Access Control**: No verification that the requesting user owns the image
3. **Data Leakage**: Chart images could contain sensitive trading information
4. **Lack of Audit Trail**: No logging of who accessed which images

## Solution Architecture

### 1. Secure Image Proxy Endpoint

**Location**: `app/api/images/[imageId]/route.ts`

All image access now goes through a secure API endpoint that:

- **Authenticates Users**: Requires valid session before serving images
- **Verifies Ownership**: Checks that the requesting user owns the requested image
- **Implements Rate Limiting**: Prevents abuse with 100 requests per minute per user
- **Adds Security Headers**: Includes proper cache control, CSP, and frame protection
- **Logs Access Attempts**: Records unauthorized access attempts for monitoring

**URL Format**: `/api/images/[analysisId]`

### 2. Database Schema Improvements

**Location**: `lib/db/schema.ts:197`

Added composite index for efficient image access verification:
```typescript
idUserIdIdx: index("id_user_id_idx").on(table.id, table.userId)
```

This index optimizes the query that verifies image ownership:
```sql
SELECT * FROM chart_analyses WHERE id = ? AND user_id = ?
```

### 3. API Response Transformation

**Modified Files**:
- `app/api/analysis/route.ts:340-347`
- `app/api/analyses/history/route.ts:42-46`

All API endpoints that return analysis data now:
1. Store the original blob URL in the database (for internal use)
2. Return secure proxy URLs to the frontend (for display)

**Utility Function**: `lib/utils/image-security.ts`

Provides helper functions:
- `getSecureImageUrl(analysisId)`: Generates secure proxy URL
- `isSecureImageUrl(url)`: Checks if URL is proxied
- `isBlobStorageUrl(url)`: Checks if URL is direct blob storage

### 4. Rate Limiting Configuration

**Location**: `lib/utils/rate-limit.ts:117-121`

Added dedicated rate limit for image access:
```typescript
imageAccess: {
  interval: 60 * 1000,        // 1 minute window
  uniqueTokenPerInterval: 100 // 100 requests per minute per user
}
```

This prevents:
- Automated scraping of images
- DoS attacks on the image endpoint
- Excessive bandwidth usage

## Security Headers

All images are served with the following security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `Cache-Control` | `private, max-age=3600` | Cache for 1 hour, only in user's browser |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent embedding in iframes |
| `Content-Security-Policy` | `default-src 'none'; img-src 'self';` | Restrict content loading |

## Access Flow

### Before (Insecure)
```
User → Frontend → Direct Blob URL → Public Blob Storage
                   ❌ No authentication
                   ❌ No authorization
                   ❌ No logging
```

### After (Secure)
```
User → Frontend → /api/images/[id] → Authentication Check
                                   → Ownership Verification
                                   → Rate Limit Check
                                   → Blob Storage Fetch
                                   → Secure Response
```

## Monitoring & Logging

All security-relevant events are logged:

- ✅ Unauthorized access attempts (no session)
- ✅ Ownership violations (wrong user)
- ✅ Rate limit violations
- ✅ Image not found errors
- ✅ Blob storage fetch failures

**Log Location**: Centralized through `lib/utils/logger.ts`

## Migration Notes

### Database Migration

Run the following to add the new index:

```bash
npx drizzle-kit push
```

This will add the composite index without affecting existing data.

### Backward Compatibility

The system maintains backward compatibility:

- Old blob URLs stored in the database remain unchanged
- The proxy endpoint fetches from these existing URLs
- No data migration required for existing images

### Frontend Updates

Frontend components should now receive `/api/images/[id]` URLs instead of direct blob URLs. This happens automatically through the API response transformation.

## Testing

To verify the security implementation:

1. **Test Authentication**:
   ```bash
   curl https://your-domain.com/api/images/some-analysis-id
   # Should return 401 Unauthorized without session
   ```

2. **Test Ownership**:
   - Login as User A
   - Try to access image owned by User B
   - Should return 403 Forbidden

3. **Test Rate Limiting**:
   - Make >100 requests in 1 minute
   - Should return 429 Too Many Requests

4. **Test Normal Access**:
   - Login as image owner
   - Access should work with proper headers

## Best Practices

1. **Never expose blob URLs to frontend**: Always use secure proxy URLs
2. **Validate ownership on every request**: Never trust client-provided IDs
3. **Monitor rate limit violations**: May indicate attack attempts
4. **Review access logs regularly**: Check for unusual patterns
5. **Keep rate limits generous**: 100/minute allows normal usage while preventing abuse

## Future Improvements

Consider implementing:

1. **Signed URLs with Expiration**: Generate time-limited URLs for temporary access
2. **Image Transformations**: Resize/compress images on-the-fly
3. **CDN Integration**: Add CloudFront or similar for better performance
4. **Access Analytics**: Track which images are accessed most frequently
5. **Distributed Rate Limiting**: Use Redis for multi-instance deployments

## References

- Vercel Blob Documentation: https://vercel.com/docs/storage/vercel-blob
- OWASP Secure File Upload: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
- Rate Limiting Patterns: https://cloud.google.com/architecture/rate-limiting-strategies-techniques
