import React from "react";
import { resolveClubIcon, formatDateArray } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { RiWifiOffLine } from "react-icons/ri";
import { IoWifiOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import Image from "next/image";

const Card = ({
  title,
  header,
  icon,
  isOnline,
  venue,
  club
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: string;
  isOnline?: boolean,
  venue?:string
  club:string
}) => {
  const date = formatDateArray(icon);
  const clubIcon = resolveClubIcon(club)
  return (
    <div className="shadow-md hover:shadow-sm shadow-black cursor-pointer group rounded-xl overflow-hidden relative bg-black w-[18rem] h-[18rem] md:w-[25rem] md:h-[25rem] transition duration-300 ease-in-out ">
      {header}
      <div className="text-white w-14 h-14 md:w-20 md:h-20 absolute top-[1px] m-1 flex flex-col  group-hover:opacity-0 opacity-100 transition duration-300 ease-in-out">
        <Image src={clubIcon} alt={club+"logo"}/>
      </div>
      <div className="text-white w-full absolute top-[168px]  md:top-[270px] p-3 flex flex-col m-3 md:m-5 group-hover:opacity-0 opacity-100 transition duration-300 ease-in-out">
        <div className="flex flex-row w-full items-center">
          <div className="bg-[#8f90918c] shadow-md font-semibold mr-4 text-white text-[14px] md:text-[16px] w-10 h-10 md:w-12 md:h-12 rounded-lg text-center">
            {date.month} <br />
            {date.day}
          </div>
          <div className=" flex flex-col gap-1 text-[14px] md:text-[16px]">
            <div className="font-semibold ">
            {title}
            </div>
            <div className="flex items-center gap-1">
            <BsClock/> {date.from_time}
            </div>
          </div>

          {isOnline ?  <IoWifiOutline className="absolute right-8 md:right-12 text-lg md:text-2xl"  /> : <RiWifiOffLine  className="absolute right-8 md:right-12 text-lg md:text-2xl" /> }
            
        </div>
        <div className="flex flex-row mt-2 items-center">
          <IoLocationSharp className="mr-2 text-sm md:text-xl" />
          <p className="text-[13px] md:text-[16px]">{(venue == "")? "TBA" : venue}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
