// we will use this page to login the user

"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/passwordInput';
import Button from '../../components/Button';
import SocialAuthButton from '../../components/AuthSocialButton';
import GoogleIcon from '../../components/GoogleIcon';
import FacebookIcon from '../../components/FacebookIcon';
import AppleIcon from '../../components/AppleIcon'; 
import Divider from '../../components/Divider';


export default function SignInPage() {
    const [formData, setFormData] = useState({
        identifier: '', // can be username or email
        password: '',
        rememberMe: false
    });
    
    const [formErrors, setFormErrors] = useState({
        identifier: '',
        password: ''
    });

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
        } else if (formData.password.length < 8) {
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
        
        // Here you'll implement the login logic
        // You can check if identifier looks like an email or username
        const isEmail = formData.identifier.includes('@');
        console.log(`Attempting to log in with ${isEmail ? 'email' : 'username'}`);
        
        // Then authenticate with appropriate backend method
    };

    return (
        <main className='bg-[#09090B] text-white min-h-screen flex px-4 py-6 items-center justify-center'>
            <div className='min-w-[50%] w-full max-w-sm'>
                <div className='flex justify-center mb-6'>
                    <Image
                        src ="/Assets/quiver-logo.svg"
                        alt="Quiver Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className='bg-[#1E1E1E] rounded-2xl py-15 px-40 w-full'>
                <h1 className="text-2xl font-semibold text-center mb-6">Sign In to Your Account</h1>                <form onSubmit={handleSubmit} className="space-y-4 mb-20">
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
                        </div>                        <Link href="/auth/forgot-password" className="text-sm text-[#5529C9] hover:underline">
                                Forgot password?
                            </Link>
                        <div className="flex items-center justify-between">
              <div className="flex items-center">                <input 
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
                      w-5 h-5 border-[1px] cursor-pointer flex items-center justify-center transition-all duration-200
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
                              <label htmlFor="rememberMe" className="text-sm text-gray-400 ml-2"> Remember me
                </label>
              </div>
                <Button 
                type="submit" 
                primary 
                className="px-6 whitespace-nowrap">
                Sign In <span className="ml-2">→</span>
              </Button>
                </div>
                </form>


                    <Divider text="Or continue with" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SocialAuthButton
        icon={<GoogleIcon />}
        text="Google"
        borderColor="white"
        onClick={handleChange}
      />
      <SocialAuthButton
        icon={<FacebookIcon />}
        text="Facebook"
        borderColor="#1877F2"
        onClick={handleChange}
      />
      
      <SocialAuthButton
        icon={<AppleIcon />}
        text="Apple"
        borderColor="white"
        onClick={handleChange}
      />
      </div>
</div>        <div className="flex items-center justify-center mt-5 space-x-2">
          <p className="text-gray-400 text-sm">Don't have an account?</p>
          <Link 
            href="/auth/signup" 
            className="inline-block bg-[#26223A] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm hover:underline hover:bg-[#5222D0]"
          >
            Sign Up
          </Link>
        </div>
</div>
        </main>
    )
}