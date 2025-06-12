"use client"; // cz we will use client components here (form)


import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/passwordInput';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import SocialAuthButton from '../../components/AuthSocialButton';
import GoogleIcon from '../../components/googleIcon';
import GitHubIcon from '../../components/GitHubIcon';
import AppleIcon from '../../components/AppleIcon';







export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();


  // Add CSS keyframes for animations
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'animation-styles';
      style.innerHTML = `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('animation-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user is typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Username validation (alphanumeric, 3-20 chars)
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      errors.username = 'Username must be 3-20 characters (letters, numbers, underscores)';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Password validation (8+ chars, mix of numbers, letters, special chars)
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters with letters and numbers';
      isValid = false;
    }
    
    // Password confirmation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Terms agreement
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Stop if form is invalid
  if (!validateForm()) {
    return;
  }

  // Show loading spinner
  setIsLoading(true);

  try {
    // Try to create user
    const result = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
        }
      }
    });
    
    // Check for any errors
    if (result.error) {
      console.log("Error during signup:", result.error);
      
      // Show error message to user
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email: result.error.message || "Error creating account"
      }));
      return;
    }
    
    // Check if user was created
    if (result.data && result.data.user) {
      // Check for empty identities array (means duplicate email)
      if (!result.data.user.identities || result.data.user.identities.length === 0) {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          email: "An account with this email already exists"
        }));
        return;
      }
      
      // Insert into custom users table
      console.log("Attempting to insert user with ID:", result.data.user.id);
      // Inside your handleSubmit function, in the try block:

try {
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert({
      id: result.data.user.id,
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password_hash: 'managed_by_supabase_auth', // Add this line
      preferences: { theme: 'dark', notifications: true }
    })
    .select();
    
  if (insertError) {
    console.error("Error inserting into custom users table:", insertError);
    console.log("Insert error details:", {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code
    });
  } else {
    console.log("Successfully inserted user into custom users table:", insertData);
  }
} catch (insertErr) {
  console.error("Exception during custom user table insertion:", insertErr);
}







      // Success! Redirect to verification page regardless of custom table insert
      router.push('/verify-email');
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Signup failed:", error);
    
    setFormErrors(prevErrors => ({
      ...prevErrors,
      email: "Something went wrong. Please try again."
    }));
  } finally {
    // Always hide loading spinner
    setIsLoading(false);
  }
};
// Simplified social sign-up function
const handleSocialSignUp = async (provider) => {
  // Show loading spinner
  setIsLoading(true);
  console.log("Starting " + provider + " sign up");
  
  try {
    // Create basic options
    let options = {};
    options.redirectTo = window.location.origin + "/callback";
    
    // Add email permission for GitHub
    // if (provider === "github") {
    //   options.scopes = "read:user user:email";
    // }
    
    // Start login process
    let result = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: options
    });
    
    // Check if there was an error
    if (result.error) {
      console.error("Error with " + provider + " signup:", result.error);
      
      // Just update the email error message
      setFormErrors(prevErrors => {
        prevErrors.email = "Error signing up with " + provider;
        return prevErrors;
      });
    } 
    else {
      console.log(provider + " sign-up started successfully");
    }
  } 
  catch (error) {
    console.error("Social signup error:", error);
    
    // Show generic error
    setFormErrors(prevErrors => {
      prevErrors.email = "Something went wrong. Please try again.";
      return prevErrors;
    });
  } 
  finally {
    setIsLoading(false);  // Hide loading spinner
  }
};  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#09090B] via-[#131218] to-[#1A1830] text-white px-4 py-6 relative">
      <div className="min-w-[50%] w-full max-w-sm relative z-10">
        <div className="flex justify-center mb-6">          
        <Image 
            src="/Assets/quiver-logo.svg" 
            alt="Quiver Logo" 
            width={80} 
            height={80} 
            className="object-contain hover:scale-105 transition-transform duration-300"
            style={{animation: 'float 6s ease-in-out infinite'}}
          />
        </div>
        
            <div className="bg-[#1E1E1E] rounded-2xl p-[10%] w-full border border-gray-800/50 shadow-lg">
          
          <h1 className="text-2xl font-semibold text-center mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Create Your Account</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Join Quiver and get started with your journey</p>          
          <form onSubmit={handleSubmit} className="space-y-4 mb-10" >            
          <div className="flex gap-4">
              <InputField
                id="firstName"
                placeholder="First name..."
                value={formData.firstName}
                onChange={handleChange}
                required
                name="firstName"
                error={formErrors.firstName}
              />
              <InputField 
                id="lastName" 
                placeholder="Last name..." 
                value={formData.lastName} 
                onChange={handleChange} 
                required
                name="lastName"
                error={formErrors.lastName}
              />
            </div>              
            <InputField 
              id="username" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleChange} 
              required
              name="username"
              error={formErrors.username}
            />
            <InputField 
              id="email" 
              type="email" 
              placeholder="Email address" 
              value={formData.email} 
              onChange={handleChange} 
              required
              name="email"
              error={formErrors.email}
            />              
            <PasswordInput 
              id="password" 
              placeholder="Create password" 
              value={formData.password} 
              onChange={handleChange} 
              required
              name="password"
              error={formErrors.password}
            />
            
            <PasswordInput 
              id="confirmPassword" 
              placeholder="Confirm password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required
              name="confirmPassword"
              error={formErrors.confirmPassword}
            />
            <div className="flex items-start sm:items-center justify-between mb-4 gap-4">              <div className="flex items-center group">
                <input 
                  type="checkbox" 
                  id="agreeToTerms" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="sr-only"
                />
                      <label 
                      htmlFor="agreeToTerms" 
                      className={`
                      w-5 h-5 border-[1px] cursor-pointer flex items-center justify-center transition-all duration-200
                      group-hover:border-[#5222D0]
                      ${formData.agreeToTerms 
                        ? 'bg-[#5222D0] border-[#5222D0]' 
                        : 'bg-transparent border-gray-500'
                      }
                    `}            
                    >
        
                            {formData.agreeToTerms && (
                              <svg 
                          className="w-3 h-3 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </label>                              
                    <div>
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-400 ml-2 cursor-pointer group-hover:text-gray-300 transition-colors">
                                  I Agree with all of your <Link href="/terms" className="text-[#5529C9] hover:underline hover:text-[#6637D9] transition-colors">Terms & Conditions</Link>
                                </label>                                
                                {formErrors.agreeToTerms && (
                                  <p className="text-red-400 text-xs mt-1 ml-2 animate-pulse">{formErrors.agreeToTerms}</p>
                                )}
                              </div>
              </div>                
              <Button 
                type="submit" 
                primary 
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-6 whitespace-nowrap transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_20px_rgba(82,34,208,0.5)] hover:scale-105 border border-transparent hover:border-purple-300/30"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span> Creating...
                    </>
                  ) : (
                    <div>
                      Create Account <span className="ml-2">→</span>
                    </div>
                  )}
                </span>
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, transparent, transparent 30%, rgba(82,34,208,0.4))',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    transform: 'rotate(-45deg)',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    opacity: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.animation = 'holographicSweep 1.5s infinite';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                    e.currentTarget.style.animation = 'none';
                  }}
                ></span>
              </Button>
            </div>
          </form>            <Divider text="SIGN UP WITH" />    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">      <SocialAuthButton
        icon={<GoogleIcon />}
        text="Google"
        borderColor="white"
        onClick={() => handleSocialSignUp('google')}
        disabled={isLoading}
        className="hover:scale-105 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] transition-all duration-300 relative overflow-hidden"
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <span className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent, transparent 30%, rgba(82,34,208,0.4))',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            transform: 'rotate(-45deg)',
            transition: 'all 0.3s ease',
            opacity: 0,
            zIndex: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.animation = 'holographicSweep 1.5s infinite';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
            e.currentTarget.style.animation = 'none';
          }}
        ></span>
      </SocialAuthButton>      
     
       <SocialAuthButton
        icon={<GitHubIcon />}
        text="GitHub"
        onClick={() => handleSocialSignUp('github')}
        disabled={isLoading}
        className="hover:scale-105 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] transition-all duration-300 relative overflow-hidden"
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <span className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent, transparent 30%, rgba(82,34,208,0.4))',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            transform: 'rotate(-45deg)',
            transition: 'all 0.3s ease',
            opacity: 0,
            zIndex: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.animation = 'holographicSweep 1.5s infinite';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
            e.currentTarget.style.animation = 'none';
          }}
        ></span>
      </SocialAuthButton>
      
      <SocialAuthButton
        icon={<AppleIcon />}
        text="Apple"
        borderColor="white"
        onClick={() => router.push('/not-found')}
        disabled={isLoading}
        className="hover:scale-105 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] transition-all duration-300 relative overflow-hidden"
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
<span 
  className="absolute inset-0"
  style={{
    background: 'linear-gradient(135deg, transparent, transparent 30%, rgba(82,34,208,0.4), transparent 70%, transparent)',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    transform: 'rotate(-45deg)',
    transition: 'all 0.3s ease',
    opacity: 0,
    zIndex: 1
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.animation = 'holographicSweep 1.5s infinite';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = '0';
    e.currentTarget.style.animation = 'none';
  }}
></span>
      </SocialAuthButton>
      </div>
        </div>          <div className="flex items-center justify-center mt-5 space-x-2">
          <p className="text-gray-400 text-sm">Already have an account?</p>          
<Link 
  href="/signin" 
  className="relative inline-block bg-[#26223A] text-white px-6 py-2 rounded-md transition-all duration-300 text-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:bg-[#5529C9] overflow-hidden hover:underline border border-transparent hover:border-purple-300/30"
  style={{
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <span className="relative z-10">Sign In</span>
  <span 
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(135deg, transparent, transparent 30%, rgba(82,34,208,0.4), transparent 70%, transparent)',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      transform: 'rotate(-45deg)',
      transition: 'all 0.3s ease',
      opacity: 0,
      zIndex: 1
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.animation = 'holographicSweep 1.5s infinite';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = '0';
      e.currentTarget.style.animation = 'none';
    }}
  ></span>
</Link>



        </div>
      </div>
    </main>
  );
}