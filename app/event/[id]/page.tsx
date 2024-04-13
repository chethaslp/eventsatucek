"use client";

import React, { useEffect, useState } from "react";
import { getImgLink, getEvent } from "@/lib/data";
import Loading from "@/app/loading";
import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import { formatDateArray,resolveClubIcon } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="flex flex-col dark:bg-[#121212] min-h-[50rem] ">
      <Navbar />
      <div className="flex justify-center  mb-8 md:px-20">
        <div className="h-fit md:flex md:m-3 md:flex-row w-[22rem] md:w-auto overflow-hidden !shadow-black shadow-md rounded-xl dark:bg-[#0c0c0c]">
          <Image
            width={500}
            height={500}
            referrerPolicy={"no-referrer"}
            src={getImgLink(result[5])} 
            alt="Event Poster"
          ></Image>

          <div className="p-9">
            <div className="flex justify-between ">
            <p className=" font-bold mb-1 text-2xl md:text-3xl">{result[3]}</p>
            </div>
            <div className="text-sm md:text-[15px]">

            <p className="flex items-center mb-1 ">
              <FaCalendarAlt className="mr-2 text-sm md:text-[]" />
              {date.dayOfWeek}, {date.day}&nbsp;{date.month}&nbsp;{date.year}
            </p>
            <p className="flex items-center mb-1">
              <IoLocationSharp className="mr-2 text-sm md:text-[]" /> {result[10]==""? "Will be Updated.": result[10]}
            </p>
            {result[8] == "Online" ? (
              <p className="flex items-center mb-1">
                <IoIosCloud className="mr-2 text-sm md:text-[]" /> Online
              </p>
            ) : (
              <p className="flex items-center mb-1">
                <IoCloudOfflineSharp className="mr-2 text-sm md:text-[]" /> Offline{" "}
              </p>
            )}
            <p className="flex items-center mb-1">
              {" "}
              <BsClock className="mr-2 text-sm md:text-[]" /> {date.from_time}&nbsp; - &nbsp; 17:00
              pm
            </p>
            <h4 className="my-2 font-semibold">About</h4>
            <p>{result[4]}</p>
            </div>

            <div className="justify-center flex items-center mt-5">
            <Link href={result[9]} target="_blank">
                <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">RVSP Now!</button>
            </Link>
            
            </div>
          </div>
        </div>
      </div>
        <Footer/>
    </div>
  );
}

export default Page;
