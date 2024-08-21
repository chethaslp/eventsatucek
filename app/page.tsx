"use client";

import { Navbar } from "@/components/ui/navbar";

import Footer from "@/components/ui/Footer";
import {
  getImgLink,
  getUpcomingEvents,
  getClubs,
  filterEvents,
} from "@/lib/data";
import Loading from "../components/ui/Loading";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Urbanist } from "next/font/google";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { LuFilter } from "react-icons/lu";

import NoEvents from "./NoEvents";
import FCM from "@/components/ui/fcm";
import moment from "moment";
import Bannner from "@/components/ui/bannner";
import PreviewCard from "@/components/ui/previewCard";
import Card from "@/components/ui/oldCard";
import FilterTab from "@/components/ui/filterTab";
import EventsList from "@/components/ui/eventsList";

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
  const [bannerEvent, setBannerEvent] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    getUpcomingEvents()
      .then((data) => {
        if (data.length <= 1) {
          setTimeDropdown("Past");
          filterEvents(clubDropdown, typeDropdown, "Past").then((evnts) =>
            setData(evnts)
          );
        }
        setData(data);
        const upcomingEvent = data.shift() || [""]; // Remove and return the first event from data
        setBannerEvent(upcomingEvent);
        setDate(moment(upcomingEvent[7], "DD/MM/YYYY HH:mm:ss"));
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
      filterEvents(club, typeDropdown, timeDropdown).then((evnts) =>
        setData(evnts)
      );
    }
  }
  function typeDropdownHandle(type: string): any {
    typeDropdownButton.current.click();
    if (type != typeDropdown) {
      setTypeDropdown(type);
      filterEvents(clubDropdown, type, timeDropdown).then((evnts) =>
        setData(evnts)
      );
    }
  }
  function timeDropdownHandle(time: string): any {
    timeDropdownButton.current.click();
    if (time != timeDropdown) {
      setTimeDropdown(time);
      filterEvents(clubDropdown, typeDropdown, time).then((evnts) =>
        setData(evnts)
      );
    }
  }

  function handleError() {}
  function handleScan() {}
  // If there is no events in data
  if (data.length == 0 && !loading && bannerEvent.length == 0) {
    return <NoEvents />;
  }

  return loading ? (
    <Loading msg="Loading..." />
  ) : (
    <>
      <div className="w-full">
        <FCM />
        <Navbar />
        <Bannner bannerEvent={bannerEvent} date={date}/>
        <PreviewCard/>
        <FilterTab/>
        <EventsList/>

        

        {/*--------------------------------- Old ui  -------------------------------------------------*/}
        <div className="flex flex-col  w-full h-full p-1 md:p-5 items-center bg-[#000000] ">
          <div className="flex w-full lg:mt-10 flex-col">
            <div
              className={` my-7 mt-7  mb-4 justify-center  flex md:flex-col`}
            >
              <p className="text-3xl md:text-5xl font-semibold pt-6 text-center">
                {timeDropdown} Events
              </p>
              <div className="md:left-28 lg:left-0 z-10 absolute lg:relative lg:mb-0 mb-10 md:my-7  text-xs md:text-lg pt-6">
                <div className="flex flex-row items-center gap-1 md:gap-2 pt-12  mt-3 sm:mt-8 md:mt-28   lg:mt-0  lg:ml-20 md:ml-14">
                  <LuFilter size={25} /> Filter
                  <details className="dropdown">
                    <summary
                      className="m-1 btn bg-transparent border-1 dark:text-white dark:hover:bg-[#242424]"
                      ref={clubDropdownButton}
                    >
                      {clubDropdown}
                    </summary>
                    <ul
                      className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 dark:bg-black `}
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
                      className="m-1 btn bg-transparent border-1 dark:text-white dark:hover:bg-[#242424]"
                      ref={typeDropdownButton}
                    >
                      {typeDropdown}
                    </summary>
                    <ul
                      className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-36 dark:bg-black `}
                    >
                      {["Online", "Offline", "Both"].map((type, idx) => (
                        <li key={idx}>
                          <a onClick={() => typeDropdownHandle(type)}>{type}</a>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <details className="dropdown ">
                    <summary
                      className="m-1 btn bg-transparent border-1 dark:text-white dark:hover:bg-[#242424]"
                      ref={timeDropdownButton}
                    >
                      {timeDropdown}
                    </summary>
                    <ul
                      className={`p-2  shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-36 md:w-52  dark:bg-black`}
                    >
                      {["Upcoming", "Past", "All"].map((type, idx) => (
                        <li key={idx}>
                          <a onClick={() => timeDropdownHandle(type)}>{type}</a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </div>

            <div
              className={`md:w-[90%] w-full mt-36 md:mt-24 lg:mt-0 mb-5  md:mx-20 justify-around grid grid-cols-1 md:gap-x-4 gap-y-6 justify-items-center" ${
                data.length == 0
                  ? ""
                  : " sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
              }`}
            >
              {data.map((evnt, i) => (
                <Link
                  key={evnt[1]}
                  href={`/e/${evnt[1]}`}
                  className="flex justify-center"
                >
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
              <div className="w-full flex justify-center">
                <Link
                  href={"/e/past"}
                  className="rounded-[22px] border flex justify-center scale-100 hover:scale-105 transition-all cursor-pointer flex-col gap-2 items-center  md:mx-0 text-[13px] sm:text w-[20rem] h-[20rem] sm:w-[25rem] sm:h-[25rem] md:w-[25rem] md:h-[25rem] bg-glass"
                >
                  <PiClockCounterClockwiseBold className="text-[30px] sm:text-[50px]" />{" "}
                  View Past Events.
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
