"use client"
import { Logo } from '@/components/ui/logo';
import { Separator } from '@/components/ui/separator';
import { Link2Off, Loader2 } from "lucide-react";
import { Bebas_Neue } from 'next/font/google'

const font = Bebas_Neue({ subsets: ['latin'], weight: ['400']})

export default function NotFound({p}:{p: string}) {
    return (
        <div className={`flex gap-3  h-screen w-screen flex-col z-50`}>
            <div className={`${font.className} flex gap-4 text-4xl justify-center items-center h-full w-full drop-shadow-xl`}>
                <Link2Off size={40}/> <span className='text-muted'>|</span> Not Found
            </div> 
            <div className="flex justify-center cursor-pointer items-center mb-10 flex-row gap-2 text-secondary-foreground text-center">
                <a href='/' className='hover:scale-105 hover:underline transition-all'><small>Go Back</small></a>
            </div>
        </div>
    )
  }

  