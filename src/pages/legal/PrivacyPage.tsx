import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
          Privacy Policy
        </h1>

        <div className="prose prose-orange dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <strong>Last updated:</strong> February 18, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              TRVE.io ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our blockchain-based asset registry platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
              2.1 Personal Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>Email address (for account creation and communication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Organization name (if applicable)</li>
              <li>Wallet addresses (for blockchain verification)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
              2.2 Asset Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>Asset descriptions and metadata</li>
              <li>Document hashes (cryptographic fingerprints only)</li>
              <li>Timestamps and verification records</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
              2.3 Technical Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Usage patterns and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>To provide and maintain our service</li>
              <li>To verify and anchor asset records on blockchain</li>
              <li>To communicate with you about your account</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Blockchain Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please note that data anchored on blockchain networks (such as Polygon) 
              is <strong>permanent and immutable</strong>. We only store cryptographic 
              hashes on-chain, not your actual documents or personal information. 
              These hashes cannot be used to reconstruct your original data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Data Sharing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Blockchain networks for verification purposes (hashes only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Your Rights (GDPR)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Note: Data already anchored on blockchain cannot be deleted due to 
              the immutable nature of blockchain technology.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use essential cookies to maintain your session and preferences. 
              We may use analytics cookies to understand how you use our platform. 
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We implement industry-standard security measures including encryption, 
              secure authentication, and regular security audits. However, no method 
              of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For privacy-related inquiries, contact us at:<br />
              <a href="mailto:contact@trve.io" className="text-orange-600 hover:text-orange-700">
                contact@trve.io
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify 
              you of any changes by posting the new policy on this page and updating 
              the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
