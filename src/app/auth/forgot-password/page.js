"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would integrate with your authentication service
        // to send a password reset email
        console.log('Password reset requested for:', email);
        
        // For now, we'll just show a success message
        setIsSubmitted(true);
    };

    return (
        <main className='bg-[#09090B] text-white min-h-screen flex px-4 py-6 items-center justify-center'>
            <div className='min-w-[50%] w-full max-w-sm'>
                <div className='flex justify-center mb-6'>
                    <Image
                        src="/Assets/quiver-logo.png"
                        alt="Quiver Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className='bg-[#1E1E1E] rounded-2xl py-15 px-40 w-full'>
                    <h1 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h1>
                    
                    {!isSubmitted ? (
                        <>
                            <p className="text-gray-400 text-sm mb-6 text-center">
                                Enter your email address and we'll send you a link to reset your password
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-6 mb-10">
                                <InputField
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                
                                <Button
                                    type="submit"
                                    primary
                                    className="w-full"
                                >
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center mb-10">
                            <div className="bg-[#26223A] p-4 rounded-lg mb-6">
                                <p className="text-green-400 mb-2">✓ Email Sent</p>
                                <p className="text-sm text-gray-300">
                                    Check your inbox for a password reset link
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-center">
                        <Link href="/auth/signin" className="text-[#5529C9] text-sm hover:underline">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
