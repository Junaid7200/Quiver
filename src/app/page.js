"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import { createClient } from '../utils/supabase/client';
import HeaderButtons from './components/LandingPageNavBar';
import PageFooter from './components/landingPageFooter';
import AnimatedSvg from '/public/Assets/animatedLandingPage.svg';



export default function indexPage() {
    const router = useRouter()


    // function getStartedFree(){
    //     router.push('');
    // }
    function watchDemo(){
        router.push('');
    }
    const supabase = createClient();    // create connection with supabase

// the [] means the useEffect will run only once when the component mounts
    // useEffect(() => {
    //     checkAuthStatus();
    // }, []);

// Function to check if the user is already logged in
    // const checkAuthStatus = async () => {
    //     try {
    //         const { data: { user } } = await supabase.auth.getUser();   // getUser is a promise thats why we have await behind it
    //         if (user) {
    //             router.push('/dashboard');
    //         }
    //     } 
    //     catch (error) {
    //         console.error('Error checking auth status:', error);
    //     }
    // };


    function signup() {
        router.push('/signup');
    }


    return (
        <div className="w-full flex flex-col bg-black h-[100%]">
            <header className="bg-[#09090B] w-[100%] h-[70px] flex justify-between items-center px-[40px] border-b border-solid border-[#E3DEED] sticky top-0 z-50">
                <div className="flex h-[100%] items-center">
                    <Image src="/Assets/quiver-logo.svg" alt='Quiver' width={50} height={50} className="mr-[10px]" />
                    <p className="text-[28px]">Quiver</p>
                </div>
                <HeaderButtons />
            </header>

            <div className="UpperSection pl-[80px] pr-[80px] bg-black my-[8%] w-full flex items-center justify-between">
                <div className=" text mr-[15%] w-[60%]">
                    <div className="w-[100%] pt-[27px]">
                        <div><p className="text-white text-8xl font-bold animate-fadeIn">Aim.</p></div>
                        <div><p className="text-[#EC615B] text-8xl font-bold ml-[20%] animate-fadeIn animation-delay-300">Note.</p></div>
                        <div><p className="text-[#5222D0] text-8xl font-bold ml-[43%] animate-fadeIn animation-delay-600">Navigate.</p></div>
                    </div>
                    <div className="w-[100%] text-gray-700 pt-[5%]">
                        <p className="w-[100%] text-2xl animate-fadeIn animation-delay-1200">Our mission is to offer dynamic AI-based assessments and note-taking tools to help you learn better, faster, and more effectively.</p>
                    </div>
                </div>
                <div className="Image mr-50 -mt-20 w-[40%]">
                    <Image
                        src={"/Assets/landingPage/landingPage.svg"}
                        alt="Animated Landing Page"
                        width={600}
                        height={400}
                        className="w-full h-auto animate-fadeIn animation-delay-1500"
                    />
                </div>
            </div>


            {/*Features section*/ }
            <div id="features-section" className="midSection flex flex-col justify-between w-full px-[40px] h-[50%] mb-[10%]">
                <div className="w-[100%]">
                    <p className="text-[#5222D0] text-4xl text-center">Supercharge Your Study Sessions</p>
                </div>
                <div className="w-[100%] px-[25%] pt-[2%] pb-[2%]">
                    <p className="text-[#A1A1AA] text-lg tracking-wider text-center">Quiver leverages AI to transform how you take notes and study, helping you
                        understand and remember more with less effort.</p>
                </div>
                {/* 5 sections, the features */}
                <div className="outerCards w-full flex justify-center items-center">
                    <div className="innerCards max-w-8xl h-[100%] flex flex-wrap justify-center mx-auto gap-4 items-stretch">
                        <div className="border border-solid border-[#E3DEED] rounded-lg bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-900/20 hover:border-[#9B87F5] group">
                            <div className="transform transition-all duration-300 group-hover:scale-110">
                                <Image src='/Assets/landingPage/notesIcon.svg' alt='Notes Icon' width={50} height={50} className="transition-all duration-300 "></Image>
                            </div>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%] transition-all duration-300 ">Smart Notes</p>
                            <p className='text-[#A1A1AA] tracking-wider transition-all duration-300 '>Take notes normally while AI organizes and
                                enhances them automatically.</p>
                        </div>
                        <div className="border border-solid border-[#E3DEED] rounded-lg bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-900/20 hover:border-[#9B87F5] group">
                            <div className="transform transition-all duration-300 group-hover:scale-110">
                                <Image src='/Assets/landingPage/summariesIcon.svg' alt='Summaries Icon' width={50} height={50} className="transition-all duration-300"></Image>
                            </div>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%] transition-all duration-300">AI Summaries</p>
                            <p className='text-[#A1A1AA] tracking-wider transition-all duration-300'>Get concise summaries of your notes to review key concepts quickly.</p>
                        </div>

                        <div className="border border-solid border-[#E3DEED] rounded-lg bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-900/20 hover:border-[#9B87F5] group">
                            <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:translate-y-[-5px]">
                                <Image src='/Assets/landingPage/flashcardsIcon.svg' alt='Flashcards Icon' width={50} height={50} className="transition-all duration-300"></Image>
                            </div>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%] transition-all duration-300">Auto Flashcards</p>
                            <p className='text-[#A1A1AA] tracking-wider transition-all duration-300'>AI-generated flashcards from your notes to test your knowledge.</p>
                        </div>

                        
                        <div className="border border-solid border-[#E3DEED] rounded-lg bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-900/20 hover:border-[#9B87F5] group">
                            <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:translate-y-[-5px]">
                                <Image src='/Assets/landingPage/quizzesIcon.svg' alt='Quizzes Icon' width={50} height={50} className="transition-all duration-300 "></Image>
                            </div>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%] transition-all duration-300">Smart Quizzes</p>
                            <p className='text-[#A1A1AA] tracking-wider transition-all duration-300'>Custom quizzes based on your notes to reinforce
                                your learning.</p>
                        </div>


                        <div className="border border-solid border-[#E3DEED] rounded-lg bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-900/20 hover:border-[#9B87F5] group">
                            <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:translate-y-[-5px]">
                                <Image src='/Assets/landingPage/focusModeIcon.svg' alt='Focus Mode Icon' width={50} height={50} className="transition-all duration-300"></Image>
                            </div>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%] transition-all duration-300">Focus Mode</p>
                            <p className='text-[#A1A1AA] tracking-wider transition-all duration-300'>Pomodoro timer with rewards to keep you focused during study sessions.</p>
                        </div>
                    </div>
                </div>
            </div>


            {/*Rotating lower div section*/ }
            <div className="lowerSection relative mb-[10%] group">
                {/* Purple background with rotation effect on hover */}
                <div className="lower bg-[#5222D0] rounded-2xl w-[50%] h-[100%] absolute rotate-4 z-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out group-hover:-rotate-4 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(82,34,208,0.6)] overflow-hidden">
                    {/* Add glowing particles that appear on hover */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute w-20 h-20 bg-white rounded-full blur-xl opacity-20 top-1/4 left-1/4 animate-pulse"></div>
                        <div className="absolute w-16 h-16 bg-white rounded-full blur-xl opacity-20 bottom-1/3 right-1/3 animate-pulse" style={{animationDelay: "0.3s"}}></div>
                        <div className="absolute w-12 h-12 bg-white rounded-full blur-xl opacity-20 top-1/2 right-1/4 animate-pulse" style={{animationDelay: "0.7s"}}></div>
                    </div>
                </div>
                <div className="upper bg-[#27272A] border border-solid border-[#A78BF4] rounded-2xl px-[6%] py-[3%] w-[50%] h-[50%] relative z-10 mx-auto transition-all duration-500 ease-in-out group-hover:transform group-hover:scale-[1.02] group-hover:shadow-[0_5px_20px_rgba(155,135,245,0.3)]">
                    <p className='text-[#9B87F5] text-3xl mb-[3%] text-center transition-all duration-500 group-hover:text-white group-hover:text-shadow-lg'>Ready to Transform Your Study Routine?</p>
                    <p className='text-[#A1A1AA] text-lg mb-[4%] text-center'>Join thousands of students who are studying smarter with Quiver. Get started for free today.</p>
                    <div className="flex justify-center items-center w-[100%] mb-[4%]">
                        <div className="Buttons flex w-[55%] justify-between">
                            <button className='bg-[#5222D0] text-white rounded-lg px-[3%] py-[4%] tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105 relative overflow-hidden' onClick={signup}>
                                <span className="relative z-10">Get Started Free</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#5222D0] via-[#9B87F5] to-[#5222D0] opacity-0 hover:opacity-100 transition-opacity duration-700 bg-size-200 animate-gradient-x"></span>
                            </button>
                            <button className='bg-white text-black rounded-lg px-[3%] py-[4%] tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105' onClick={watchDemo}>Watch Demo</button>
                        </div>
                    </div>
                    <p className='text-[#A1A1AA] text-center'>No credit card required. Cancel anytime.</p>
                </div>
            </div>




            {/*Pricing Section*/ }
            <div id="pricing-section" className="pricing-section py-20 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-50"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#5222D0] mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
                            Choose the plan that works best for you. All plans include core features.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="bg-[#27272A] border border-[#E3DEED] rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-[0_5px_30px_rgba(82,34,208,0.3)]">
                            <div className="p-8">
                                <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-white">$0</span>
                                    <span className="ml-1 text-gray-400">/month</span>
                                </div>
                                <p className="text-[#A1A1AA] mb-6">Perfect for students just getting started.</p>
                                
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Smart Notes (5 max)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Basic AI Summaries</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Limited Flashcards</span>
                                    </li>
                                    <li className="flex items-start opacity-50">
                                        <svg className="h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-400">Advanced Quiz Generation</span>
                                    </li>
                                    <li className="flex items-start opacity-50">
                                        <svg className="h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-400">Priority Support</span>
                                    </li>
                                </ul>
                                <button 
                                    onClick={signup} 
                                    className="w-full py-3 px-6 text-white bg-[#5222D0] rounded-lg hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105 transition-all duration-300"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                        
                        {/* Pro Plan - Most Popular */}
                        <div className="bg-[#27272A] border-2 border-[#5222D0] rounded-xl overflow-hidden transform scale-105 shadow-[0_10px_30px_rgba(82,34,208,0.3)] relative transition-all duration-300 hover:shadow-[0_15px_40px_rgba(82,34,208,0.5)]">
                            <div className="absolute top-0 left-0 right-0 bg-[#5222D0] text-white text-center py-1 text-sm font-medium">
                                MOST POPULAR
                            </div>
                            <div className="p-8 pt-12">
                                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-white">$0.0</span>
                                    <span className="ml-1 text-gray-400">/month</span>
                                </div>
                                <p className="text-[#A1A1AA] mb-6">For serious students who need more power.</p>
                                
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Unlimited Smart Notes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Advanced AI Summaries</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Unlimited Flashcards</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Advanced Quiz Generation</span>
                                    </li>
                                    <li className="flex items-start opacity-50">
                                        <svg className="h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-400">Priority Support</span>
                                    </li>
                                </ul>
                                <button 
                                    onClick={signup} 
                                    className="w-full py-3 px-6 text-white bg-[#5222D0] rounded-lg hover:shadow-[0_0_15px_rgba(82,34,208,0.5)] hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Get Pro</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#5222D0] via-[#9B87F5] to-[#5222D0] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-size-200 animate-gradient-x"></span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Premium Plan */}
                        <div className="bg-[#27272A] border border-[#E3DEED] rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-[0_5px_30px_rgba(82,34,208,0.3)]">
                            <div className="p-8">
                                <h3 className="text-xl font-semibold text-white mb-2">Premium</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-white">$0.00</span>
                                    <span className="ml-1 text-gray-400">/month</span>
                                </div>
                                <p className="text-[#A1A1AA] mb-6">Everything you need for maximum results.</p>
                                
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Everything in Pro</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Custom AI Tutor</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Learning Analytics</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Study Group Features</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-[#9B87F5] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">Priority Support</span>
                                    </li>
                                </ul>
                                <button 
                                    onClick={signup} 
                                    className="w-full py-3 px-6 text-black bg-white rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    Get Premium
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <PageFooter></PageFooter>
        </div>
    )
}