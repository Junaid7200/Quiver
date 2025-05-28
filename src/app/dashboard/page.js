"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from '../../utils/supabase/client.ts'
import Link from "next/link";

export default function bleh() {
    const [firstname, setFirstName] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const supabase = createClient();

                //getting auth user
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                if (authError) throw authError;
                if (!authUser) {
                    router.push('/signin');
                    return;
                }

                //fetching username
                const { data: userName, error: dbError } = await supabase
                    .from('users')
                    .select('first_name')
                    .eq('id', authUser.id)
                    .single();

                if (dbError) throw dbError;
                if (!userName) {
                    console.error("No user profile found for ID:", authUser.id);
                    return;
                }

                setFirstName(userName.first_name);
            } catch (error) {
                console.error("Error fetching user:", error);
                setError(error.message);
            }
        };
        fetchUserName();
    }, [router])
    const name = firstname || '';


    return (
        <main className="min-h-screen w-[100%] mt-[3%]">
            <p className='text-4xl'>Welcome back, {name}!</p>
            <p className="text-[#A1A1AA]">Track your learning progress and continue where you left off.</p>
        </main>
    )
}
