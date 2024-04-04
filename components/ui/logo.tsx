"use client"

import { Teko } from 'next/font/google'

const font = Teko({ subsets: ['latin'], weight: ['400']})
export function Logo({size} : {size:string}){
    return <div className={`${font.className} text-6xl`}>events@UCEK</div>
}
