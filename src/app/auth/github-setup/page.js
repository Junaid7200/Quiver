"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import Button from '../components/Button';

export default function GithubProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError(error.message);
          return;
        }
        
        if (!user) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(user);
        
        // Check if user authenticated with GitHub
        if (user.app_metadata?.provider === 'github') {
          setGithubData({
            username: user.user_metadata?.user_name || 'Not available',
            fullName: user.user_metadata?.full_name || 'Not available',
            avatarUrl: user.user_metadata?.avatar_url || null
          });
        } else {
          setError('This page is only for users who signed up with GitHub.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [router, supabase.auth]);

  const handleContinueToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5222D0] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white px-4 py-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image 
            src="/Assets/quiver-logo.svg" 
            alt="Quiver Logo" 
            width={80} 
            height={80} 
            className="object-contain"
          />
        </div>
        
        <div className="bg-[#1E1E1E] rounded-2xl p-8 w-full">
          <h1 className="text-2xl font-semibold text-center mb-6">GitHub Account Connected</h1>
          
          {error && (
            <div className="bg-red-900 bg-opacity-30 p-4 rounded-md mb-6 text-sm text-red-300">
              {error}
            </div>
          )}
          
          {githubData && (
            <div className="text-center">
              {githubData.avatarUrl && (
                <div className="flex justify-center mb-4">
                  <Image 
                    src={githubData.avatarUrl}
                    alt="GitHub profile picture"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-medium text-[#5222D0]">{githubData.fullName}</h2>
                <p className="text-gray-400">@{githubData.username}</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6 text-sm text-left">
                <p className="mb-2">
                  Your GitHub account has been successfully connected to Quiver. 
                  You can now:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Sign in automatically using GitHub</li>
                  <li>Access your learning materials</li>
                  <li>Track your study progress</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={handleContinueToDashboard}
              primary
              className="px-6"
            >
              Continue to Dashboard <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>Having trouble? <Link href="/auth-debug" className="text-[#5222D0] hover:underline">Visit the help center</Link></p>
        </div>
      </div>
    </main>
  );
}
