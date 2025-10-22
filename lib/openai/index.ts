import OpenAI from 'openai'
import { TRADING_SIGNALS, NO_GO_CONDITIONS } from '@/lib/trading/signals'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChartAnalysisResult {
  isValidChart: boolean
  stockSymbol?: string
  currentPrice?: number
  supportLevel?: number
  resistanceLevel?: number
  activeSignals: string[]
  activeNoGoConditions: string[]
  chartDescription?: string
  confidence: number
}

export async function analyzeChartWithAI(imageBase64: string): Promise<ChartAnalysisResult> {
  try {
    // Prepare the signal descriptions for the AI
    const bullishSignals = TRADING_SIGNALS
      .filter(s => s.category === 'bullish')
      .map(s => `- ${s.name} (${s.id}): ${s.definition || s.shortName}`)
      .join('\n')

    const bearishSignals = TRADING_SIGNALS
      .filter(s => s.category === 'bearish')
      .map(s => `- ${s.name} (${s.id}): ${s.definition || s.shortName}`)
      .join('\n')

    const noGoSignals = NO_GO_CONDITIONS
      .map(c => `- ${c.name} (${c.id}): ${c.description}`)
      .join('\n')

    const prompt = `You are a professional stock chart analyst using Ross Cameron's trading strategy. Analyze this stock chart image and provide a detailed technical analysis.

IMPORTANT: First determine if this is a valid stock chart. A valid stock chart must have:
- Price action (candlesticks, bars, or line chart)
- Time axis (dates/times)
- Price axis (price levels)
- Looks like a trading platform screenshot (TradingView, ThinkorSwim, etc.)

If it's NOT a valid stock chart, respond with:
{
  "isValidChart": false,
  "confidence": 100
}

If it IS a valid stock chart, analyze it for the following signals and provide your response in JSON format:

BULLISH SIGNALS to check for:
${bullishSignals}

BEARISH SIGNALS to check for:
${bearishSignals}

NO-GO CONDITIONS to check for (these override all bullish signals):
${noGoSignals}

Your response must be in this exact JSON format:
{
  "isValidChart": true,
  "stockSymbol": "AAPL", // if visible
  "currentPrice": 150.25, // current/last price on the chart
  "supportLevel": 148.50, // nearest significant support
  "resistanceLevel": 152.75, // nearest significant resistance
  "activeSignals": ["high-buy-vol", "macd-green", "close-9ema"], // IDs of detected signals
  "activeNoGoConditions": [], // IDs of detected no-go conditions
  "chartDescription": "Brief description of what you see",
  "confidence": 85 // 0-100 confidence in your analysis
}

Be precise and only include signals you can clearly identify in the chart. Look for:
- Volume patterns (high/low, increasing/decreasing)
- MACD indicator status (if visible)
- Moving averages (especially 9 EMA)
- Support/resistance levels
- Candlestick patterns
- Price action relative to key levels
- Any signs of extended moves or reversals`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const result = JSON.parse(jsonMatch[0])

      // Validate the response structure
      if (typeof result.isValidChart !== 'boolean') {
        throw new Error('Invalid response structure')
      }

      return result
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Failed to parse AI analysis')
    }
  } catch (error) {
    console.error('Error in AI chart analysis:', error)

    // Fallback to basic analysis if AI fails
    return {
      isValidChart: true,
      activeSignals: [],
      activeNoGoConditions: [],
      confidence: 0,
    }
  }
}

export async function extractTextFromChart(imageBase64: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all visible text from this image including stock symbol, prices, indicators, and any labels. Return as plain text.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'low'
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error extracting text from chart:', error)
    return ''
  }
}