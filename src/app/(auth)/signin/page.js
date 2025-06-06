// we will use this page to login the user

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/passwordInput';
import Button from '../../components/Button';
import SocialAuthButton from '../../components/AuthSocialButton';
import GoogleIcon from '../../components/googleIcon';
import GitHubIcon from '../../components/GitHubIcon';
import AppleIcon from '../../components/AppleIcon'; 
import Divider from '../../components/Divider';


export default function SignInPage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [formData, setFormData] = useState({
        identifier: '', // can be username or email
        password: '',
        rememberMe: false
    });
    
    const [formErrors, setFormErrors] = useState({
        identifier: '',
        password: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.id = 'signin-animation-styles';
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('signin-animation-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }
}, []);
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
  
  // Clear error when user starts typing
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
        
        // Validate identifier (username or email)
        if (!formData.identifier.trim()) {
            errors.identifier = 'Username or email is required';
            isValid = false;
        }
        
        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } 
        else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Check if identifier looks like an email or username
            const isEmail = formData.identifier.includes('@');
            let email = formData.identifier;
            
            // If it's a username, we need to find the email first
            if (!isEmail) {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('email')
                    .eq('username', formData.identifier)
                    .single();
                
                if (userError || !userData) {
                    setFormErrors(prev => ({
                        ...prev,
                        identifier: 'Username not found'
                    }));
                    return;
                }
                
                email = userData.email;
            }
            
            // Sign in with email and password
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: formData.password,
                    options: {
                    expiresIn: formData.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8 // 30 days vs 8 hours
    }
            });
            
            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setFormErrors(prev => ({
                        ...prev,
                        password: 'Invalid email/username or password'
                    }));
                } else {
                    setFormErrors(prev => ({
                        ...prev,
                        password: error.message
                    }));
                }
                return;
            }
            
            if (data.user) {
                // Update last login time
                await supabase
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', data.user.id);
                
                console.log('User signed in successfully!');
                router.push('/dashboard');
            }
        } 
        catch (error) {
            console.error('Signin error:', error);
            setFormErrors(prev => ({
                ...prev,
                password: 'An error occurred during signin. Please try again.'
            }));
        } 
        finally {
            setIsLoading(false);
        }
    };
    
    const handleSocialSignIn = async (provider) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/callback`
                }
            });
            
            if (error) {
                console.error(`Error with ${provider} signin:`, error);
                setFormErrors(prev => ({
                    ...prev,
                    identifier: `Error signing in with ${provider}`
                }));
            }
        } 
        catch (error) {
            console.error('Social signin error:', error);
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='text-white min-h-screen flex px-4 py-6 items-center justify-center bg-gradient-to-br from-[#09090B] via-[#131218] to-[#1A1830]'>
            <div className='min-w-[50%] w-full max-w-sm'>
                <div className='flex justify-center mb-6'>
                    <Image
                        src ="/Assets/quiver-logo.svg"
                        alt="Quiver Logo"
                        width={80}
                        height={80}
                            className="object-contain hover:scale-105 transition-transform duration-300"
                            style={{animation: 'float 6s ease-in-out infinite'}}
                    />
                </div>
                <div className='bg-[#1E1E1E] rounded-2xl py-15 px-20 w-full'>
                <h1 className="text-2xl font-semibold text-center mb-6">Sign In to Your Account</h1>                
                <p className="text-gray-400 text-sm text-center mb-6">Continue your journey</p>   
                <form onSubmit={handleSubmit} className="space-y-4 mb-15">
                    <InputField
                            id="identifier"
                            name="identifier"
                            placeholder="Username or Email"
                            value={formData.identifier}
                            onChange={handleChange}
                            error={formErrors.identifier}
                        />
                        <div className="mt-6">
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                        />
                        </div>                        
                        <Link href="/forgot-password" className="text-sm text-[#5529C9] hover:underline">
                                Forgot password?
                            </Link>
                        <div className="flex items-center justify-between">
              <div className="flex items-center group">                
              <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="sr-only"
                />
                      <label 
                      htmlFor="rememberMe" 
                      className={`
                      w-5 h-5 border-[1px] flex items-center justify-center duration-200
                      group-hover:border-[#5222D0]
                      text-sm text-gray-400 ml-2 cursor-pointer group-hover:text-gray-300 transition-colors
                      
                      ${formData.rememberMe 
                        ? 'bg-[#5222D0] border-[#5222D0]' 
                        : 'bg-transparent border-gray-500'
                      }
                    `}            
                    >
        
                            {formData.rememberMe && (
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
                        </svg>                      )}
                    </label>
                    <label htmlFor="rememberMe" className="text-sm text-gray-400 ml-2 cursor-pointer group-hover:text-gray-300"> Remember me
                </label>
              </div>                
              <Button 
                type="submit" 
                primary 
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-6 whitespace-nowrap hover:shadow-[0_0_20px_rgba(82,34,208,0.5)] hover:scale-105 border border-transparent hover:border-purple-300/30">
                {isLoading ? 'Signing In...' : 'Sign In'} <span className="ml-2">→</span>
              </Button>
                </div>
                </form>


                    <Divider text="Or continue with" />    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SocialAuthButton
        icon={<GoogleIcon />}
        text="Google"
        borderColor="white"
        onClick={() => handleSocialSignIn('google')}
        disabled={isLoading}
      />      
      <SocialAuthButton
        icon={<GitHubIcon />}
        text="GitHub"
        
        onClick={() => handleSocialSignIn('github')}
        disabled={isLoading}
      />
      
      <SocialAuthButton
        icon={<AppleIcon />}
        text="Apple"
        borderColor="white"
        onClick={() => router.push('/not-found')}
        disabled={isLoading}
      />
      </div>
</div>        <div className="flex items-center justify-center mt-5 space-x-2">
          <p className="text-gray-400 text-sm">Don't have an account?</p>
          <Link 
            href="/signup" 
            className="inline-block bg-[#26223A] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm hover:underline hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:bg-[#5529C9] overflow-hidden hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
</div>
        </main>
    )
}