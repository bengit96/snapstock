import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES, APP_NAME } from '@/lib/constants'

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      description={`How we collect, use, and protect your information`}
      backUrl={ROUTES.home}
      backText="Back to home"
      className="bg-gray-50 dark:bg-gray-900"
    >
      <Card className="max-w-4xl mx-auto">
        <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2>1. Introduction</h2>
          <p>
            {APP_NAME} ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our Service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Email address when you create an account</li>
            <li><strong>Payment Information:</strong> Payment details processed securely through Stripe (we do not store full credit card numbers)</li>
            <li><strong>Chart Images:</strong> Trading charts you upload for analysis</li>
            <li><strong>Communications:</strong> Messages you send to our support team</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
            <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience</li>
            <li><strong>Analysis Results:</strong> Charts analyzed, grades received, trading signals detected</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Service</li>
            <li>Process your chart analysis requests using AI</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send you important updates about your account</li>
            <li>Improve and optimize our Service</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
            <li>Track referrals and apply rewards</li>
            <li>Send you marketing communications (with your consent)</li>
          </ul>

          <h2>4. How We Share Your Information</h2>

          <h3>4.1 Service Providers</h3>
          <p>We share information with trusted third-party service providers:</p>
          <ul>
            <li><strong>OpenAI:</strong> Chart images are sent to OpenAI's GPT-4 Vision API for analysis</li>
            <li><strong>Stripe:</strong> Payment information for processing subscriptions</li>
            <li><strong>Vercel:</strong> Hosting and infrastructure provider</li>
            <li><strong>Resend:</strong> Email delivery service for authentication codes</li>
            <li><strong>Discord:</strong> Optional analytics notifications (if configured)</li>
          </ul>

          <h3>4.2 Legal Requirements</h3>
          <p>We may disclose your information if required by law or in response to valid legal requests.</p>

          <h3>4.3 Business Transfers</h3>
          <p>
            If {APP_NAME} is involved in a merger, acquisition, or sale of assets, your information may be transferred.
            We will notify you before your information becomes subject to a different Privacy Policy.
          </p>

          <h3>4.4 We Do Not Sell Your Information</h3>
          <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

          <h2>5. Data Retention</h2>
          <ul>
            <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion</li>
            <li><strong>Chart Images:</strong> Stored temporarily for analysis, then deleted or retained in anonymized form</li>
            <li><strong>Analysis History:</strong> Retained for your reference while your account is active</li>
            <li><strong>Payment Records:</strong> Retained as required by law (typically 7 years)</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information:</p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure payment processing through PCI-compliant providers</li>
          </ul>
          <p className="text-sm italic">
            However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
          </p>

          <h2>7. Your Rights and Choices</h2>

          <h3>7.1 Access and Portability</h3>
          <p>You can access your account information and analysis history through your dashboard.</p>

          <h3>7.2 Correction</h3>
          <p>You can update your email address through your account settings.</p>

          <h3>7.3 Deletion</h3>
          <p>
            You can request deletion of your account and associated data by contacting us at ben@snappchart.app.
            We will delete your information within 30 days, except where required by law to retain it.
          </p>

          <h3>7.4 Marketing Communications</h3>
          <p>You can opt out of marketing emails by clicking the unsubscribe link in any marketing email.</p>

          <h3>7.5 Cookies</h3>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect functionality.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            {APP_NAME} is not intended for children under 18. We do not knowingly collect information from children under 18.
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence.
            These countries may have different data protection laws. By using the Service, you consent to such transfers.
          </p>

          <h2>10. Third-Party Links</h2>
          <p>
            The Service may contain links to third-party websites. We are not responsible for the privacy practices of
            these external sites. We encourage you to read their privacy policies.
          </p>

          <h2>11. California Privacy Rights</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to say no to the sale of personal information</li>
            <li>Right to access your personal information</li>
            <li>Right to equal service and price</li>
            <li>Right to request deletion of personal information</li>
          </ul>
          <p>
            To exercise these rights, contact us at ben@snappchart.app with "California Privacy Rights" in the subject line.
          </p>

          <h2>12. European Privacy Rights (GDPR)</h2>
          <p>
            If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
          </ul>

          <h2>13. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by:
          </p>
          <ul>
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending you an email notification (for material changes)</li>
          </ul>
          <p>
            Your continued use of the Service after changes indicates your acceptance of the updated Privacy Policy.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p><strong>Email:</strong> ben@snappchart.app</p>
            <p><strong>Subject Line:</strong> Privacy Inquiry - {APP_NAME}</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-8">
            <p className="font-bold mb-2">Your Privacy Matters</p>
            <p className="text-sm">
              We are committed to protecting your privacy and handling your data responsibly. If you have any questions
              or concerns, please don't hesitate to reach out to us.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
