"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from '../../utils/supabase/client.ts'
import Link from "next/link";

export default function bleh(){
    const [firstname, setFirstName] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const supabase = createClient();

                //getting auth user
                const {data: { user: authUser}, error: authError} = await supabase.auth.getUser();

                if (authError) throw authError;
                if (!authUser) {
                    router.push('/signin');
                    return;
                }

                //fetching username
                const { data: userName, error: dbError} = await supabase
                    .from ('users')
                    .select('first_name')
                    .eq('id', authUser.id)
                    .simgle();

                if (dbError) throw dbError;
                if (!userData) {
                    console.error("No user profile found for ID:", authUser.id);
                    return;
                }

                setFirstName(userName);
            } catch{

            };
        };
    })

}
    