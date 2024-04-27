"use client";

import React, { useEffect, useState } from "react";
import { getImgLink, getEvent, getClubEvents } from "@/lib/data";
import Loading from "@/app/loading";
import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import { formatDateArray, resolveClubIcon } from "@/lib/utils";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";
import { useTheme } from 'next-themes';

function Page({ params }: { params: { id: string } }) {
  const { theme } = useTheme();

  const themeToDark  = theme == 'dark' ? false : true 
  const [data, setData] = useState<string[]>([]);
  const [past, setPast] = useState(false);
  const [moreEvents, setMoreEvents] = useState<string[][]>([]);
  let date = data[0] ? formatDateArray(data[7]) : null, clubIcon = data ? resolveClubIcon(data[6], themeToDark) : null;

  useEffect(() => {
    getEvent(params.id)
      .then((evnt) => {
        setData(evnt[0]);
        date = data ? formatDateArray(data[7]) : null
        clubIcon = data ? resolveClubIcon(data[6], themeToDark) : null;
        
        console.log(((new Date(date.date) as any) - (new Date() as any)))
        if(((new Date(date.date) as any) - (new Date() as any)) > 0 ) setPast(true);

        getClubEvents(data[0] ? data[0][6] : "nill")
        .then((upcomingEvents) => {
          setMoreEvents(upcomingEvents);
        })
    .catch((error) => {
      console.error(error);
    });
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);



  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="flex flex-col dark:bg-[#121212] min-h-[50rem] ">
      <Navbar />
      <div className="flex min-h-screen justify-center  mb-8 px-5 md:px-20">
        <div className="h-fit flex md:m-3 flex-col md:flex-row min:w-[22rem] md:w-auto overflow-hidden  md:!shadow-black md:shadow-md rounded-xl dark:bg-[#0c0c0c]">
          <Image
            width={500}
            height={500}
            referrerPolicy={"no-referrer"}
            src={getImgLink(data[5])}
            alt="Event Poster"
          ></Image>

          <div className="p-9">
            <div className="flex justify-between items-center">
              <p className=" font-bold mb-1 text-2xl md:text-3xl">
                {data[3]}
              </p>
              <Image
              className="rounded-full w-12 md:w-20"
              referrerPolicy={"no-referrer"}
              src={clubIcon}
              alt="Club Icon"
              >
              </Image>
            </div>
            <div className="text-sm md:text-[15px]">
              <p className="flex items-center mb-1 ">
                <FaCalendarAlt className="mr-2 text-sm md:text-[]" />
                {date.dayOfWeek}, {date.day}&nbsp;{date.month}&nbsp;{date.year}
              </p>
              <p className="flex items-center mb-1">
                <IoLocationSharp className="mr-2 text-sm md:text-[]" />{" "}
                {data[10] == "" ? "Will be Updated." : data[10]}
              </p>
              {data[8] == "Online" ? (
                <p className="flex items-center mb-1">
                  <IoIosCloud className="mr-2 text-sm md:text-[]" /> Online
                </p>
              ) : (
                <p className="flex items-center mb-1">
                  <IoCloudOfflineSharp className="mr-2 text-sm md:text-[]" />{" "}
                  Offline{" "}
                </p>
              )}
              <p className="flex items-center mb-1">
                {" "}
                <BsClock className="mr-2 text-sm md:text-[]" /> {date.from_time}
                &nbsp; - &nbsp; 17:00 pm
              </p>
              <h4 className="my-2 font-semibold">About</h4>
              <p>{data[4]}</p>
            </div>
            {(past)?null:
            <div className="justify-center flex items-center mt-5">
              <Link href={data[9]} target="_blank">
                <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  RVSP Now!
                </button>
              </Link>
            </div>}
          </div>
        </div>
      </div>
        <div className="flex justify-center flex-col items-center">
      {moreEvents.length >1 ? (<>
          <h1 className="text-3xl font-semibold mt-14 mb-6">More Events from {data ? data[6] : null}</h1>
          <CardGrid>
            {moreEvents.map((evnt, i) => (
              <Link key={evnt[1]} href={`/event/${evnt[1]}`}>
                <Card
                  key={evnt[1]}
                  title={evnt[3]}
                  description={evnt[4]}
                  club={resolveClubIcon(evnt[6], false)}
                  header={
                    <Image
                      width={500}
                      height={500}
                      referrerPolicy={"no-referrer"}
                      src={getImgLink(evnt[5])}
                      alt="Event Poster"
                      className="opacity-50 group-hover:opacity-100 transition duration-300 ease-in-out"
                    ></Image>
                  }
                  icon={evnt[7]}
                  isOnline={evnt[8] == "Online" ? true : false}
                  venue={evnt[10]}
                />
              </Link>
            ))}
          </CardGrid></>
      ) : <>
      {/* TODO: ADD SHIMMER CARDS HERE */}
      </>}
        </div>
      <Footer  />
    </div>
  );
}

export default Page;
