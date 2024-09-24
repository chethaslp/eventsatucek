import { getImgLink } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import CountdownTimer from "@/components/ui/CountDown";
import { FaCalendarAlt } from "react-icons/fa";
import { IoCloudOfflineSharp, IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { BsClock } from "react-icons/bs";
import { ExternalLink } from "lucide-react";

function Bannner({
  bannerEvent,
  date,
}: {
  bannerEvent: Array<string>;
  date: any;
}) {
  return (
    <div className="w-full">
      <div
        className="relative min-h-[25rem] md:h-[50rem] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url(/_next/image?url=" +
            encodeURIComponent(getImgLink(bannerEvent[5])) +
            "&w=750&q=100)",
        }}
      >
        {/* Overlay for blur effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 md:bg-opacity-10 md:backdrop-blur-sm bg-gradient-to-t from-black to-transparent flex items-center justify-center"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center p-0 md:p-20 md:gap-24 h-full">
          <div className="hidden md:flex">
            <Image
              width={350}
              height={350}
              referrerPolicy={"no-referrer"}
              src={getImgLink(bannerEvent[5])}
              onClick={() => (window.location.href = "/e/" + bannerEvent[1])}
              className="rounded-[22px] w-[25rem] h-[25rem] cursor-pointer p-3 md:p-0 scale-100 hover:scale-105 transition duration-300 ease-in-out aspect-square"
              alt="Event Poster"
            ></Image>
          </div>
          <div className="max-w-full m-3 text-white hidden md:flex flex-col">
            <p className=" text-lg md:text-2xl break-words text-white mt-4 mb-2 dark:text-neutral-200">
              Coming Next
            </p>

            <p className="flex flex-col mb-3">
              <span className="font-bold text-xl md:text-3xl ">
                {bannerEvent[3]}
              </span>
              <small className="text-muted text-white">
                {bannerEvent[6]}
              </small>
            </p>
            <p className="flex items-center mb-1 text-sm md:text-base">
              <FaCalendarAlt className="mr-2" />
              {date?.format("dddd, Do MMM YYYY")} ({date?.fromNow()})
            </p>
            <p className="flex break-words items-center mb-1 text-sm md:text-base">
              <IoLocationSharp className="mr-2" />{" "}
              {bannerEvent[10] == "" ? "Will be updated." : bannerEvent[10]}
            </p>
            {bannerEvent[8] == "Online" ? (
              <p className="flex items-center mb-1 text-sm md:text-base">
                <IoIosCloud className="mr-2" /> Online
              </p>
            ) : (
              <p className="flex items-center mb-1 text-sm md:text-base">
                <IoCloudOfflineSharp className="mr-2" /> Offline{" "}
              </p>
            )}
            <p className="flex items-center mb-1 text-sm md:text-base">
              {" "}
              <BsClock className="mr-2" />
              {date?.format("h:mm a")}
            </p>
            {/* COUNTDOWN */}
            <div className="flex justify-center">
              <CountdownTimer bannerEvent={bannerEvent} date={date} />
            </div>

            {/* ACTION BUTTONS */}
            <div className="hidden md:flex flex-row gap-3 mt-5 justify-center">
              <Link href={"/e/" + bannerEvent[1]}>
                <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  View More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* This part is only for mobile view */}
      <div className="p-5 h-[16rem] bg-black -mt-4 md:hidden flex flex-col">
        <p className="flex flex-col mb-3">
          <div className="flex justify-between">
            <span className="font-bold text-2xl md:text-3xl ">
              {bannerEvent[3]}
            </span>
            <Link href={"/e/" + bannerEvent[1]} className="md:hidden flex">
              <ExternalLink color="white" size={17} />
            </Link>
          </div>
          <small className="text-muted text-white">{bannerEvent[6]}</small>
        </p>
        <p className="flex items-center mb-1 text-sm md:text-base">
          <FaCalendarAlt className="mr-2" />
          {date?.format("dddd, Do MMM YYYY")} ({date?.fromNow()})
        </p>
        <p className="flex break-words items-center mb-1 text-sm md:text-base">
          <IoLocationSharp className="mr-2" />{" "}
          {bannerEvent[10] == "" ? "Will be updated." : bannerEvent[10]}
        </p>
        {bannerEvent[8] == "Online" ? (
          <p className="flex items-center mb-1 text-sm md:text-base">
            <IoIosCloud className="mr-2" /> Online
          </p>
        ) : (
          <p className="flex items-center mb-1 text-sm md:text-base">
            <IoCloudOfflineSharp className="mr-2" /> Offline{" "}
          </p>
        )}
        <p className="flex items-center mb-1 text-sm md:text-base">
          {" "}
          <BsClock className="mr-2" />
          {date?.format("h:mm a")}
        </p>
        {/* COUNTDOWN */}
        <div className="flex justify-center">
          <CountdownTimer bannerEvent={bannerEvent} date={date} />
        </div>
      </div>
    </div>
  );
}

export default Bannner;
