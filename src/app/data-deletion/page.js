"use client";

import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function DataDeletionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white p-8">
      <div className="max-w-2xl w-full bg-[#1E1E1E] rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Data Deletion Instructions</h1>
        
        <div className="space-y-4">
          <p>To request deletion of your data from Quiver:</p>
          
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Send an email to junaidjaffery1@gmail.com</li>
            <li>Include your account email address in the request</li>
            <li>Use the subject line "Data Deletion Request - Quiver"</li>
          </ol>
          
          <p className="mt-6">We will process your request within 30 days and notify you once completed.</p>
          
          <div className="mt-8">
            <Button 
              onClick={() => router.push('/')}
              primary
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
