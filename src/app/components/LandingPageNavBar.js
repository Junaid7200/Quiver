'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeaderButtons() {
    const router = useRouter();
    function login(){
        router.push('/signin')
    }

    function signup(){
        router.push('/signup')
    };


    return (
        <div className="flex justify-between items-center h-[70px] w-[464px]">
            <Link href="#features-section" className="text-[#635C70]">Features</Link>
            <Link href="#pricing-section" className="text-[#635C70] ">Pricing</Link>
            <Link href="/about" className="text-[#635C70]">About</Link>
            <Image src="/Assets/dayTheme.svg" alt='Change theme' width={25} height={25} />
            <button type='button' onClick={login} className="w-[15%] h-[42px] rounded-md text-black bg-[#FFFFFF] flex items-center justify-center tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105 border border-transparent hover:border-white/30 relative overflow-hidden cursor-pointer">Log In</button>
            
            
            <button type='button' onClick={signup} className="w-[25%] h-[42px] rounded-md text-white bg-[#5222D0] flex items-center justify-center tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105 border border-transparent hover:border-purple-300/30 relative overflow-hidden cursor-pointer">Get Started</button>
        </div>
    )
}