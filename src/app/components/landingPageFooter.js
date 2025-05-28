'use client'

import Image from "next/image"
import Link from "next/link"

export default function PageFooter() {
    return (
        <div>
            <div className='upperFooter flex justify-between w-full px-[3%] h-[25%] py-[2%] border-t border-b border-solid border-[#E3DEED]'>
                <div className="left w-[25%]  flex flex-col h-[100%]">
                    <div className="upper flex items-center h-[40px] w-[100%] mb-[2%]">
                        <Image src='/Assets/quiver-logo.png' alt='QUiver' width={35} height={35} className="mr-[2%]"></Image>
                        <p className='text-2xl tracking-wide'>Quiver</p>
                    </div>
                    <div className="lower">
                        <p className="text-[#635C70]">The AI-powered note-taking and study app that
                            helps you learn better, faster.</p>
                    </div>
                </div>
                <div className="middle1 w-[10%] flex flex-col h-[100%]">
                    <p className="text-[#9B87F5] text-xl font-semibold mb-[5%]">Company</p>
                    <Link href='' className="text-[#635C70] mb-[3%]">About</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Contact</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Privacy</Link>
                </div>
                <div className="middle2 w-[10%]  flex flex-col h-[100%]">
                    <p className="text-[#9B87F5] text-xl font-semibold mb-[5%]">Resources</p>
                    <Link href='' className="text-[#635C70] mb-[3%]">Help Center</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Blog</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Study Guides</Link>
                </div>
                <div className="right w-[10%]  flex flex-col h-[100%]">
                    <p className="text-[#9B87F5] text-xl font-semibold mb-[5%]">Products</p>
                    <Link href='' className="text-[#635C70] mb-[3%]">Features</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Pricing</Link>
                    <Link href='' className="text-[#635C70] mb-[3%]">Roadmap</Link>
                </div>
            </div>
            <div className='lowerFooter w-full flex justify-between px-[3%] h-[5%] py-[1%]'>
                <div className='left'>
                    <p className="text-[#9B87F5]">&copy; 2025 Quiver. All rights reserved.</p>
                </div>
                <div className="right flex justify-between w-[15%]">
                    <Link href='' className='text-[#635C70]'>Terms</Link>
                    <Link href='' className='text-[#635C70]'>Privacy</Link>
                    <Link href='' className='text-[#635C70]'>Cookies</Link>
                </div>
            </div>
        </div>
    )
}