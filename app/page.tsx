"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { useToast } from "@/components/ui/use-toast";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/banner";
import Footer from "@/components/ui/Footer";

import { PUBLIC_KEY, firebaseConfig, getImgLink, getUpcomingEvents, } from "@/lib/data";
import { formatDateArray, countdownHelper } from "@/lib/utils";
import Loading from "./loading";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Urbanist } from 'next/font/google'

import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const font = Urbanist({ subsets: ['latin'], weight: ['400']})

export default function Home() {
  const toast = useToast()
  const [data, setData] = useState<Array<string[]>>([]);
  const [countdown, setCountdown] = useState<string>()
  const [bannerEvent, setBannerEvent] = useState<string[]>(["","","","","","","","",""])
  let date;

  var currentDate:any = new Date();

  useEffect(() => {
    getUpcomingEvents()
      .then((data) => {
        setData(data);
        setBannerEvent(data.shift() || [""])
        var eventDate:any = new Date(formatDateArray(bannerEvent? bannerEvent[7] :"").date); // Convert 'date' to a Date object
        var day_difference = eventDate - currentDate
        setCountdown(countdownHelper(day_difference))
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [currentDate]);

  useEffect((() =>  {
    function reqNotification(){
      //requesting permission using Notification API
      Notification.requestPermission().then((permission)=>{
        if (permission === "granted") {
          // getting FCM Token
          getToken(getMessaging(initializeApp(firebaseConfig)), { vapidKey: PUBLIC_KEY,})
          // Sending FCM Token to the server
          .then( token => fetch("/api/addSubscriber",{
            method : 'POST',
            body : token
          }))
          .then((resp)=> console.log(resp))
    
        } else if (permission === "denied") {
            alert("Please accept the notification for recieving Live Updates about Events at UCEK. ");
        }
      })
      }
      reqNotification();
  }),[])

  useEffect(()=>{
    onMessage(getMessaging(initializeApp(firebaseConfig)), (payload)=>{
      toast.toast({
          title: payload.notification?.title,
          description: payload.notification?.body,
          icon: payload.notification?.image
        })
    })
    
  })

 


  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
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
             
              <p className="text-xl md:text-3xl font-bold mb-1">{bannerEvent[3]}</p>
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
              <div className="flex flex-col items-center mt-4 rounded-lg bg-glass p-3">
                <p className="text font-medium">
                Applications Close In
                </p>
                <p className={`${font.className} text-xl font-semibold`} >{countdown?countdown:"00d : 00h : 00m : 00s"}</p>
              </div>
              <div className="flex flex-row gap-3 mb-4 mt-2 justify-center md:gap-5">
                <Link href={"/event/" + bannerEvent[1]}>
                  <Button
                    className="hover:scale-105 transition-all h-12"
                    variant={"secondary"}
                  >
                    View More
                  </Button>
                </Link>
                <Link href={bannerEvent[9]} target="_blank">
                  <button className="inline-flex hover:scale-105 transition-all scale-100 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    RVSP Now!
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
                onClick={() => (window.location.href = "/event/" + bannerEvent[1])}
                className="rounded-[22px] cursor-pointer scale-100 hover:scale-105 transition duration-300 ease-in-out"
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
          <Link href={"/event/past"} className="rounded-[22px] flex justify-center scale-100 hover:scale-105 transition-all cursor-pointer flex-col gap-2 items-center w-[18rem] h-[18rem] md:w-[25rem] md:h-[25rem] bg-glass">
            <PiClockCounterClockwiseBold size={50}/> View Past Events.
          </Link>
        </CardGrid>
      </div>
      <Footer />
    </div>
  );
}
