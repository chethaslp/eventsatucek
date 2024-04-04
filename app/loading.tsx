"use client"
import { Logo } from '@/components/ui/logo';
import { Loader2 } from "lucide-react";
import { Pixelify_Sans } from 'next/font/google'

const font = Pixelify_Sans({ subsets: ['latin'], weight: ['400']})
export default function Loading({msg}:{msg: string}) {
    return (
        <div className={`flex gap-3  h-screen w-screen flex-col z-50`}>
            <div className="flex justify-center items-center h-full w-full animate-pulse transition-all drop-shadow-xl">
                <Logo size={"6xl"}/>
            </div> 
            <div className="flex justify-center items-center mb-10 flex-row gap-2 text-secondary-foreground text-center">
                <Loader2 size={20} className="animate-spin"/>
                <small className={font.className}>{msg}</small>
            </div>
        </div>
    )
  }

  