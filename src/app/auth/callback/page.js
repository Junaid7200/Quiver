"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();  // create connection with supabase

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          router.push('/auth/signin?error=Authentication failed');
          return;
        }
        
        if (data?.session) {
          // User is signed in, redirect to dashboard
          router.push('/dashboard');
        } else {
          // No session, redirect back to sign in
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/auth/signin?error=Something went wrong');
      }
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="flex justify-center items-center h-screen bg-[#09090B]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5222D0] mx-auto mb-4"></div>
        <p className="text-white text-lg">Authenticating...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  );
}
