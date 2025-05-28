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
        // Check URL for error parameters
        const url = new URL(window.location.href);
        const errorCode = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        
        if (errorCode || errorDescription) {
          console.error('OAuth Error:', errorCode, errorDescription);
          router.push(`/signin?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
          return;
        }
        
        // Get code parameter for GitHub
        const code = url.searchParams.get('code');
        if (code) {
          console.log('OAuth code detected, processing authentication');
        }
        
        // Check if user is authenticated
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          router.push('/signin?error=Authentication failed');
          return;
        }        if (data?.session) {
          // Get provider info
          const provider = data.session.user?.app_metadata?.provider;
          const user = data.session.user; // Define user here!
          console.log('Successfully authenticated with:', provider);
          
            // Check if user exists in custom users table
const { data: existingUser, error: checkError } = await supabase
  .from('users')
  .select('id')
  .eq('id', user.id)
  .single();

// If user doesn't exist (checkError means no record found)
if (checkError && checkError.code === 'PGRST116') {
  // Extract user info from social auth
  const firstName = user.user_metadata?.first_name || 
                    user.user_metadata?.full_name?.split(' ')[0] || 
                    user.email?.split('@')[0] || 'User';
  const lastName = user.user_metadata?.last_name || 
                   user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';
  const username = user.email?.split('@')[0] + '_' + Date.now(); // Make it unique

  // Insert into custom users table
  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id: user.id,
      username: username,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      password_hash: 'managed_by_supabase_auth',
      preferences: { theme: 'dark', notifications: true }
    });

  if (insertError) {
    console.error('Failed to create user profile:', insertError);
  }
}

            router.push('/dashboard');
        } 
        else {
          // No session, redirect back to sign in
          console.log('No session found, redirecting to sign in');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/signin?error=Something went wrong');
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
