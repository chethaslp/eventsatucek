"use client";
import { Navbar } from "@/components/ui/navbar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";

import { getImgLink, getPastEvents } from "@/lib/data";
import { formatDateArray } from "@/lib/utils";
import Loading from "../../loading";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import Footer from "@/components/ui/Footer";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<string[][]>();
  let date;

  useEffect(() => {
    getPastEvents()
      .then((clbdata) => {
          setData(clbdata);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  return !data ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="">
      <Navbar />
      <div className="flex dark:bg-[#121212] flex-col w-full h-full p-1 md:p-5 items-center">
        <div className="m-7">
          <p className="text-3xl">Past Events</p>
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
        </CardGrid>
      </div>
      <Footer/>
    </div>
  );
}
