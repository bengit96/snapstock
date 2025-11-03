# Chart Analysis API - Consolidated Route

## Overview
This is the unified chart analysis endpoint that handles both direct file uploads and pre-uploaded image URLs.

## Endpoint
`POST /api/analysis`

## Input Formats

### 1. File Upload (FormData)
Used when uploading directly from the user's device.

**Content-Type:** `multipart/form-data`

**Body:**
```
FormData {
  image: File // The image file to analyze
}
```

**Example Usage:**
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/analysis', {
  method: 'POST',
  body: formData
});
```

### 2. URL Input (JSON)
Used when the image is already uploaded to blob storage.

**Content-Type:** `application/json`

**Body:**
```json
{
  "imageUrl": "https://blob.vercel-storage.com/..."
}
```

**Example Usage:**
```javascript
const response = await fetch('/api/analysis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ imageUrl })
});
```

## Response
```json
{
  "id": "analysis-id",
  "grade": "A+",
  "gradeLabel": "TAKE IT!",
  "gradeColor": "#10b981",
  "totalScore": 85.5,
  "shouldEnter": true,
  "stockSymbol": "AAPL",
  "aiConfidence": 85,
  "entryPrice": 150.25,
  "stopLoss": 148.00,
  "takeProfit": 154.80,
  "riskRewardRatio": 2.1,
  "activeBullishSignals": [...],
  "activeBearishSignals": [...],
  "activeNoGoConditions": [...],
  "confluenceCount": 3,
  "confluenceCategories": ["momentum", "trend", "volume"],
  "reasons": [...],
  "detectedSignals": {
    "bullish": [...],
    "bearish": [...],
    "noGo": [...]
  },
  "isFreeUser": false,
  "freeAnalysesRemaining": undefined,
  "disclaimer": "..."
}
```

## Features
- Automatic detection of input format based on Content-Type
- Unified rate limiting (10 analyses per hour)
- Admin bypass for all limits
- Free user limit checking
- Monthly limit checking for paid users
- Complete AI field storage including:
  - plainLanguageAnalysis
  - tradeThesis
  - chartDescription
  - keyStrengths
  - keyConcerns
  - stockSymbol
  - timeframe
  - chartQuality
  - overallReason

## Error Responses

### 400 Bad Request
- No image provided
- Invalid image file
- Invalid chart (not a stock chart)

### 401 Unauthorized
- User not authenticated

### 402 Payment Required
- Free trial limit reached
- Monthly limit reached

### 429 Too Many Requests
- Rate limit exceeded

### 500 Internal Server Error
- OpenAI API error
- Database error
- Blob storage error