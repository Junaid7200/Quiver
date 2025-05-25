'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeaderButtons() {
    const router = useRouter();
    function login(){
        router.push('../auth/signin')
    }

    function signup(){
        router.push('../auth/signup')
    }
    return (
        <div className="flex justify-between items-center h-[70px] w-[464px]">
            <Link href="" className="text-[#635C70]">Features</Link>
            <Link href="" className="text-[#635C70] ">Pricing</Link>
            <Link href="" className="text-[#635C70]">About</Link>
            <Image src="/Assets/theme-icon.svg" alt='Change theme' width={25} height={25} />
            <button type='button' onClick={login} className="w-[15%] h-[42px] rounded-md text-black bg-[#FFFFFF] flex items-center justify-center tracking-wider">Log In</button>
            <button type='button' onClick={signup} className="w-[25%] h-[42px] rounded-md text-white bg-[#5222D0] flex items-center justify-center tracking-wider">Get Started</button>
        </div>
    )
}