import { GITHUB_URL } from '@/lib/utils'
import { Navbar } from "@/components/ui/navbar";
import React from "react";
import { MdUpcoming } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";
function NoEvents() {
    const today = new Date()
    const year = today.getFullYear()
  return (
    <div className="h-full">
      <Navbar />
      <div className="justify-center gap-2 flex items-center h-[26rem] md:h-[30rem] flex-col">
        <div className="flex gap-2 items-center">
          <p>New Events Coming soon</p>
          <MdUpcoming />
        </div>
        <div className="flex items-center">
          Checkout our &nbsp;{" "}
          <Link className="flex underline items-center" href={"/event/past"}>
            Past Events
            <GoLinkExternal size={15} />
          </Link>
        </div>
      </div>

      <div className='bottom-0 absolute w-full h-20 flex text-[10px] md:text-[15px] items-center justify-center flex-col dark:bg-[#0a0a0a] '>
         <span>© {year} - Events@UCEK</span>
         <div className='flex md:hidden gap-2'>
            <Link href={GITHUB_URL}>Github</Link>
             ●
            <Link href={"/contributors"}>Contributors</Link>
         </div>
         <span>An Initiative by IEEE SB UCEK.</span>
    </div>
    </div>
  );
}

export default NoEvents;
