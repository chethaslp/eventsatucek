"use client";
import { Navbar } from "@/components/ui/navbar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CardGrid from "@/components/ui/CardGrid";
import Card from "@/components/ui/card";

import { getImgLink, getPastEvents } from "@/lib/data";
import Loading from "../../../components/ui/Loading";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import Footer from "@/components/ui/Footer";
import NoEvents from "@/app/NoEvents";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  let date;

  useEffect(() => {
    getPastEvents()
      .then((clbdata) => {
          setData(clbdata);
          setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  // If there is no events happening
  if(data.length == 0 && !loading){
    return(
      <NoEvents/>
    )
  }

  return loading ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="">
      <Navbar />
      <div className="flex dark:bg-[#0a0a0a] flex-col w-full h-full p-1 md:p-5 items-center">
        <div className="m-7  mt-36">
          <p className="text-3xl">Past Events</p>
        </div>
        <CardGrid>
          {data.map((evnt, i) => (
            <Link
              href={"/e/"+evnt[1]}
              key={evnt[1]}>
              <Card
                title={evnt[3]}
                id={evnt[1]}
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
            </Link>
          ))}
        </CardGrid>
      </div>
      <Footer/>
    </div>
  );
}
