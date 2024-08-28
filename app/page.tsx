"use client";

import { Navbar } from "@/components/ui/navbar";

import Footer from "@/components/ui/Footer";
import {
  getImgLink,
  getUpcomingEvents,
  getClubs,
  filterEvents,
  getEvents,
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
import OldCard from "@/components/ui/oldCard";
import Card from "@/components/ui/card";
import FilterTab from "@/components/ui/filterTab";
import EventsList from "@/components/ui/eventsList";
import { MdUpcoming } from "react-icons/md";
import LogoBanner from "@/components/ui/logobanner";

const font = Urbanist({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const clubDropdownButton: any = useRef(null);
  const typeDropdownButton: any = useRef(null);
  const timeDropdownButton: any = useRef(null);

  const [filteredEvents, setFilteredEvents] = useState<Array<string[]>>();
  const [pastData, setPastData] = useState<Array<string[]>>([]);
  const [upcomingData, setUpcomingData] = useState<Array<string[]>>([]);
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
    getEvents()
      .then(([upcomingEvents, pastEvents]) => {
        if (filteredEvents && filteredEvents.length <= 1) {
          setTimeDropdown("Past");
          filterEvents(clubDropdown, typeDropdown, "Past").then((evnts) =>
            setFilteredEvents(evnts)
          );
        }
        const upcomingEvent = upcomingEvents.shift() || [""]; // Remove and return the first event from data
        
        setUpcomingData(upcomingEvents);
        setPastData(pastEvents);
        setBannerEvent(upcomingEvent);
        setDate(moment(upcomingEvent[7], "DD/MM/YYYY HH:mm:ss"));
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);


  function handleError() {}
  function handleScan() {}

  return loading ? (
    <Loading msg="Loading..." />
  ) : (
    <>
      <div className="w-full">
        <FCM />
        <Navbar />
        {(!bannerEvent || bannerEvent.length != 0) ? <LogoBanner/>:<Bannner bannerEvent={bannerEvent} date={date}/>}
        {/* <PreviewCard heading="Upcoming Events"/> */}

        <FilterTab className="" setFilteredEvents={setFilteredEvents}/>
        <EventsList>
          {filteredEvents && filteredEvents.length == 0 && <div className="flex gap-2 flex-col items-center">
              <MdUpcoming size={40} />
              <p className='text-lg font-bold'>We found nothing. <br/> (┬┬﹏┬┬)</p>
            </div>}
          {filteredEvents && filteredEvents.map((evnt, i) => (
            <Card
              key={evnt[1]}
              id={evnt[1]}
              title={evnt[3]}
              description={evnt[4]}
              club={evnt[6]}
              img={
                <Image
                  width={310}
                  height={310}
                  referrerPolicy={"no-referrer"}
                  src={getImgLink(evnt[5])}
                  alt={evnt[3]}
                  className="transition duration-300 ease-in-out aspect-square rounded-md"
                ></Image>
              }
              date={evnt[7]}
              isOnline={evnt[8] == "Online" ? true : false}
              venue={evnt[10]}
            />
          ))}
        </EventsList>
        <div className="bg-black text-white">
          <h3 className="text-4xl font-semibold ml-8 py-20">Past Events</h3>
          <div className="flex overflow-x-scroll remove-scrollbar pb-10">

            {pastData.map((evnt) =>   
            <div key={evnt[1]} className="text-white card cursor-pointer scale-100 hover:scale-105 transition-all min-w-96 shadow-xl mx-6 bg-[#0b0b0b]" onClick={()=> location.href = "/e/"+ evnt[1]}>
              <figure className="h-32">
                <Image
                  src={getImgLink(evnt[5])}
                  width={400}
                  height={400}
                  alt={evnt[3]}
                />
              </figure>
            <div className="card-body ">
              <h2 className="card-title">{evnt[3]}</h2>
              <p>{evnt[6]}</p>
              <p>{moment(evnt[7], "DD/MM/YYYY HH:mm:ss").format("DD MMM, YYYY")}<span>  •  </span> {evnt[10]}</p>
            </div>
          </div>
          )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
