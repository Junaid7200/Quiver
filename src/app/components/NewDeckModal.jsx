'use client'

import { useEffect } from "react"
import Image from "next/image";

export default function NewDeckModal({ isOpen, onClose, children }) {
    //ensuring that the modal closes when Escape key is pressed
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        //disabling abiliting to scroll the background when the modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        //allow ability to scroll again after modal is closed
        return () => {
            document.body.style.overflow = ''; // <--- Restore scroll
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose])

    if (!isOpen) return null;   //dont render if not open

    return (
        <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="w-[80%] h-[80%] bg-[#09090B] text-white rounded-lg shadow-lg border-1 border-solid border-[#32E0C4] relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 hover:scale-110"
                >
                    <Image src='/Assets/close-icon.svg' width={25} height={25} alt='close button'></Image>
                </button>
                {children}
            </div>
        </div>
    );
}