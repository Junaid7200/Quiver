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
        <main className="min-h-screen w-[100%] mt-[3%] bg-[#09090B]">
            <p className='text-4xl pb-[1%]'>Welcome back, {name}!</p>
            <p className="text-[#A1A1AA] mb-[2%] text-md">Track your learning progress and continue where you left off.</p>
            <article className="w-full overflow-y-auto custom-scrollbar flex flex-col px-[3%]">
                <div className="upper flex gap-[6%] mb-20">
                    <div className="upper-left border border-[#27272A] rounded-xl w-[50%] min-h-[400px]">
                        <div className="heading1">

                        </div>
                        <div className="content1">

                        </div>
                    </div>
                    <div className="upper-right border border-[#27272A] rounded-xl w-[40%] min-h-[400px]">
                        <div className="heading2">

                        </div>
                        <div className="content2">

                        </div>
                    </div>
                </div>
                <div className="lower border border-[#27272A] rounded-xl w-[100%] min-h-[300px]">
                    <div className="heading3">
                            
                    </div>
                    <div className="content3">

                    </div>
                </div>
            </article>
        </main>
    )
}
