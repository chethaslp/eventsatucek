"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/banner";

import { getUpcomingEvents } from "@/lib/data";
import { formatDateArray } from "@/lib/utils";
import Loading from "./loading";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { RiWifiOffLine } from "react-icons/ri";
import { IoWifiOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";

function getImgLink(link: string) {
  return (
    "https://drive.google.com/uc?export=download&id=" +
    link.replace("https://drive.google.com/open?id=", "")
  );
}

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<string[]>([]);
  let date;

  useEffect(() => {
    getUpcomingEvents()
      .then((data) => {
        setData(data);
        console.log(data[1])
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="">
      <Navbar />
      <div className="flex flex-col w-full h-full p-5 items-center mb-5">
        <BackgroundGradient className="rounded-[22px] w-full p-2 sm:p-6 bg-white dark:bg-zinc-900" containerClassName="m-5 md:w-[70%] w-[95%]">
        
        <div className="flex flex-col-reverse  md:flex-row items-center gap-4 justify-around">
          
          <div>
            <p className="text-2xl text-black mt-4 mb-2 dark:text-neutral-200">
                Next Event
            </p>
            <p className="text-3xl font-bold mb-1">{data[1][3]}</p>
              <p className="flex items-center mb-1 ">
                <FaCalendarAlt className="mr-2" />
                {(()=>{date = data[1] ? formatDateArray(data[1][7]) : null})()}
                {date.dayOfWeek}, {date.day}&nbsp;{date.month}&nbsp;{date.year}
              </p>
              <p className="flex items-center mb-1">
                <IoLocationSharp className="mr-2" /> {(data[1][10]=="")? "Will be updated." : data[1][9] }
              </p>
              {data[1][8] == "Online" ? (
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
                <BsClock className="mr-2" />at {date.from_time}
              </p>
              <div className="flex flex-row gap-3 mt-5 mb-4">
                <Link href={"/event/"+data[1][1]}><Button className="hover:scale-105 transition-all" variant={'secondary'}>View More</Button></Link>
                <Link href={data[1][9]} target="_blank"><Button className="hover:scale-105 transition-all">Register Now</Button></Link>
              </div>
          </div>
          <div>
            <Image
              width={300}
              height={300}
              referrerPolicy={"no-referrer"}
              src={getImgLink(data[1][5])}
              onClick={()=>window.location.href = "/event/"+data[1][1]}
              className="rounded-[22px] transition-transform cursor-pointer scale-100 hover:scale-105"
              alt="Event Poster"
            ></Image>
          </div>
        </div>
        </BackgroundGradient>
        <div className="m-7">
          <p className="text-3xl">Upcoming Events</p>
        </div>
        <CardGrid>
          {data.map((evnt, i) => (
            <Link key={evnt[1]} href={`/event/${evnt[1]}`}>
              <Card
                key={evnt[1]}
                title={evnt[3]}
                description={evnt[4]}
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
        </CardGrid>
      </div>
    </div>
  );
}
