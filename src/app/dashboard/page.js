"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '../../utils/supabase/client';
import Button from '../components/Button';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                router.push('/signin');
                return;
            }

            setUser(user);
            
            // Fetch user profile data
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else {
                setUserProfile(profile);
            }

            // Fetch user progress data
            const { data: progress, error: progressError } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (progressError) {
                console.error('Error fetching progress:', progressError);
            } else {
                setUserProgress(progress);
            }

        } catch (error) {
            console.error('Error checking user:', error);
            setError('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error);
            } else {
                router.push('/signin');
            }
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    if (isLoading) {
        return (
            <main className='bg-[#09090B] text-white min-h-screen flex items-center justify-center'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5529C9] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className='bg-[#09090B] text-white min-h-screen flex items-center justify-center'>
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} primary>
                        Retry
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className='bg-[#09090B] text-white min-h-screen'>
            {/* Header */}
            <header className='bg-[#1E1E1E] border-b border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center'>
                            <Image
                                src="/Assets/quiver-logo.png"
                                alt="Quiver Logo"
                                width={40}
                                height={40}
                                className="object-contain mr-3"
                            />
                            <h1 className="text-xl font-bold">Quiver Dashboard</h1>
                        </div>
                        
                        <div className='flex items-center space-x-4'>
                            <div className="text-right">
                                <p className="text-sm text-gray-300">Welcome back,</p>
                                <p className="text-sm font-medium">
                                    {userProfile?.display_name || userProfile?.username || user?.email}
                                </p>
                            </div>
                            <Button 
                                onClick={handleSignOut}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    
                    {/* User Profile Card */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Profile Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white">{user?.email}</p>
                            </div>
                            {userProfile?.username && (
                                <div>
                                    <p className="text-sm text-gray-400">Username</p>
                                    <p className="text-white">{userProfile.username}</p>
                                </div>
                            )}
                            {userProfile?.display_name && (
                                <div>
                                    <p className="text-sm text-gray-400">Display Name</p>
                                    <p className="text-white">{userProfile.display_name}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-400">Account Created</p>
                                <p className="text-white">
                                    {new Date(user?.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {userProfile?.last_login_at && (
                                <div>
                                    <p className="text-sm text-gray-400">Last Login</p>
                                    <p className="text-white">
                                        {new Date(userProfile.last_login_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Progress Card */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Progress</h2>
                        {userProgress ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-400">Level</p>
                                    <p className="text-white text-2xl font-bold">{userProgress.level}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Experience Points</p>
                                    <p className="text-white">{userProgress.experience_points}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Progress Updated</p>
                                    <p className="text-white">
                                        {new Date(userProgress.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">No progress data available</p>
                        )}
                    </div>

                    {/* Quick Actions Card */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button 
                                primary 
                                className="w-full"
                                onClick={() => {/* Add functionality */}}
                            >
                                Start Learning
                            </Button>
                            <Button 
                                className="w-full bg-gray-700 hover:bg-gray-600"
                                onClick={() => {/* Add functionality */}}
                            >
                                View Courses
                            </Button>
                            <Button 
                                className="w-full bg-gray-700 hover:bg-gray-600"
                                onClick={() => {/* Add functionality */}}
                            >
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800 md:col-span-2 lg:col-span-3'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Recent Activity</h2>
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No recent activity to display</p>
                            <p className="text-sm text-gray-500">Start learning to see your activity here</p>
                        </div>
                    </div>
                </div>

                {/* Feature Sections */}
                <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    
                    {/* Learning Path */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Your Learning Path</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded">
                                <div>
                                    <p className="text-white font-medium">Introduction to Programming</p>
                                    <p className="text-sm text-gray-400">Beginner Level</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-[#5529C9]">0%</p>
                                    <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                                        <div className="bg-[#5529C9] h-2 rounded-full" style={{width: '0%'}}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded opacity-50">
                                <div>
                                    <p className="text-white font-medium">Data Structures</p>
                                    <p className="text-sm text-gray-400">Intermediate Level</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Locked</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded opacity-50">
                                <div>
                                    <p className="text-white font-medium">Advanced Algorithms</p>
                                    <p className="text-sm text-gray-400">Advanced Level</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Locked</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className='bg-[#1E1E1E] rounded-lg p-6 border border-gray-800'>
                        <h2 className="text-lg font-semibold mb-4 text-[#5529C9]">Achievements</h2>
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">🏆</div>
                            <p className="text-gray-400 mb-2">No achievements yet</p>
                            <p className="text-sm text-gray-500">Complete lessons to earn your first achievement</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}