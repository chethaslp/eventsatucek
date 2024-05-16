"use client"

import { cn } from '@/lib/utils'
import { Teko } from 'next/font/google'

const font = Teko({ subsets: ['latin'], weight: ['400']})
export function Logo({className}:{className : string}){
    return <div className={cn(font.className, "text-3xl md:text-5xl", className)}>events@UCEK</div>
}
