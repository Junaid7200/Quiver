"use client"; // cz we will use client components here (form)
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/passwordInput';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import SocialAuthButton from '../../components/AuthSocialButton';
import GoogleIcon from '../../components/googleIcon';
import FacebookIcon from '../../components/FacebookIcon';
import AppleIcon from '../../components/AppleIcon';










export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.agreeToTerms) {
      alert('You must agree to the terms and conditions');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Here you would integrate with Supabase for authentication
    try {
      // Placeholder for Supabase signup
      console.log('Signing up user:', formData);
      // Redirect to dashboard after successful signup
      // router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error creating account. Please try again.');
    }
  };

  const handleSocialSignUp = (provider) => {
    // Placeholder for social signup logic
    console.log(`Sign up with ${provider}`);
  };  
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white px-4 py-6">
      <div className="min-w-[50%] w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image 
            src="/Assets/quiver-logo.png" 
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
              />
              <InputField 
                id="lastName" 
                placeholder="Last name..." 
                value={formData.lastName} 
                onChange={handleChange} 
                required
              />
            </div>
            <InputField 
              id="username" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleChange} 
              required
            />
            <InputField 
              id="email" 
              type="email" 
              placeholder="Email address" 
              value={formData.email} 
              onChange={handleChange} 
              required
            />
            
            <PasswordInput 
              id="password" 
              placeholder="Create password" 
              value={formData.password} 
              onChange={handleChange} 
              required
            />
            
            <PasswordInput 
              id="confirmPassword" 
              placeholder="Confirm password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required
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
                    </label>
                              <label htmlFor="agreeToTerms" className="text-sm text-gray-400 ml-2">
                  I Agree with all of your <Link href="/terms" className="text-[#5529C9] hover:underline">Terms & Conditions</Link>
                </label>
              </div>
              <Button 
                type="submit" 
                primary 
                className="px-6 whitespace-nowrap"
              >
                Create Account <span className="ml-2">→</span>
              </Button>
            </div>
          </form>
            <Divider text="SIGN UP WITH" />
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
        </div>
        
        <div className="flex items-center justify-center mt-5 space-x-2">
          <p className="text-gray-400 text-sm">Already have an account?</p>
          <Link 
            href="/auth/login" 
            className="inline-block bg-[#26223A] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm hover:underline hover:bg-[#5222D0]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}