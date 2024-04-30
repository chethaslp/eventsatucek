"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import Card from "@/components/ui/card";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/Loading";
import CardGrid from "@/components/ui/CardGrid";
import { Navbar } from "@/components/ui/navbar";
import ShareButton from "@/components/ui/ShareButton";

import { BsClock } from "react-icons/bs";
import { IoIosCloud } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { getImgLink, getEvent, getMoreClubEvents } from "@/lib/data";
import { formatDateArray, resolveClubIcon } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Page({ params }: { params: { id: string } }) {
  const { theme } = useTheme();

  const themeToDark = theme == "dark" ? false : true;
  const [data, setData] = useState<string[]>([]);
  const [past, setPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreEvents, setMoreEvents] = useState<string[][]>([]);

  let date = data[0] ? formatDateArray(data[7]) : null,
    clubIcon = data ? resolveClubIcon(data[6], themeToDark) : null;

  useEffect(() => {
    getEvent(params.id)
      .then((evnt) => {
        setData(evnt[0]);
        date = data ? formatDateArray(data[7]) : null;
        clubIcon = data ? resolveClubIcon(data[6], themeToDark) : null;
        if ((new Date(date.date) as any) - (new Date() as any) > 0)
          setPast(true);
        return 1;
      })
      
  }, []);

  useEffect(() => {
    getMoreClubEvents(data[6] ? data[6] : "nill", params.id)
    .then((upcomingEvents) => {
      setMoreEvents(upcomingEvents);
      setLoading(false);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }, [data]);

  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="flex flex-col dark:bg-[#121212] min-h-[50rem] ">
      <Navbar />
      <div className="flex-1  justify-center px-5 md:px-20">
        <div className="h-fit flex md:m-3 flex-col md:flex-row min:w-[22rem] md:w-auto overflow-hidden  md:!shadow-black md:shadow-md rounded-xl dark:bg-[#0c0c0c]">
          <div className="absolute group z-10 w-10 hover:w-24 flex p-2 m-3 bg-white rounded-full text-black  shadow-sm shadow-black transition-width duration-300 ease-in-out">
            <IoShareSocialSharp className="w-5 h-5 group-hover:fixed " />
            <div className="group-hover:flex  hidden ml-5  ">
              <ShareButton
                date={date}
                title={data[3]}
                location={data[10]}
                type={data[8]}
                about={data[4]}
                img={getImgLink(data[5])}
              />
            </div>
          </div>
          <Image
            width={500}
            height={500}
            referrerPolicy={"no-referrer"}
            src={getImgLink(data[5])}
            alt="Event Poster"
          ></Image>

          <div className="p-9">
            <div className="flex justify-between items-center">
              <p className=" font-bold mb-1 text-2xl md:text-3xl">{data[3]}</p>
              <Image
                className="rounded-full w-12 md:w-20"
                referrerPolicy={"no-referrer"}
                src={clubIcon}
                alt="Club Icon"
              ></Image>
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
              </p>
              <h4 className="my-2 font-semibold">About</h4>
              <p>{data[4]}</p>
            </div>

            {!past && data[9] ? (
              <div className="justify-center flex items-center mt-5">
                <Link href={data[9]} target="_blank">
                  <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    RVSP Now!
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center ">
        {!loading ? (
          moreEvents.length > 0 ? (
            <>
              <h1 className="text-lg md:text-3xl font-semibold mt-10 mb-8 p-3">
                Upcoming Events from {data ? data[6] : null}
              </h1>
              <CardGrid>
                {moreEvents.map((evnt, i) => (
                  <Link key={evnt[1]} href={`/event/${evnt[1]}`}>
                    <Card
                      key={evnt[1]}
                      title={evnt[3]}
                      description={evnt[4]}
                      club={evnt[6]}
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
                      date={evnt[7]}
                      isOnline={evnt[8] == "Online" ? true : false}
                      venue={evnt[10]}
                    />
                  </Link>
                ))}
              </CardGrid>
            </>
          ) : null
        ) : (
          <div className="flex justify-center items-center p-5">
            {" "}
            <Loader2 size={30} className="animate-spin" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Page;