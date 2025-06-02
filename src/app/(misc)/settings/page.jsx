"use client";
import { useState, useEffect } from "react";
import { createClient } from '../../../utils/supabase/client.ts'
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!authUser) {
          router.push('/signin');
          return;
        }
        
        setUser(authUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: 'error',
          content: `Failed to load user data: ${error.message}`
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/'); // Go to landing page
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage({
        type: 'error',
        content: `Failed to sign out: ${error.message}`
      });
    }
  };

// In the handleDeleteAccount function:

const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return;
  }
  
  if (!window.confirm("ALL your data will be permanently lost. Are you absolutely sure?")) {
    return;
  }
  
  try {
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    // Make sure we have a valid session first
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      throw new Error("Your session has expired. Please sign in again.");
    }
    
    // Try both API endpoints for account deletion
    let success = false;
    let errorMessage = null;
    
    // First try new API endpoint
    try {
      console.log("Trying /api/user/delete-account endpoint");
      const response1 = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Important: include cookies
      });
      
      const data1 = await response1.json();
      
      if (response1.ok) {
        console.log("Success with new endpoint");
        success = true;
      } else {
        errorMessage = data1.error || "Error with first endpoint";
        console.log("Error with new endpoint:", errorMessage);
      }
    } catch (e) {
      console.log("Error with new endpoint:", e);
      errorMessage = e.message || "Unknown error";
    }
    
    // Fall back to original endpoint if first one failed
    if (!success) {
      try {
        console.log("Falling back to /api/accDeletion endpoint");
        const response = await fetch('/api/accDeletion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Important: include cookies
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete account');
        }
        
        success = true;
      } catch (e) {
        console.error("Error with fallback endpoint:", e);
        
        // If we already have an error message from the first attempt, keep it
        if (!errorMessage) {
          errorMessage = e.message || "Unknown error";
        }
        
        // If both endpoints failed, throw the error
        if (!success) {
          throw new Error(errorMessage || "Failed to delete account");
        }
      }
    }
    
    // If we got here with success=true, account was deleted
    if (success) {
      // Sign out client-side as well
      await supabase.auth.signOut();
      
      // Redirect to landing page
      setMessage({ type: 'success', content: 'Account deleted successfully. Redirecting...' });
      setTimeout(() => router.push('/'), 1500);
    }
    
  } catch (error) {
    console.error("Error deleting account:", error);
    setMessage({
      type: 'error',
      content: `Failed to delete account: ${error.message}`
    });
  } finally {
    setLoading(false);
  }
};

  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-[#32E0C4]">Account Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account preferences</p>

        {message.content && (
          <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-900/30 border border-red-800' : 'bg-green-900/30 border border-green-800'}`}>
            {message.content}
          </div>
        )}
        
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-6 border-b border-[#333] pb-2">Account Management</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <p className="text-gray-400">Update your personal information</p>
              <div className="pt-2">
                <Link 
                  href="/profile" 
                  className="inline-block px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                >
                  Go to Profile
                </Link>
              </div>
            </div>
            
            <div className="border-t border-[#333] my-6"></div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Logout</h3>
              <p className="text-gray-400">Sign out from your account</p>
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-red-500 border-b border-[#333] pb-2">Danger Zone</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Delete Account</h3>
              <p className="text-gray-400">Permanently delete your account and all your data</p>
              <div className="pt-2">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Commented out additional settings that can be added later
        {/*
        // Additional settings sections could be added here:
        
        // Dark/Light Mode Section
        <section className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark mode</span>
            <button className="...">Toggle</button>
          </div>
        </section>
        
        // Notifications Section
        <section className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          ...
        </section>
        
        // Privacy Section
        <section className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          ...
        </section>
        */}
      </div>
    </div>
  );
}