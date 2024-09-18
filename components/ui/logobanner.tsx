import { getImgLink } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import CountdownTimer from "@/components/ui/CountDown";
import { FaCalendarAlt } from "react-icons/fa";
import { IoCloudOfflineSharp, IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { BsClock } from "react-icons/bs";
import { Logo } from "./logo";
import { useAuthContext } from "../context/auth";

function LogoBanner() {
  const user = useAuthContext();

  return (
    <div className="relative h-[30rem]  bg-cover bg-center overflow-hidden logo-banner prevent-select">
      {/* Overlay for blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-0 md:bg-opacity-10 md: bg-gradient-to-t from-black to-transparent flex items-center justify-center"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-col items-center justify-center h-full">
        {user ? (
          <>
          <h1 className="text-2xl">Hello👋</h1>
          <p className="text-3xl md:text-5xl font-bold"> {user?.displayName} !</p>
          </>
        ) : (
          <>
          <h1 className="text-2xl">Welcome to</h1>
          <Logo className="text-5xl md:text-9xl" />
          </>
        )}
      </div>
    </div>
  );
}

export default LogoBanner;
