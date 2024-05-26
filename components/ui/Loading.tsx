"use client"
import { Logo } from '@/components/ui/logo';
import { Loader2 } from "lucide-react";


export default function Loading({msg}:{msg: string}) {
    return (
        <div className="flex gap-3  h-screen w-screen flex-col z-50 dark:bg-[#121212]">
            <div className="flex justify-center items-center h-full w-full animate-pulse transition-all drop-shadow-xl">
                <Logo className={"text-4xl md:text-6xl"} loading={true}/>
            </div> 
            <div className="flex justify-center items-center mb-10 flex-row gap-2 text-secondary-foreground text-center">
                <Loader2 size={20} className="animate-spin"/>
                <small>{msg}</small>
            </div>
        </div>
    )
  }

  