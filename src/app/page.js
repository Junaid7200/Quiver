'use client'

import Image from "next/image"
import HeaderButtons from './components/LandingPageNavBar';
import PageFooter from './components/landingPageFooter';
import { useRouter } from "next/navigation";

export default function indexPage() {
    const router = useRouter()
    function getStartedFree(){
        router.push('');
    }
    function watchDemo(){
        router.push('');
    }
    return (
        <div className="w-full flex flex-col bg-black h-[100%]">
            <header className="bg-[#09090B] w-[100%] h-[70px] flex justify-between items-center px-[40px] border-b border-solid border-[#E3DEED]">
                <div className="flex h-[100%] items-center">
                    <Image src="/Assets/quiver-logo.svg" alt='Quiver' width={50} height={50} className="mr-[10px]" />
                    <p className="text-[28px]">Quiver</p>
                </div>
                <HeaderButtons />
            </header>
            <div className="UpperSection pl-[80px] pr-[80px] bg-black my-[10%] w-full flex items-center justify-between">
                <div className=" text mr-[70px] w-[60%]">
                    <div className="w-[100%] pt-[27px]">
                        <div><p className="text-white text-8xl font-bold">Aim.</p></div>
                        <div><p className="text-[#EC615B] text-8xl font-bold ml-[20%]">Note.</p></div>
                        <div><p className="text-[#5222D0] text-8xl font-bold ml-[43%]">Navigate.</p></div>
                    </div>
                    <div className="w-[100%] text-gray-700 pt-[5%]">
                        <p className="w-[100%] text-2xl">Our mission is to offer dynamic AI-based assessments to determine scholarship eligibility and empower students with valuable insights.</p>
                    </div>
                </div>
                <div className="Image w-[40%]">
                    <Image src="/Assets/landingPage.svg" width={650} height={446} alt='Girl painting on a big screen in front of her'></Image>
                </div>
            </div>
            <div className="midSection flex flex-col justify-between w-full px-[40px] h-[50%] mb-[10%]">
                <div className="w-[100%]">
                    <p className="text-[#5222D0] text-4xl text-center">Supercharge Your Study Sessions</p>
                </div>
                <div className="w-[100%] px-[25%] pt-[2%] pb-[2%]">
                    <p className="text-[#A1A1AA] text-lg tracking-wider text-center">Quiver leverages AI to transform how you take notes and study, helping you
                        understand and remember more with less effort.</p>
                </div>
                <div className="outerCards w-full flex justify-center items-center">
                    <div className="innerCards max-w-8xl h-[100%] flex flex-wrap justify-center mx-auto gap-6">
                        <div className="border border-solid border-[#E3DEED] rounded-lg h-[40%] bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] mr-[2%]">
                            <Image src='/Assets/notesIcon.svg' alt='Notes Icon' width={50} height={50}></Image>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%]">Smart Notes</p>
                            <p className='text-[#A1A1AA] tracking-wider'>Take notes normally while AI organizes and
                                enhances them automatically.</p>
                        </div>
                        <div className="border border-solid border-[#E3DEED] rounded-lg h-[40%] bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] mr-[2%]">
                            <Image src='/Assets/summariesIcon.svg' alt='Summaries Icon' width={50} height={50}></Image>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%]">AI Summaries</p>
                            <p className='text-[#A1A1AA] tracking-wider'>Get concise summaries of your notes to review key concepts quickly.</p>
                        </div>
                        <div className="border border-solid border-[#E3DEED] rounded-lg h-[40%] bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] mr-[2%]">
                            <Image src='/Assets/flashcardsIcon.svg' alt='Flashcards Icon' width={50} height={50}></Image>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%]">Auto Flashcards</p>
                            <p className='text-[#A1A1AA] tracking-wider'>AI-generated flashcards from your notes to test your knowledge.</p>
                        </div>
                        <div className="border border-solid border-[#E3DEED] rounded-lg h-[40%] bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] mr-[2%]">
                            <Image src='/Assets/quizzesIcon.svg' alt='Quizzes Icon' width={50} height={50}></Image>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%]">Smart Quizzes</p>
                            <p className='text-[#A1A1AA] tracking-wider'>Custom quizzes based on your notes to reinforce
                                your learning.</p>
                        </div>
                        <div className="border border-solid border-[#E3DEED] rounded-lg h-[40%] bg-[#27272A] py-[2%] px-[2%] mb-[2%] mr-[2%] w-[27%] mr-[2%]">
                            <Image src='/Assets/focusModeIcon.svg' alt='Focus Mode Icon' width={50} height={50}></Image>
                            <p className="text-[#9B87F5] text-xl pt-[5%] pb-[3%]">Focus Mode</p>
                            <p className='text-[#A1A1AA] tracking-wider'>Pomodoro timer with rewards to keep you focused during study sessions.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lowerSection relative mb-[10%]">
                <div className="lower bg-[#5222D0] rounded-2xl w-[50%] h-[100%] absolute rotate-4 z-0 left-1/2 -translate-x-1/2"></div>
                <div className="upper bg-[#27272A] border border-solid border-[#A78BF4] rounded-2xl px-[6%] py-[3%] w-[50%] h-[50%] relative z-10 mx-auto">
                    <p className='text-[#9B87F5] text-3xl mb-[3%] text-center'>Ready to Transform Your Study Routine?</p>
                    <p className='text-[#A1A1AA] text-lg mb-[4%] text-center'>Join thousands of students who are studying smarter with Notus. Get started for free today.</p>
                    <div className="flex justify-center items-center w-[100%] mb-[4%]">
                        <div className="Buttons flex w-[45%] justify-between">
                            <button className='bg-[#5222D0] text-white rounded-lg px-[3%] py-[4%] tracking-wider' onClick={getStartedFree}>Get Started Free</button>
                            <button className='bg-white text-black rounded-lg px-[3%] py-[4%] tracking-wider' onClick={watchDemo}>Watch Demo</button>
                        </div>
                    </div>
                    <p className='text-[#A1A1AA] text-center'>No credit card required. Cancel anytime.</p>
                </div>
            </div>
            <PageFooter></PageFooter>
        </div>
    )
}