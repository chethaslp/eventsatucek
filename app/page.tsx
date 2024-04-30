"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { useToast } from "@/components/ui/use-toast";
import Card from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/banner";
import Footer from "@/components/ui/Footer";

import {
  PUBLIC_KEY,
  firebaseConfig,
  getImgLink,
  getUpcomingEvents,
  getClubs,
  getMoreClubEvents,
  filterEvents,
} from "@/lib/data";
import { formatDateArray, countdownHelper } from "@/lib/utils";
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

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { register } from "register-service-worker";
import NoEvents from "./NoEvents";
import Head from "next/head";

const font = Urbanist({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const toast = useToast();
  const clubDropdownButton:any = useRef(null);
  const typeDropdownButton:any = useRef(null);
  const [data, setData] = useState<Array<string[]>>([]);
  const [loading, setLoading] = useState(true);
  const [clubDropdown, setClubDropdown]:any = useState("All Clubs")
  const [typeDropdown, setTypeDropdown]:any = useState("Both")
  const [countdown, setCountdown]: any = useState<string>();
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
  let date;

  useEffect(() => {
    getUpcomingEvents()
      .then((data) => {
        setData(data);
        const upcomingEvent = data.shift() || [""]; // Shift the first event from data
        setBannerEvent(upcomingEvent);
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  function clubDropdownHandle(club:string):any{
    clubDropdownButton.current.click();
    if (club != clubDropdown){
      setClubDropdown(club)
      filterEvents(club, typeDropdown).then((evnts)=>setData(evnts))
    } 
  }
  function setTypeDropdownHandle(type:string):any{
    typeDropdownButton.current.click();
    if (type != typeDropdown){
      setTypeDropdown(type)
      filterEvents(clubDropdown, type).then((evnts)=>setData(evnts))
    }
  }
  function updateCountdown() {
    if (bannerEvent && bannerEvent[7]) {
      const eventDate: any = new Date(formatDateArray(bannerEvent[7]).date); // Convert 'date' to a Date object
      const currentDate: any = new Date(); // Assuming currentDate represents the current date
      const day_difference: any = eventDate - currentDate;
      setCountdown(countdownHelper(day_difference));
    }
  }
  useEffect(() => {
    // Update countdown timer when bannerEvent changes
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000); // Update countdown every second
    return () => clearInterval(intervalId); // Cleanup function to clear the interval when component unmounts or when bannerEvent changes
  }, [bannerEvent]);

  useEffect(() => {
    function reqNotification() {
      // Requesting permission using Notification API
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Getting FCM Token
          register("/firebase-messaging-sw.js", {
            registrationOptions: {
              scope: "/firebase-cloud-messaging-push-scope",
            },
            ready(registration) {
              console.log("ServiceWorker is active now.");
            },
            error(error) {
              console.error("Error during service worker registration:", error);
            },
            registered(reg) {
              console.log("Registered ServiceWorker.");
              getToken(getMessaging(initializeApp(firebaseConfig)), {
                vapidKey: PUBLIC_KEY,
              })
                // Sending FCM Token to the server
                .then((token) => {
                  if (localStorage.getItem("sw-registered") !== "1") {
                    fetch("/api/addSubscriber", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json", // Set Content-Type header
                      },
                      body: JSON.stringify({ token }), // Stringify token object
                    })
                      .then((resp) => {
                        console.log(resp);
                        localStorage.setItem("sw-registered", "1");
                      })
                      .catch((error) => {
                        console.error("Error sending token to server:", error);
                      });
                  }
                })
                .catch((error) => {
                  console.error("Error getting FCM Token:", error);
                });
            },
          });
        } else if (permission === "denied") {
          if (localStorage.getItem("sw-registered") !== "0") {
            localStorage.setItem("sw-registered", "0");
            alert(
              "Please accept the notification for receiving Live Updates about Events at UCEK."
            );
          }
        }
      });
    }
  
    if (window.Notification) reqNotification();
  }, []);
  
  useEffect(() => {
    onMessage(getMessaging(initializeApp(firebaseConfig)), (payload) => {
      toast.toast({
        title: "New Event Published!",
        description: "Refresh the page to view now.",
      });
    });
  });

  // If there is no events happening
  if (data.length == 0 && !loading && bannerEvent.length == 0) {
    return <NoEvents />;
  }

  return loading ? (
    <Loading msg="Loading..." />
  ) : (
    <>
    <div className="">
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

              <p className="text-xl md:text-3xl font-bold mb-1">
                {bannerEvent[3]}
              </p>
              <p className="flex items-center mb-1 ">
                <FaCalendarAlt className="mr-2" />
                {(() => {
                  date = bannerEvent ? formatDateArray(bannerEvent[7]) : null;
                })()}
                {date.dayOfWeek}, {date.day}&nbsp;{date.month}&nbsp;{date.year}
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
                {date.from_time}
              </p>
              <div className="flex flex-col items-center mt-3 rounded-lg bg-glass p-3">
                <p className="text font-medium pb-2">Applications Close In</p>
                <div
                  className={`${font.className} flex gap-1 sm:gap-2 md:gap-4 items-center font-semibold`}
                >
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl">
                      {countdown ? countdown.days : 0}
                    </h1>
                    <p className="text-sm md:text-0">DAYS</p>
                  </div>
                  :
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl">
                      {countdown ? countdown.hours : 0}
                    </h1>
                    <p className="text-sm md:text-0">HOURS</p>
                  </div>
                  :
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl">
                      {countdown ? countdown.minutes : 0}
                    </h1>
                    <p className="text-sm md:text-0">MINUTES</p>
                  </div>
                  :
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl">
                      {countdown ? countdown.seconds : 0}
                    </h1>
                    <p className="text-sm md:text-0">SECONDS</p>
                  </div>
                </div>
              </div>
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
                  href={bannerEvent[9]}
                  target="_blank"
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
          className={` my-7 mt-7  mb-28 justify-center  flex md:flex-row  ${data.length == 0 ? "opacity-0" : ""}`}
        >
          <p className="text-3xl">Upcoming Events</p>
          <div className="md:left-28 z-30 absolute md:my-7 my-12  text-sm md:text-lg p-2">
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <LuFilter size={25} /> Filter
              <details className="dropdown">
                <summary className="m-1 btn bg-transparent border-2" ref={clubDropdownButton} >{clubDropdown}</summary>
                <ul  className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52`}>
                  {getClubs.map((club, idx) => (
                    <li key={idx}>
                      <a onClick={(()=>clubDropdownHandle(club))}>{club}</a>
                    </li>
                  ))}
                </ul>
              </details>
        
   
              <details className="dropdown ">
                <summary className="m-1 btn bg-transparent border-2" ref={typeDropdownButton}>{typeDropdown}</summary>
                <ul className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 `}>
                  {['Online', 'Offline', 'Both'].map((type, idx)=>(
                    <li key={idx}>
                      <a onClick={(()=>setTypeDropdownHandle(type))}>{type}</a>
                    </li>
                    ))}
                </ul>
              </details>
              </div>
          </div>
        </div>

        <div
          className={`md:w-[90%] w-full mb-5 justify-items-center grid grid-cols-2 md:gap-x-4 gap-y-6 mb-10" ${
            data.length == 0
              ? ""
              : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
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
                icon={evnt[7]}
                isOnline={evnt[8] == "Online" ? true : false}
                venue={evnt[10]}
              />
            </Link>
          ))}
          <Link
            href={"/event/past"}
            className="rounded-[22px] flex justify-center scale-100 hover:scale-105 transition-all cursor-pointer flex-col gap-2 items-center text-[13px] sm:text w-[10rem] h-[10rem] sm:w-[18rem] sm:h-[18rem] md:w-[25rem] md:h-[25rem] bg-glass"
          >
            <PiClockCounterClockwiseBold className="text-[30px] sm:text-[50px]" /> View Past Events.
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
