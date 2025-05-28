'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from '../../utils/supabase/client.ts'
import { useRouter } from "next/navigation";

export default function NavBar() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

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

    return (
        <div className="w-[10%] flex gap-5">
            <button><Image src='/Assets/dayTheme.svg' width={30} height={30} alt='Day Theme Icon'></Image></button>
            <button><Image src='/Assets/settingsIcon.svg' width={30} height={30} alt='Settings Icon'></Image></button>
            <div className="w-[40px] h-[40px] rounded-full bg-[#32E0C4]"><p className="text-center">{userInitials}</p></div>
        </div>
    )
}