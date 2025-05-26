"use client"; // cz we will use client components here (form)


import { useState } from 'react';
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
    
    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
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
        if (authError) {
        console.log('Auth error detected:', authError);
        
        // Check for various ways Supabase might indicate a duplicate email
        if (authError.message.includes('User already registered') || 
            authError.message.includes('already in use') ||
            authError.message.includes('already exists') ||
            authError.message.toLowerCase().includes('duplicate')) {
          console.log('Duplicate email detected');
          setFormErrors(prev => ({
            ...prev,
            email: 'An account with this email already exists'
          }));
        } else {
          setFormErrors(prev => ({
            ...prev,
            email: authError.message
          }));
        }
        setIsLoading(false);
        return;
      }      // Check if user was actually created (might indicate existing user or other issues)
      if (authData.user) {
        console.log('User data:', authData.user);
        
        // Check if identities array is empty (indicates user already exists but auth error wasn't triggered)
        if (authData.user.identities && authData.user.identities.length === 0) {
          console.log('Empty identities array - likely existing user');
          setFormErrors(prev => ({
            ...prev,
            email: 'An account with this email already exists'
          }));
          setIsLoading(false);
          return;
        }
        
        // User successfully created, redirect to verification page
        router.push('/verify-email');
        return;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setFormErrors(prev => ({
        ...prev,
        email: 'An error occurred during signup. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };
  const handleSocialSignUp = async (provider) => {
    try {
      setIsLoading(true);
      console.log(`Initiating ${provider} sign up`);
      
      // Configure options based on provider
      const options = {
        redirectTo: `${window.location.origin}/callback`
      };
      
      // Specific options for GitHub
      if (provider === 'github') {
        // Request needed scopes for user info and email
        options.scopes = 'read:user user:email';
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: options
      });
      
      if (error) {
        console.error(`Error with ${provider} signup:`, error);
        setFormErrors(prev => ({
          ...prev,
          email: `Error signing up with ${provider}`
        }));
      } else {
        console.log(`${provider} sign-up initiated successfully`);
      }
    } 
    catch (error) {
      console.error('Social signup error:', error);
    } 
    finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white px-4 py-6">
      <div className="min-w-[50%] w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image 
            src="/Assets/quiver-logo.svg" 
            alt="Quiver Logo" 
            width={80} 
            height={80} 
            className="object-contain"
          />
        </div>
        
        <div className="bg-[#1E1E1E] rounded-2xl py-15 px-40 w-full">
          <h1 className="text-2xl font-semibold text-center mb-6">Create Your Account</h1>          
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
            <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center">
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
                    </label>                              <div>
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-400 ml-2">
                                  I Agree with all of your <Link href="/terms" className="text-[#5529C9] hover:underline">Terms & Conditions</Link>
                                </label>
                                {formErrors.agreeToTerms && (
                                  <p className="text-red-400 text-xs mt-1 ml-2">{formErrors.agreeToTerms}</p>
                                )}
                              </div>
              </div>              
              <Button 
                type="submit" 
                primary 
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-6 whitespace-nowrap"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'} <span className="ml-2">→</span>
              </Button>
            </div>
          </form>
            <Divider text="SIGN UP WITH" />    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SocialAuthButton
        icon={<GoogleIcon />}
        text="Google"
        borderColor="white"
        onClick={() => handleSocialSignUp('google')}
        disabled={isLoading}
      />      
     
       <SocialAuthButton
        icon={<GitHubIcon />}
        text="GitHub"
        onClick={() => handleSocialSignUp('github')}
        disabled={isLoading}
      />
      
      <SocialAuthButton
        icon={<AppleIcon />}
        text="Apple"
        borderColor="white"
        onClick={() => handleSocialSignUp('apple')}
        disabled={isLoading}
      />
      </div>
        </div>
          <div className="flex items-center justify-center mt-5 space-x-2">
          <p className="text-gray-400 text-sm">Already have an account?</p>
          <Link 
            href="/signin" 
            className="inline-block bg-[#26223A] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm hover:underline hover:bg-[#5222D0]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}