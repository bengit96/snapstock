import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { AlertTriangle } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <PageLayout
      title="Risk Disclaimer"
      description="Important information about trading risks"
      backUrl={ROUTES.home}
      backText="Back to home"
      className="bg-gray-50 dark:bg-gray-900"
    >
      <Card className="max-w-4xl mx-auto border-red-200 dark:border-red-800">
        <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">
                PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING {APP_NAME.toUpperCase()}
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Trading and investing in financial markets involves substantial risk of loss. This disclaimer explains
                important risks and limitations you must understand before using our Service.
              </p>
            </div>
          </div>

          <h2>1. No Financial Advice</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <p>
              <strong>{APP_NAME} DOES NOT PROVIDE FINANCIAL, INVESTMENT, TRADING, OR TAX ADVICE.</strong>
            </p>
            <p className="mt-2">
              All information, analysis, grades, signals, and recommendations provided by {APP_NAME} are for
              <strong> educational and informational purposes only</strong>. They should not be construed as:
            </p>
            <ul>
              <li>An offer to buy or sell securities</li>
              <li>A solicitation to trade or invest</li>
              <li>Professional financial advice</li>
              <li>Investment recommendations</li>
              <li>A guarantee of profits or performance</li>
            </ul>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded">
              <p className="font-semibold text-purple-800 dark:text-purple-200">
                Long-Bias Analysis Tool
              </p>
              <p className="mt-1 text-sm">
                {APP_NAME} exclusively analyzes long positions. We do not provide analysis for short positions.
                Trading is challenging enough—we focus on perfecting one strategy. Our AI is specifically trained
                and optimized for identifying long setups only.
              </p>
            </div>
          </div>

          <h2>2. High Risk of Loss</h2>
          <p className="font-bold text-red-800 dark:text-red-200">
            TRADING INVOLVES SUBSTANTIAL RISK OF LOSS AND IS NOT SUITABLE FOR ALL INVESTORS.
          </p>
          <p>You should be aware that:</p>
          <ul>
            <li><strong>You can lose money quickly:</strong> Markets are volatile and losses can occur rapidly</li>
            <li><strong>Past performance is not indicative of future results:</strong> Historical data cannot predict future outcomes</li>
            <li><strong>You may lose your entire investment:</strong> In some cases, you could lose more than your initial investment</li>
            <li><strong>Market conditions change:</strong> Strategies that worked in the past may not work in the future</li>
            <li><strong>Emotional trading:</strong> Fear and greed can lead to poor decision-making</li>
          </ul>

          <h2>3. No Guarantees</h2>
          <p>
            {APP_NAME} makes absolutely no guarantees or warranties regarding:
          </p>
          <ul>
            <li>The accuracy or reliability of analysis results</li>
            <li>The profitability of any trade or strategy</li>
            <li>The avoidance of losses</li>
            <li>The performance of any security or market</li>
            <li>The availability or uptime of the Service</li>
          </ul>

          <h2>4. Automated Analysis Limitations</h2>
          <p>
            {APP_NAME} uses artificial intelligence and automated algorithms to analyze charts. You acknowledge that:
          </p>
          <ul>
            <li><strong>AI can make mistakes:</strong> Machine learning models are not perfect and can misinterpret data</li>
            <li><strong>Technical issues:</strong> Software bugs, API errors, or system failures may occur</li>
            <li><strong>Data limitations:</strong> Analysis is based on the chart image you provide, which may be incomplete</li>
            <li><strong>No context awareness:</strong> The AI doesn't know about news, earnings, or market conditions</li>
            <li><strong>Backtesting bias:</strong> Signals are based on historical patterns that may not repeat</li>
          </ul>

          <h2>5. Your Sole Responsibility</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg my-4">
            <p className="font-bold">
              ALL TRADING DECISIONS ARE YOUR OWN RESPONSIBILITY.
            </p>
            <p className="mt-2">
              By using {APP_NAME}, you acknowledge that:
            </p>
            <ul className="mt-2">
              <li>You are making your own independent decisions</li>
              <li>You have sufficient knowledge and experience in trading</li>
              <li>You understand the risks involved</li>
              <li>You are financially capable of bearing losses</li>
              <li>You will not trade with money you cannot afford to lose</li>
              <li>You will conduct your own research and due diligence</li>
              <li>You will consult with licensed professionals before making significant decisions</li>
            </ul>
          </div>

          <h2>6. Not Investment Professionals</h2>
          <p>
            The creators and operators of {APP_NAME}:
          </p>
          <ul>
            <li>Are NOT registered investment advisors (RIAs)</li>
            <li>Are NOT licensed financial planners</li>
            <li>Are NOT certified financial analysts</li>
            <li>Are NOT brokers or dealers</li>
            <li>Do NOT provide personalized investment advice</li>
          </ul>
          <p>
            <strong>We strongly recommend consulting with licensed financial professionals before making any investment decisions.</strong>
          </p>

          <h2>7. Market Risks</h2>
          <p>
            Financial markets are subject to numerous risks, including but not limited to:
          </p>
          <ul>
            <li><strong>Market Risk:</strong> Overall market movements affecting all securities</li>
            <li><strong>Volatility Risk:</strong> Rapid and unpredictable price changes</li>
            <li><strong>Liquidity Risk:</strong> Inability to buy or sell at desired prices</li>
            <li><strong>Leverage Risk:</strong> Amplified losses when trading on margin</li>
            <li><strong>Regulatory Risk:</strong> Changes in laws or regulations</li>
            <li><strong>Geopolitical Risk:</strong> International events affecting markets</li>
            <li><strong>Company-Specific Risk:</strong> Issues affecting individual securities</li>
            <li><strong>Black Swan Events:</strong> Unpredictable, extreme events</li>
          </ul>

          <h2>8. Specific Trading Risks</h2>

          <h3>8.1 Day Trading</h3>
          <p>
            Day trading is extremely risky. Studies show that the majority of day traders lose money. Day trading requires
            significant time, knowledge, and emotional discipline.
          </p>

          <h3>8.2 Options Trading</h3>
          <p>
            Options can expire worthless, resulting in 100% loss of premium paid. Options trading is complex and
            not suitable for inexperienced investors.
          </p>

          <h3>8.3 Penny Stocks</h3>
          <p>
            Penny stocks are highly speculative and extremely risky. They are subject to manipulation, low liquidity,
            and significant volatility.
          </p>

          <h3>8.4 Leverage and Margin</h3>
          <p>
            Trading on margin or using leverage can magnify losses. You could lose more than your initial investment
            and be required to deposit additional funds.
          </p>

          <h2>9. No Liability</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg my-4">
            <p className="font-bold">
              {APP_NAME.toUpperCase()} AND ITS OPERATORS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="mt-2">
              <li>Any trading losses or investment losses</li>
              <li>Missed opportunities or failed trades</li>
              <li>Errors or inaccuracies in analysis</li>
              <li>Service downtime or technical issues</li>
              <li>Third-party failures (brokers, exchanges, etc.)</li>
              <li>Market movements or volatility</li>
              <li>Any direct, indirect, incidental, or consequential damages</li>
            </ul>
          </div>

          <h2>10. Independent Verification Required</h2>
          <p>
            You must:
          </p>
          <ul>
            <li>Independently verify all information before trading</li>
            <li>Cross-reference analysis with multiple sources</li>
            <li>Understand the fundamentals of any security you trade</li>
            <li>Stay informed about market conditions and news</li>
            <li>Monitor your positions actively</li>
          </ul>

          <h2>11. Hypothetical Performance</h2>
          <p>
            Any hypothetical performance results or backtested data have inherent limitations:
          </p>
          <ul>
            <li>They do not represent actual trading</li>
            <li>They may not reflect the impact of fees, slippage, and market conditions</li>
            <li>They are based on hindsight and may overstate performance</li>
            <li>Actual results may differ significantly</li>
          </ul>

          <h2>12. Testimonials and User Results</h2>
          <p>
            Any testimonials, user results, or success stories:
          </p>
          <ul>
            <li>Are not typical or guaranteed</li>
            <li>Do not represent what you will achieve</li>
            <li>May not be verified or authenticated</li>
            <li>Should not influence your decisions</li>
          </ul>

          <h2>13. Regulatory Considerations</h2>
          <p>
            You are responsible for:
          </p>
          <ul>
            <li>Complying with all applicable laws and regulations in your jurisdiction</li>
            <li>Understanding tax implications of your trading</li>
            <li>Reporting trading activity as required by law</li>
            <li>Ensuring you are legally allowed to trade in your location</li>
          </ul>

          <h2>14. Changes to This Disclaimer</h2>
          <p>
            We may update this disclaimer at any time. Continued use of the Service indicates acceptance of any changes.
          </p>

          <h2>15. Questions and Concerns</h2>
          <p>
            If you have questions about this disclaimer, contact us at: ben@snappchart.app
          </p>

          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 p-6 rounded-lg mt-8">
            <p className="font-bold text-red-900 dark:text-red-100 text-lg mb-3">
              FINAL WARNING - READ THIS CAREFULLY:
            </p>
            <p className="text-red-800 dark:text-red-200">
              By using {APP_NAME}, you acknowledge that you have read and understood this disclaimer. You accept
              full responsibility for all trading decisions and outcomes. You understand that trading involves
              substantial risk of loss and that you may lose some or all of your invested capital.
            </p>
            <p className="text-red-800 dark:text-red-200 mt-3 font-semibold">
              IF YOU DO NOT AGREE WITH THIS DISCLAIMER OR DO NOT UNDERSTAND THE RISKS INVOLVED,
              DO NOT USE THIS SERVICE.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
