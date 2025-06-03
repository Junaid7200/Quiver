"use client";
import { useState, useEffect } from "react";
import { createClient } from '../../../utils/supabase/client.ts'
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import PasswordInput from "../../components/passwordInput";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [errors, setErrors] = useState({});
  
  // Form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '', // For email verification
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const router = useRouter();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get authenticated user
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!currentUser) {
          router.push('/signin');
          return;
        }
        
        setAuthUser(currentUser);
        
        // Get user profile data
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (dbError) throw dbError;
        
        setUser(userData);
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          username: userData.username || '',
          email: currentUser.email || '',
          password: '',
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: 'error',
          content: `Failed to load profile: ${error.message}`
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

const updateProfile = async (e) => {
  e.preventDefault();
  setMessage({ type: '', content: '' });
  setErrors({});
  
  const newErrors = {};
  let hasErrors = false;
  
  // Validate email change
  if (formData.email !== authUser.email && !formData.password) {
    newErrors.password = "Password required to change email";
    hasErrors = true;
  }
  
  if (hasErrors) {
    setErrors(newErrors);
    return;
  }
  
  try {
    const supabase = createClient();
    
    // Update user profile (first_name, last_name, username)
    const { error: profileError } = await supabase
      .from('users')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
      })
      .eq('id', user.id);
      
    if (profileError) throw profileError;

// In the updateProfile function, replace the email update logic with:

// Update email if changed and password provided
if (formData.email !== authUser.email) {
  try {
    // For social auth users, we don't need password
    const needsPassword = !authUser.app_metadata?.provider;
    
    // Check if password is required but not provided
    if (needsPassword && !formData.password) {
      setErrors({ password: "Password required to change email" });
      return;
    }    // Try both API endpoints for email change
    try {
      // First try new API endpoint
      console.log("Trying /api/user/update-email endpoint");
      const response1 = await fetch('/api/user/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail: formData.email,
          password: formData.password // This can be empty for social auth users
        }),
      });
      
      if (response1.ok) {
        const data1 = await response1.json();
        console.log("Success with new endpoint");
        return data1;
      }
    } catch (e) {
      console.log("Error with new endpoint:", e);
    }
    
    // Fall back to original endpoint
    console.log("Falling back to /api/emailChange endpoint");
    const response = await fetch('/api/emailChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newEmail: formData.email,
        password: formData.password // This can be empty for social auth users
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update email');
    }
    
    // Clear password field
    setFormData(prev => ({ ...prev, password: '' }));
    
    // Update message
    setMessage({ 
      type: 'success', 
      content: 'Email updated successfully!'
    });
    
    // Update the authUser state with the new email
    setAuthUser(prev => ({
      ...prev,
      email: formData.email
    }));
    
    return;
  } catch (error) {
    setErrors({ password: error.message });
    return;
  }
}
    
    setMessage({ type: 'success', content: 'Profile updated successfully!' });
  } catch (error) {
    console.error("Error updating profile:", error);
    setMessage({
      type: 'error',
      content: `Failed to update profile: ${error.message}`
    });
  }
};
  
// In the updatePassword function

const updatePassword = async (e) => {
  e.preventDefault();
  setMessage({ type: '', content: '' });
  setErrors({});
  
  const newErrors = {};
  let hasErrors = false;
  
  if (passwordData.new_password !== passwordData.confirm_password) {
    newErrors.confirm_password = 'New passwords do not match';
    hasErrors = true;
  }
  
  // Only check this for users who have a password already
  if (!authUser.app_metadata?.provider && passwordData.new_password === passwordData.current_password) {
    newErrors.new_password = 'New password must be different from current password';
    hasErrors = true;
  }
  
  if (passwordData.new_password.length < 6) {
    newErrors.new_password = 'Password must be at least 6 characters';
    hasErrors = true;
  }
  
  if (hasErrors) {
    setErrors(newErrors);
    return;
  }
  
  try {
    const supabase = createClient();
    
    // For social auth users, we don't need to verify current password
    if (authUser.app_metadata?.provider === 'google' || 
        authUser.app_metadata?.provider === 'github') {
      
      // Set password for the first time
      const { error: passwordError } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });
      
      if (passwordError) throw passwordError;
      
      // Clear password fields
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      setMessage({ 
        type: 'success', 
        content: 'Password set successfully! You can now also log in with email and password.' 
      });
      return;
    }
    
    // For regular users, verify current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: passwordData.current_password,
    });
    
    if (signInError) {
      setErrors({ current_password: 'Current password is incorrect' });
      return;
    }
    
    // Update password
    const { error: passwordError } = await supabase.auth.updateUser({
      password: passwordData.new_password,
    });
    
    if (passwordError) throw passwordError;
    
    // Clear password fields
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    
    setMessage({ type: 'success', content: 'Password updated successfully!' });
  } catch (error) {
    console.error("Error updating password:", error);
    setMessage({
      type: 'error',
      content: `Failed to update password: ${error.message}`
    });
  }
};



  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212] text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-[#32E0C4]">Your Profile</h1>
        <p className="text-gray-400 mb-8">Manage your personal information and account settings</p>

        {message.content && (
          <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-900/30 border border-red-800' : 'bg-green-900/30 border border-green-800'}`}>
            {message.content}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar with profile photo */}
          <div className="md:col-span-1">
            <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-[#32E0C4] flex justify-center items-center text-3xl font-bold text-black mb-4">
                  {`${(formData.first_name?.[0] || '').toUpperCase()}${(formData.last_name?.[0] || '').toUpperCase()}`}
                </div>
                <h2 className="text-xl font-semibold">{formData.first_name} {formData.last_name}</h2>
                <p className="text-gray-400 mb-4">@{formData.username || 'username'}</p>
                
                <p className="text-sm text-center text-gray-500 mt-4">
                  Member since {new Date(authUser?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Information Form */}
            <form onSubmit={updateProfile} className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg">
              <h2 className="text-xl font-semibold mb-6 border-b border-[#333] pb-2">Personal Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Your first name"
                    error={errors.first_name}
                  />
                  
                  <InputField
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    error={errors.last_name}
                  />
                </div>
                
                <InputField
                  id="username"
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Your username"
                  error={errors.username}
                />
                
                <div className="space-y-4">
                  <InputField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                    error={errors.email}
                  />
                  
                  {formData.email !== authUser?.email && (
                    <PasswordInput
                      id="password"
                      name="password"
                      label="Enter password to confirm email change"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Your current password"
                      error={errors.password}
                      required={formData.email !== authUser?.email}
                    />
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#32E0C4] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
            
            {/* Password Change Form */}
            <form onSubmit={updatePassword} className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-lg">
              <h2 className="text-xl font-semibold mb-6 border-b border-[#333] pb-2">Security</h2>
              
              <div className="space-y-6">
{/* Only show current password field for non-social auth users */}
{!authUser.app_metadata?.provider ? (
  <PasswordInput
    id="current_password"
    name="current_password"
    label="Current Password"
    value={passwordData.current_password}
    onChange={handlePasswordChange}
    placeholder="Your current password"
    error={errors.current_password}
    required
  />
) : (
  <div className="py-2 px-3 bg-blue-900/30 border border-blue-800 rounded-md mb-4">
    <p>You signed up using {authUser.app_metadata?.provider}. Set a password to also enable email login.</p>
  </div>
)}
                
                <PasswordInput
                  id="new_password"
                  name="new_password"
                  label="New Password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Your new password"
                  error={errors.new_password}
                  required
                />
                
                <PasswordInput
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm New Password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  error={errors.confirm_password}
                  required
                />
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#32E0C4] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}