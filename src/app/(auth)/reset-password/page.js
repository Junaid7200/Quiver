"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/client';
import PasswordInput from '../../components/passwordInput';
import Button from '../../components/Button';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        // Check if we have access_token and refresh_token in URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
            // Set the session with the tokens from the URL
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
    }, [searchParams, supabase.auth]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (error) setError('');
    };

    const validatePasswords = () => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswords()) return;
        
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
                // Redirect to signin after 3 seconds
                setTimeout(() => {
                    router.push('/signin');
                }, 3000);
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='bg-[#09090B] text-white min-h-screen flex px-4 py-6 items-center justify-center'>
            <div className='min-w-[50%] w-full max-w-sm'>
                <div className='flex justify-center mb-6'>
                    <Image
                        src="/Assets/quiver-logo.svg"
                        alt="Quiver Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className='bg-[#1E1E1E] rounded-2xl py-15 px-40 w-full'>
                    <h1 className="text-2xl font-semibold text-center mb-6">Set New Password</h1>
                    
                    {!isSuccess ? (
                        <>
                            <p className="text-gray-400 text-sm mb-6 text-center">
                                Enter your new password below
                            </p>
                            
                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6 mb-10">
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="New password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    error={error && password.length < 8}
                                    required
                                />
                                
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    error={error && password !== confirmPassword}
                                    required
                                />
                                
                                <Button
                                    type="submit"
                                    primary
                                    className="w-full"
                                    disabled={isLoading || !password.trim() || !confirmPassword.trim()}
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center mb-10">
                            <div className="bg-[#26223A] p-4 rounded-lg mb-6">
                                <p className="text-green-400 mb-2">✓ Password Updated</p>
                                <p className="text-sm text-gray-300">
                                    Your password has been successfully updated. Redirecting to sign in...
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-center">
                        <Link href="/signin" className="text-[#5529C9] text-sm hover:underline">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
