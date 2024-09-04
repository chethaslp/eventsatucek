"use client";

import { cn } from "@/lib/utils";
import { Teko } from "next/font/google";
import siteLogo from "../../public/logo.png";
import Image from "next/image";

const font = Teko({ subsets: ["latin"], weight: ["400"] });
export function Logo({
  className,
  loading,
}: {
  className: string;
  loading?: boolean;
}) {
  return (
    <div className={cn("flex items-center flex-col", className)}>
      <h1 className={`${font.className} text-3xl md:text-5xl`}>events@uck</h1>
    </div>
  );
}
