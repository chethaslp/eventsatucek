"use client";

import { cn } from "@/lib/utils";
import { Teko } from "next/font/google";
import siteLogo from "../../public/logos/logo_white.png";
import siteText from "../../public/logos/logo_text.png";
import Image from "next/image";


const font = Teko({ subsets: ["latin"], weight: ["400"] });
export function Logo({
  className,
  loading,
  isNavbar,
}: {
  className: string;
  loading?: boolean;
  isNavbar?: boolean;
}) {
  return (
    <div className={cn(`flex items-center ${isNavbar ? 'flex-row' : 'flex-col'} `, className)}>
      <Image
        src={siteLogo}
        alt="logo"
        width={50}
        height={50}
        className={`rounded-full ${isNavbar ?  'w-15 h-15' : 'w-28 h-28' }`}
        loading={loading ? "eager" : "lazy"}/>
      <Image
        src={siteText}
        alt="logo"
        width={150}
        height={150}
        className={`${isNavbar ?  '' : 'pb-1' }`}
        loading={loading ? "eager" : "lazy"}/>
     
    </div>
  );
}
