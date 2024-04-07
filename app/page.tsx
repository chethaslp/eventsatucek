"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "./loading";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";
import Link from "next/link";
import { getData } from "@/lib/data";

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

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data);
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
        <div className="mb-5">
          <p>Upcoming Events</p>
        </div>
        <CardGrid>
          {data.map((evnt, i) => (
            <Link key={`event_${i}`} href={`/event/${i}`}>
              <Card
                key={i}
                title={evnt[2]}
                description={evnt[3]}
                header={
                  <Image
                    width={500}
                    height={500}
                    referrerPolicy={"no-referrer"}
                    src={getImgLink(evnt[4])}
                    alt="Event Poster"
                    className="opacity-50 group-hover:opacity-100 transition duration-300 ease-in-out"
                  ></Image>
                }
                icon={evnt[6]}
                isOnline={evnt[7] == "Online" ? true : false}
              />
          </Link>
          ))}
        </CardGrid>
      </div>
    </div>
  );
}
