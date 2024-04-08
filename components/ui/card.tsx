import React from "react";
import { cn, formatDateArray } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { RiWifiOffLine } from "react-icons/ri";
import { IoWifiOutline } from "react-icons/io5";
const Card = ({
  title,
  header,
  icon,
  isOnline
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: string;
  isOnline?: boolean
}) => {
  const date = formatDateArray(icon);
  
  return (
    <div className="shadow-lg hover:shadow-sm shadow-black cursor-pointer group rounded-xl overflow-hidden relative bg-black w-[25rem] h-[25rem] transition duration-300 ease-in-out ">
      {header}
      <div className="text-white w-full absolute top-[270px] p-3 flex flex-col m-5 group-hover:opacity-0 opacity-100 transition duration-300 ease-in-out">
        <div className="flex flex-row w-full items-center">
          <div className="bg-[#8f90918c] shadow-md font-semibold mr-4 text-white w-12 h-12 rounded-lg text-center">
            {date.month} <br />
            {date.day}
          </div>
          <div className=" flex flex-col" >
            <div className="font-semibold">
            {title}
            </div>
            <div>
            {date.from_time} 
            &nbsp;-&nbsp;
            17:00 pm
            </div>
          </div>

          {isOnline ?  <IoWifiOutline size={22} className="absolute right-12"  /> : <RiWifiOffLine size={22} className="absolute right-12" /> }
            
        </div>
        <div className="flex flex-row mt-2 items-center">
          <IoLocationSharp className="mr-2" />
          <p>UCEK</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
