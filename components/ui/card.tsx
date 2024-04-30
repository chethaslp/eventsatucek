import React from "react";
import { resolveClubIcon, formatDateArray } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import Image from "next/image";

const Card = ({
  title,
  header,
  date,
  isOnline,
  venue,
  club,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  date?: string;
  isOnline?: boolean;
  venue?: string;
  club: string;
}) => {
  const dt = formatDateArray(date);
  const clubIcon = resolveClubIcon(club, false);

  return (
    <div className="shadow-md hover:shadow-sm shadow-black cursor-pointer group rounded-xl overflow-hidden relative bg-black w-[10rem] h-[10rem] sm:w-[25rem] sm:h-[25rem] md:w-[25rem] md:h-[25rem] transition duration-300 ease-in-out ">
      {header}
      <div className="text-white w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16  absolute top-0 m-3 flex flex-col  group-hover:opacity-0 opacity-100 transition duration-300 ease-in-out">
        <Image className="rounded-full" src={clubIcon} alt={club + "logo"} />
      </div>
      <div className="text-white w-full absolute bottom-0 sm:top-[275px]  md:top-[287px] flex flex-col p-3  group-hover:opacity-50 opacity-100 transition duration-300 ease-in-out">
        <div className="flex flex-row w-full items-center">
          <div className="bg-[#8f90918c] shadow-md font-semibold mr-4 text-white text-[10px] sm:text-[14px] md:text-[16px] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg text-center">
            {dt.month} <br />
            {dt.day}
          </div>
          <div className="flex flex-col gap-1 text-[8px] sm:text-[14px] md:text-[16px]">
            <div className="font-semibold line-clamp-1">{title}</div>
            <div className="flex items-center gap-1">
              <BsClock /> {dt.from_time}
            </div>
              </div>
            <div className="absolute right-8 md:right-6 text-[8px] sm:text-xl md:text-2xl">
              {isOnline ? (
                <IoIosCloud  />
              ) : (
                <IoCloudOfflineSharp />
              )}
            </div>
        </div>
        <div className="line-clamp-1"></div>
        <div className="flex flex-row mt-2 items-center">
          <IoLocationSharp className="mr-2 text-sm md:text-xl" />
          <p className="text-[8px] sm:text-[13px] md:text-[16px] line-clamp-1">
            {venue == "" ? "TBA" : venue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
