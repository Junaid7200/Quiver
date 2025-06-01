"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function NotFound() {
  // Add fun animation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090B] via-[#131218] to-[#1A1830] flex items-center justify-center px-4 text-white">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <div 
            className="relative" 
            style={{animation: 'float 6s ease-in-out infinite'}}
          >
            <Image
              src="/Assets/quiver-logo.svg"
              alt="Quiver Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            <div className="absolute w-full h-full top-0 left-0 rounded-full bg-[#5222D0] opacity-20 blur-xl" 
                 style={{animation: 'pulse 3s ease-in-out infinite'}}></div>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#5222D0] via-[#9B87F5] to-[#5222D0] bg-clip-text text-transparent"
            style={{backgroundSize: '200% auto', animation: 'gradient 5s ease infinite'}}>
          Oops! Page Not Found
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          We're still working on this feature. Check back soon for updates!
        </p>
        
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700 mb-8">
          <p className="text-gray-400 mb-4">Available features include:</p>
          <ul className="space-y-2 text-left list-disc list-inside">
            <li className="text-[#9B87F5]">Signup and login with Google and/or Github (the apple one is paid so you know...)</li>
            <li className="text-[#9B87F5]">Note taking and organization with AI generated links and summaries</li>
            <li className="text-[#9B87F5]">Flashcards for effective studying</li>
            <li className="text-[#9B87F5]">Pomodoro timer for focused sessions</li>
            <li className="text-[#9B87F5]">Quizzes to test your knowledge</li>
          </ul>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/"
            className="px-8 py-3 bg-[#5222D0] rounded-lg hover:bg-[#4319B3] transition-all hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105"
          >
            Return Home
          </Link>
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-[#1E1E1E] border border-[#5222D0] rounded-lg hover:bg-[#26223A] transition-all hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}