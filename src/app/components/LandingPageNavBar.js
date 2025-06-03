'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from './ThemeContext';

export default function HeaderButtons() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
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
            <button type='button' onClick={login} className="w-[15%] h-[42px] rounded-md text-black bg-[#FFFFFF] flex items-center justify-center tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105 border border-transparent hover:border-white/30 relative overflow-hidden cursor-pointer">Log In</button>
            
            
            <button type='button' onClick={signup} className="w-[25%] h-[42px] rounded-md text-white bg-[#5222D0] flex items-center justify-center tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105 border border-transparent hover:border-purple-300/30 relative overflow-hidden cursor-pointer">Get Started</button>
        </div>
    )
}