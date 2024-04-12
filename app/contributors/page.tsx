"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Navbar } from "@/components/ui/navbar";
import { GITHUB_API_URL } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import { AvatarCard } from "@/components/ui/avatar-card";
import CardGrid from "@/components/ui/CardGrid";
import { FaGithub } from "react-icons/fa";


function Page() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
   fetch(GITHUB_API_URL)
      .then(async (resp) => {
        setData(await resp.json())
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="flex flex-col dark:bg-[#121212] min-h-[50rem] h-[100dvh] ">
      <Navbar />
      <div className="flex justify-center mb-8 flex-col">
        <div className="text-2xl flex items-center justify-center mb-5">Contributors</div>
      <CardGrid>
          {data.map((contr:{login:string, avatar_url:string, html_url:string, }) => (
            <div className="rounded-[24px] flex flex-col border border-slate-600 p-5">
                <AvatarCard url={contr.avatar_url} />
                <div className="flex justify-around items-center mt-5">
                    <span className="text-md">@{contr.login}</span>
                    <a href={contr.html_url} target="_blank" className="transition-all hover:scale-105 scale-100">
                            <FaGithub size={30}/>
                    </a>
                </div>
            </div>
          ))}
        </CardGrid>
      
      </div>
        <Footer/>
    </div>
  );
}

export default Page;
