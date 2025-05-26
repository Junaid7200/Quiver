"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#09090B] text-white min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/Assets/quiver-logo.svg"
              alt="Quiver Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
        </div>
        
        <div className="bg-[#1E1E1E] rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
            <Link 
              href="/auth/signup" 
              className="text-[#5529C9] text-sm hover:underline"
            >
              Back to Sign Up
            </Link>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-medium text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to Quiver. These Terms & Conditions govern your use of our application and services.
                By accessing or using Quiver, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">2. Account Registration</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="mt-2">
                You are responsible for safeguarding the password you use to access the service and for any activities or actions under your password.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">3. Content</h2>
              <p>
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post, including its legality, reliability, and appropriateness.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">4. Privacy Policy</h2>
              <p>
                Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our application. We only ask for personal information when we truly need it to provide a service to you.
              </p>
              <p className="mt-2">
                We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Quiver and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="mt-2">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="mt-2">
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-white mb-3">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@quiver.app
              </p>
            </section>
          </div>
          
          <div className="mt-10 border-t border-gray-700 pt-6">
            <div className="text-center">
              <Link 
                href="/auth/signup" 
                className="inline-block bg-[#5222D0] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                I Agree & Continue
              </Link>
              
              <p className="text-xs text-gray-500 mt-4">
                Last updated: May 24, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
