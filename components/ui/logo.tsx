"use client"

import { cn } from '@/lib/utils'
import { Teko } from 'next/font/google'
import siteLogo from "../../public/logos/logo.png";
import Image from 'next/image';

const font = Teko({ subsets: ['latin'], weight: ['400']})
export function Logo({className}:{className : string}){
    return <div className={cn(font.className, "text-3xl md:text-5xl flex items-center flex-row", className)}>
        events<Image src={siteLogo} width={40} height={40} alt='logo'/>ucek
    </div>
}
