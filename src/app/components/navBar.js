'use client'
import Image from "next/image"

export default function navBar() {
    return (
        <div>
            <button><Image src='/Assets/dayTheme.svg' width={30} height={30} alt='Day Theme Icon'></Image></button>
            <button><Image src='/Assets/settingsIcon.svg' width={30} height={30} alt='Settings Icon'></Image></button>
            
        </div>
    )
}