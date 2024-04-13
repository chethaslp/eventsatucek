"use client"

import { Teko } from 'next/font/google'

const font = Teko({ subsets: ['latin'], weight: ['400']})
export function Logo({size} : {size:string}){
    return <div className={`${font.className} text-3xl md:text-5xl`}>events@UCEK</div>
}
