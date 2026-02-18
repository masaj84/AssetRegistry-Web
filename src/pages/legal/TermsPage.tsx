import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-orange dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <strong>Last updated:</strong> February 18, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing or using TRVE.io ("the Service"), you agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do 
              not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              TRVE.io is a blockchain-based asset registry platform that allows users to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mt-2">
              <li>Register and manage digital records of physical assets</li>
              <li>Anchor cryptographic proofs on blockchain networks</li>
              <li>Verify authenticity and ownership history</li>
              <li>Generate verifiable certificates and proofs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree NOT to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Register fraudulent or stolen assets</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or attempt to breach security</li>
              <li>Misrepresent your identity or authority over assets</li>
              <li>Engage in money laundering or illegal activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Blockchain Immutability
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>IMPORTANT:</strong> Data anchored on blockchain networks is 
              permanent and cannot be deleted or modified. By using our anchoring 
              features, you acknowledge and accept that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mt-2">
              <li>Blockchain transactions are irreversible</li>
              <li>Cryptographic hashes will remain on-chain indefinitely</li>
              <li>We cannot remove data once it is anchored</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Fees and Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Some features may require payment. Current pricing is displayed in the 
              application. Blockchain transaction fees (gas fees) are separate and 
              determined by network conditions. We reserve the right to change pricing 
              with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Service, including its design, features, and content, is owned by 
              TRVE.io. You retain ownership of your data and assets. By using the 
              Service, you grant us a limited license to process and display your 
              data as necessary to provide the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. 
              We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mt-2">
              <li>Uninterrupted or error-free operation</li>
              <li>That blockchain networks will remain available</li>
              <li>The legal validity of blockchain records in any jurisdiction</li>
              <li>Protection against all forms of fraud or theft</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRVE.IO SHALL NOT BE LIABLE 
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
              DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR 
              GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You agree to indemnify and hold harmless TRVE.io from any claims, 
              damages, or expenses arising from your use of the Service or 
              violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Termination
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may suspend or terminate your access to the Service at any time 
              for violation of these Terms or for any other reason. Upon termination, 
              your right to use the Service ceases immediately. Data already anchored 
              on blockchain will remain.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              These Terms shall be governed by the laws of Poland, without regard 
              to conflict of law principles. Any disputes shall be resolved in the 
              courts of Warsaw, Poland.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right to modify these Terms at any time. Continued use 
              of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions about these Terms, contact us at:<br />
              <a href="mailto:contact@trve.io" className="text-orange-600 hover:text-orange-700">
                contact@trve.io
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
