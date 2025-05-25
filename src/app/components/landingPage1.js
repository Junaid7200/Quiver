'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeaderButtons() {
    const router = useRouter();
    function login(){
        router.push('../../auth/login')
    }

    function signup(){
        router.push('../../auth/signup')
    }
    return (
        <div>
            <Link href="">Features</Link>
            <Link href="">Pricing</Link>
            <Link href="">About</Link>
            <Image src="/Assets/theme-icon.svg" alt='Change theme' width={100} height={50} />
            <button type='button' onClick={login}>Log In</button>
            <button type='button' onClick={signup}>Get Started</button>
        </div>
    )
}