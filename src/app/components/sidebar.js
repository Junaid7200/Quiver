'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const pathName = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Notes', path: '/notes', icon: 'notes' },
        { name: 'Flashcards', path: '/flashcards', icon: 'flashcards' },
        { name: 'Quizzes', path: '/quizzes', icon: 'quizzes' },
        { name: 'Pomodoro', path: '/pomodoro', icon: 'pomodoro' }
    ];

    function signOut() {
        router.push('/signup');
    }

    return (
        <aside className="w-[18%] min-h-screen flex flex-col justify-between border-r border-solid border-[#27272A] px-[1%] py-[1%]">
            <div className="Upper">
                <div className="logo flex items-center h-[40px] w-[100%] mb-[13%]">
                    <Image src='/Assets/quiver-logo.svg' alt='QUiver' width={35} height={35} className="mr-[4%]"></Image>
                    <p className='text-2xl tracking-wide'>Quiver</p>
                </div>
                <div className="MainSection">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathName === item.path;
                            const iconPath = `/Assets/${item.icon}-${isActive ? 'purple' : 'white'}.svg`;

                            return (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={clsx(`flex items-center space-x-3 px-4 py-2 rounded-full transition-colors`, isActive ? 'bg-[#26223A] text-[#9B87F5]' : 'hover:bg-gray-800'
                                        )}
                                    >
                                        <img src={iconPath} alt={`${item.name} icon`} className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}

                    </ul>
                </div>
            </div>
            <div className='lower w-[100%]'>
                <button className="flex w-[100%] items-center px-4 py-2 rounded-full hover:bg-gray-800 text-[#A1A1AA]" onClick={signOut}>
                    <Image src='/Assets/signout.svg' alt='Sign Out icon' width={25} height={25} className="mr-[4%]"></Image>
                    Sign out</button>
            </div>
        </aside>
    )
}