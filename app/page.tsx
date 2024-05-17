"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import Card from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/banner";
import Footer from "@/components/ui/Footer";

import { getImgLink, getUpcomingEvents, getClubs, filterEvents } from "@/lib/data";
import Loading from "../components/ui/Loading";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Urbanist } from "next/font/google";

import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { LuFilter } from "react-icons/lu";


import NoEvents from "./NoEvents";
import FCM from "@/components/ui/fcm";
import moment from "moment";
import CountdownTimer from "@/components/ui/CountDown";

const font = Urbanist({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const clubDropdownButton: any = useRef(null);
  const typeDropdownButton: any = useRef(null);
  const timeDropdownButton: any = useRef(null);

  const [data, setData] = useState<Array<string[]>>([]);
  const [loading, setLoading] = useState(true);

  const [clubDropdown, setClubDropdown]: any = useState("All Clubs");
  const [timeDropdown, setTimeDropdown]: any = useState("Upcoming");
  const [typeDropdown, setTypeDropdown]: any = useState("Both");
  const [date, setDate] = useState<moment.Moment>();
  const [bannerEvent, setBannerEvent] = useState<string[]>(["","","","","","","","",""]);

  useEffect(() => {
    getUpcomingEvents()
      .then((data) => {
        if(data.length <=1){
          setTimeDropdown("Past");
          filterEvents(clubDropdown, typeDropdown, "Past").then((evnts) => setData(evnts));
        }
        setData(data);
        const upcomingEvent = data.shift() || [""]; // Remove and return the first event from data
        setBannerEvent(upcomingEvent);
        setDate(moment(upcomingEvent[7],"DD/MM/YYYY HH:mm:ss"))
        console.log(date)
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);


  function clubDropdownHandle(club: string): any {
    clubDropdownButton.current.click();
    if (club != clubDropdown) {
      setClubDropdown(club);
      filterEvents(club, typeDropdown, timeDropdown).then((evnts) => setData(evnts));
    }
  }
  function typeDropdownHandle(type: string): any {
    typeDropdownButton.current.click();
    if (type != typeDropdown) {
      setTypeDropdown(type);
      filterEvents(clubDropdown, type, timeDropdown).then((evnts) => setData(evnts));
    }
  }
  function timeDropdownHandle(time: string): any {
    timeDropdownButton.current.click();
    if (time != timeDropdown) {
      setTimeDropdown(time);
      filterEvents(clubDropdown, typeDropdown, time).then((evnts) => setData(evnts));
    }
  }


  // If there is no events in data
  if (data.length == 0 && !loading && bannerEvent.length == 0) {
    return <NoEvents />;
  }

  return loading ? (
    <Loading msg="Loading..." />
  ) : (
    <>
      <div className="">
        <FCM/>
        <Navbar />
        <div className="flex flex-col w-full h-full p-1 md:p-5 items-center dark:bg-[#121212]">
          <BackgroundGradient
            className="rounded-[22px] w-full p-2 sm:p-6 bg-white dark:bg-zinc-900"
            containerClassName="m-5 md:w-[70%] w-[95%]"
          >
            <div className="flex flex-col-reverse  md:flex-row items-center gap-4 justify-around">
              <div className="max-w-full m-3">
                <p className="text-lg md:text-2xl break-words text-black mt-4 mb-2 dark:text-neutral-200">
                  Next Event
                </p>

                <p className="flex flex-col mb-3"> 
                  <span className="font-bold text-xl md:text-3xl">{bannerEvent[3]}</span>
                  <small className="text-muted-foreground">{bannerEvent[6]}</small>
                </p>
                <p className="flex items-center mb-1 ">
                  <FaCalendarAlt className="mr-2" />
                  {date?.format("dddd, Do MMM YYYY")} ({date?.fromNow()})
                </p>
                <p className="flex break-words items-center mb-1">
                  <IoLocationSharp className="mr-2" />{" "}
                  {bannerEvent[10] == "" ? "Will be updated." : bannerEvent[10]}
                </p>
                {bannerEvent[8] == "Online" ? (
                  <p className="flex items-center mb-1">
                    <IoIosCloud className="mr-2" /> Online
                  </p>
                ) : (
                  <p className="flex items-center mb-1">
                    <IoCloudOfflineSharp className="mr-2" /> Offline{" "}
                  </p>
                )}
                <p className="flex items-center mb-1">
                  {" "}
                  <BsClock className="mr-2" />
                  {date?.format("h:mm a")}
                </p>
                {/* COUNTDOWN */}
                      <CountdownTimer bannerEvent={bannerEvent} date={date}/>
                {/* ACTION BUTTONS */}
                <div className="flex flex-row gap-3 mb-4 mt-4 justify-center md:gap-5">
                  <Link href={"/event/" + bannerEvent[1]}>
                    <Button
                      className="hover:scale-105 transition-all h-12"
                      variant={"secondary"}
                    >
                      View More
                    </Button>
                  </Link>
                  <Link
                    href={"/event/" + bannerEvent[1] + "?rsvp"}
                    className={bannerEvent[9] ? "" : "hidden"}
                  >
                    <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      RSVP Now!
                    </button>
                  </Link>
                </div>
              </div>
              <div>
                <Image
                  width={350}
                  height={350}
                  referrerPolicy={"no-referrer"}
                  src={getImgLink(bannerEvent[5])}
                  onClick={() =>
                    (window.location.href = "/event/" + bannerEvent[1])
                  }
                  className="rounded-[22px] cursor-pointer scale-100 hover:scale-105 transition duration-300 ease-in-out"
                  alt="Event Poster"
                ></Image>
              </div>
            </div>
          </BackgroundGradient>
          <div
            className={` my-7 mt-7  mb-28 justify-center  flex md:flex-row`}
          >
            <p className="text-3xl">{timeDropdown} Events</p>
            <div className="md:left-28 z-30 absolute md:my-7 my-12 text-xs md:text-lg pt-6">
              <div className="flex flex-row items-center gap-1 md:gap-2">
                <LuFilter size={25} /> Filter
                <details className="dropdown">
                  <summary
                    className="m-1 btn bg-transparent border-1"
                    ref={clubDropdownButton}
                  >
                    {clubDropdown}
                  </summary>
                  <ul
                    className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52`}
                  >
                    {getClubs.map((club, idx) => (
                      <li key={idx}>
                        <a onClick={() => clubDropdownHandle(club)}>{club}</a>
                      </li>
                    ))}
                  </ul>
                </details>
                <details className="dropdown ">
                  <summary
                    className="m-1 btn bg-transparent border-1"
                    ref={typeDropdownButton}
                  >
                    {typeDropdown}
                  </summary>
                  <ul
                    className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 `}
                  >
                    {["Online", "Offline", "Both"].map((type, idx) => (
                      <li key={idx}>
                        <a onClick={() => typeDropdownHandle(type)}>
                          {type}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
                <details className="dropdown ">
                  <summary
                    className="m-1 btn bg-transparent border-1"
                    ref={timeDropdownButton}
                  >
                    {timeDropdown}
                  </summary>
                  <ul
                    className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 `}
                  >
                    {["Upcoming", "Past", "All"].map((type, idx) => (
                      <li key={idx}>
                        <a onClick={() => timeDropdownHandle(type)}>
                          {type}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </div>

          <div
            className={`md:w-[90%] w-full mb-5 justify-items-center grid grid-cols-1 md:gap-x-4 gap-y-6 mb-10" ${
              data.length == 0
                ? ""
                : " sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
            }`}
          >
            {data.map((evnt, i) => (
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
            <Link
              href={"/event/past"}
              className="rounded-[22px] border flex justify-center scale-100 hover:scale-105 transition-all cursor-pointer flex-col gap-2 items-center text-[13px] sm:text w-[20rem] h-[20rem] sm:w-[25rem] sm:h-[25rem] md:w-[25rem] md:h-[25rem] bg-glass"
            >
              <PiClockCounterClockwiseBold className="text-[30px] sm:text-[50px]" />{" "}
              View Past Events.
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
