import React from "react";
import { resolveClubIcon } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import Image from "next/image";
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";

function Card({
  id,
  title,
  img,
  date,
  isOnline,
  venue,
  club,
}: {
  id?: string;
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: React.ReactNode;
  date?: string;
  isOnline?: boolean;
  venue?: string;
  club: string;
}) {
  const dt = moment(date, "DD/MM/YYYY HH:mm:s");
  const clubIcon = resolveClubIcon(club, false);

  return (
    <div className="px-5 py-5 bg-[#0c0c0c] rounded-lg flex gap-7 md:flex-row flex-col">
      <div className="md:w-[20rem] md:h-[20rem] w-[15rem] h-[15rem]">{img}</div>
      <div className="text-white text-left w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="md:text-3xl text-lg font-semibold">{title}</h1>
            <p className="md:text-base text-[10px] text-muted mb-3 text-gray-300">
              {club}
            </p>
          </div>
          <Image
            className="rounded-full w-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
            src={clubIcon}
            alt={club + "logo"}
          />
        </div>
        <p className="flex items-center mb-1 text-[10px] md:text-base">
          <FaCalendarAlt className="mr-2" />
          {dt?.format("dddd, Do MMM YYYY")} ({dt?.fromNow()})
        </p>
        <p className="flex break-words items-center mb-1 text-[10px] md:text-base">
          <IoLocationSharp className="mr-2" />{" "}
          {venue == "" ? "Will be updated." : venue}
        </p>
        {isOnline ? (
          <p className="flex items-center mb-1 text-[10px] md:text-base">
            <IoIosCloud className="mr-2" /> Online
          </p>
        ) : (
          <p className="flex items-center mb-1 text-[10px] md:text-base">
            <IoCloudOfflineSharp className="mr-2" /> Offline{" "}
          </p>
        )}
        <p className="flex items-center mb-1 text-[10px] md:text-base">
          {" "}
          <BsClock className="mr-2" />
          {dt?.format("h:mm a")}
        </p>
        <div className="hidden md:flex flex-row gap-3 mt-1">
          <Link href={"/e/" + id}>
            <button className="inline-flex hover:scale-105 transition-all scale-100 h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              View More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
