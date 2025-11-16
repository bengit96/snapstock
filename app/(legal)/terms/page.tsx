import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES, APP_NAME } from '@/lib/constants'

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms of Service"
      description={`Please read these terms carefully before using ${APP_NAME}`}
      backUrl={ROUTES.home}
      backText="Back to home"
      className="bg-gray-50 dark:bg-gray-900"
    >
      <Card className="max-w-4xl mx-auto">
        <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using {APP_NAME} ("the Service"), you agree to be bound by these Terms of Service ("Terms").
            If you do not agree to these Terms, please do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            {APP_NAME} provides AI-powered technical analysis of stock charts and trading signals. The Service is designed
            to assist users in analyzing trading opportunities but does not constitute financial advice, investment advice,
            or trading advice.
          </p>

          <h2>3. NOT FINANCIAL ADVICE - IMPORTANT DISCLAIMER</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg my-4">
            <p className="font-bold text-red-800 dark:text-red-200">
              TRADING INVOLVES SUBSTANTIAL RISK OF LOSS. THE INFORMATION PROVIDED BY {APP_NAME.toUpperCase()} IS FOR
              EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY.
            </p>
            <ul className="mt-2 space-y-1">
              <li>The Service does NOT provide financial, investment, or trading advice</li>
              <li>We are NOT registered investment advisors or financial planners</li>
              <li>All analysis, grades, and signals are automated and may contain errors</li>
              <li>Past performance does NOT guarantee future results</li>
              <li>You should consult with a licensed financial advisor before making any investment decisions</li>
            </ul>
          </div>

          <h2>4. No Liability for Trading Losses</h2>
          <p>
            YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:
          </p>
          <ul>
            <li>
              <strong>No Guarantee of Profits:</strong> {APP_NAME} makes no representations or warranties that you will
              earn any profits or avoid any losses from using the Service.
            </li>
            <li>
              <strong>Your Sole Responsibility:</strong> All trading decisions are made solely by you. You are fully
              responsible for all trading decisions and their outcomes.
            </li>
            <li>
              <strong>Risk of Loss:</strong> Trading stocks, options, futures, and other securities involves substantial
              risk of loss and is not suitable for all investors. You may lose some or all of your invested capital.
            </li>
            <li>
              <strong>No Liability:</strong> {APP_NAME}, its owners, operators, employees, and affiliates shall NOT be
              liable for any losses, damages, costs, or expenses (including legal fees) arising from or related to:
              <ul>
                <li>Your use or inability to use the Service</li>
                <li>Trading decisions made based on information from the Service</li>
                <li>Any errors, omissions, or inaccuracies in the Service's analysis or recommendations</li>
                <li>Any technical issues, downtime, or service interruptions</li>
                <li>Loss of data or profits arising from your use of the Service</li>
              </ul>
            </li>
          </ul>

          <h2>5. Assumption of Risk</h2>
          <p>
            By using {APP_NAME}, you acknowledge that:
          </p>
          <ul>
            <li>You understand the risks associated with trading and investing</li>
            <li>You have sufficient knowledge and experience to evaluate the risks</li>
            <li>You are financially capable of bearing such risks and potential losses</li>
            <li>You will not risk money you cannot afford to lose</li>
            <li>You will independently verify all information before making trading decisions</li>
          </ul>

          <h2>6. Accuracy of Information</h2>
          <p>
            While we strive for accuracy, {APP_NAME}:
          </p>
          <ul>
            <li>Does NOT guarantee the accuracy, completeness, or timeliness of any information</li>
            <li>May contain technical errors, typographical errors, or other inaccuracies</li>
            <li>Relies on third-party data sources and AI analysis which may be incorrect</li>
            <li>May experience delays, interruptions, or service outages</li>
          </ul>

          <h2>7. User Responsibilities</h2>
          <p>
            You agree to:
          </p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Provide accurate account information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Not share your account with others</li>
            <li>Not attempt to manipulate, hack, or interfere with the Service</li>
            <li>Not use the Service for any automated or high-frequency trading without prior written consent</li>
          </ul>

          <h2>8. Subscription and Payments</h2>
          <ul>
            <li><strong>Free Trial:</strong> New users receive 5 free chart analyses upon registration</li>
            <li><strong>Paid Subscriptions:</strong> Continued use requires a paid subscription</li>
            <li><strong>Billing:</strong> Subscriptions are billed in advance on a monthly, yearly, or one-time basis</li>
            <li><strong>Cancellation:</strong> You may cancel at any time through your account settings</li>
            <li><strong>Refunds:</strong> Refunds are provided according to our refund policy (7-day money-back guarantee)</li>
            <li><strong>Price Changes:</strong> We reserve the right to change pricing with 30 days' notice</li>
          </ul>

          <h2>9. Intellectual Property</h2>
          <p>
            All content, features, and functionality of {APP_NAME} (including but not limited to software, algorithms,
            analysis methods, text, graphics, and logos) are owned by {APP_NAME} and are protected by international
            copyright, trademark, and other intellectual property laws.
          </p>

          <h2>10. User Content</h2>
          <p>
            When you upload charts or images to the Service:
          </p>
          <ul>
            <li>You retain all rights to your uploaded content</li>
            <li>You grant us a license to process, analyze, and store your content to provide the Service</li>
            <li>You represent that you have the right to upload such content</li>
            <li>We may delete content at any time without notice</li>
          </ul>

          <h2>11. Limitation of Liability</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg my-4">
            <p className="font-bold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, {APP_NAME.toUpperCase()} SHALL NOT BE LIABLE FOR ANY:
            </p>
            <ul className="mt-2">
              <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
              <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
              <li>TRADING LOSSES OR INVESTMENT LOSSES</li>
              <li>DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE SERVICE</li>
            </ul>
            <p className="mt-2">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </div>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless {APP_NAME} and its affiliates from any claims, damages,
            losses, liabilities, and expenses (including legal fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your trading activities</li>
            <li>Your violation of any rights of another party</li>
          </ul>

          <h2>13. Service Modifications and Termination</h2>
          <p>
            We reserve the right to:
          </p>
          <ul>
            <li>Modify, suspend, or discontinue the Service at any time</li>
            <li>Terminate or suspend your account for violation of these Terms</li>
            <li>Change these Terms at any time with notice</li>
          </ul>

          <h2>14. Third-Party Services</h2>
          <p>
            The Service may integrate with third-party services (payment processors, data providers, etc.).
            We are not responsible for these third-party services.
          </p>

          <h2>15. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].
            Any disputes shall be resolved through binding arbitration, except where prohibited by law.
          </p>

          <h2>16. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.
          </p>

          <h2>17. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and {APP_NAME} regarding the Service.
          </p>

          <h2>18. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at: ben@snappchart.app
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-8">
            <p className="font-bold mb-2">FINAL REMINDER:</p>
            <p className="text-sm">
              By using {APP_NAME}, you acknowledge that you have read, understood, and agree to these Terms,
              including the disclaimers regarding trading risks and our limitation of liability. You accept full
              responsibility for all trading decisions and their outcomes.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
