"use client";

import React, { useEffect, useState } from "react";
import { getImgLink, getEvent } from "@/lib/data";
import Loading from "@/app/loading";
import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import { formatDateArray,resolveClubIcon } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { RiWifiOffLine } from "react-icons/ri";
import { IoWifiOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";

function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    getEvent(params.id)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  let result = data[1];

  const date = result ? formatDateArray(result[7]) : null;
   const clubIcon = result ?  resolveClubIcon(result[6]): null;
  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="flex flex-col dark:bg-[#121212] min-h-[50rem]">
      <Navbar />
      <div className="flex justify-center mb-8 ">
        <div className="h-fit w-[30rem] overflow-hidden !shadow-black sm:shadow-md rounded-xl dark:bg-[#0c0c0c]">
          <Image
            width={500}
            height={500}
            referrerPolicy={"no-referrer"}
            src={getImgLink(result[5])}
            alt="Event Poster"
          ></Image>

          <div className="p-9">
            <div className="flex justify-between ">
            <p className="text-4xl font-bold mb-1">{result[3]}</p>
            </div>
            <p className="flex items-center mb-1 ">
              <FaCalendarAlt className="mr-2" />
              {date.dayOfWeek}, {date.day}&nbsp;{date.month}&nbsp;{date.year}
            </p>
            <p className="flex items-center mb-1">
              <IoLocationSharp className="mr-2" /> {result[10]==""? "Will be Updated.": result[10]}
            </p>
            {result[8] == "Online" ? (
              <p className="flex items-center mb-1">
                <IoWifiOutline className="mr-2" /> Online
              </p>
            ) : (
              <p className="flex items-center mb-1">
                <RiWifiOffLine className="mr-2" /> Offline{" "}
              </p>
            )}
            <p className="flex items-center mb-1">
              {" "}
              <BsClock className="mr-2" /> {date.from_time}&nbsp; - &nbsp; 17:00
              pm
            </p>
            <p>{result[4]}</p>
            <div className="justify-center flex bg-black text-white items-center h-9 rounded-md w-40 mt-3">
              <a href={result[9]}>Register Now</a>
            </div>
          </div>
        </div>
      </div>
        
    </div>
  );
}

export default Page;
