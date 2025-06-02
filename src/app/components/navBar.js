'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from '../../utils/supabase/client.ts'
import { useRouter } from "next/navigation";
import { useTheme } from '../components/ThemeContext';
import Link from "next/link";

export default function NavBar() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
           const fetchUserData = async () => {
            try {
                const supabase = createClient();

                // First get auth user
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
                console.log("Auth User:", authUser); // Debug log

                if (authError) throw authError;
                if (!authUser) {
                    router.push('/signin');
                    return;
                }

                // Then fetch user profile data
                const { data: userData, error: dbError } = await supabase
                    .from('users')
                    .select('first_name, last_name')
                    .eq('id', authUser.id)
                    .single();

                console.log("DB Query:", { id: authUser.id, result: userData }); // Debug log

                if (dbError) throw dbError;
                if (!userData) {
                    console.error("No user profile found for ID:", authUser.id);
                    return;
                }

                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                setError(error.message);
            }
        };

        fetchUserData();
    }, [router]);

    const userInitials = user
        ? `${(user.first_name?.[0] || '').toUpperCase()}${(user.last_name?.[0] || '').toUpperCase()}`
        : '';

    if (error) {
        console.error("NavBar Error:", error);
    }


// function to go to the profile page when the profile-button is clicked:
    const handleProfileClick = () => {
        router.push('../profile');
    };

// function to go to the settings page when the settings-button is clicked:
    const handleSettingsClick = () => {
        router.push('../settings');
    };

    return (
        <div className="w-[15%] flex justify-end">
            <button 
                onClick={toggleTheme} 
                className='light-dark-mode-button pr-[22px] transition-transform hover:scale-110'
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? (
                    <Image src='/Assets/dayTheme.svg' width={30} height={30} alt='Switch to Light Theme' />
                ) : (
                    <Image src='/Assets/darkTheme.svg' width={30} height={30} alt='Switch to Dark Theme' />
                )}
            </button>
            <button onClick={handleSettingsClick} className='cursor-pointer settings-button pr-[22px]'><Image src='/Assets/settingsIcon.svg' width={30} height={30} alt='Settings Icon'></Image></button>
            <div onClick={handleProfileClick} className="cursor-pointer profile-button w-[45px] h-[45px] rounded-full bg-[#32E0C4] flex justify-center items-center"><p className="text-center">{userInitials}</p></div>
        </div>
    )
}