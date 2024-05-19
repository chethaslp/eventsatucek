"use client";

import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GITHUB_API_URL } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";
import { AvatarCard } from "@/components/ui/avatar-card";
import CardGrid from "@/components/ui/CardGrid";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/Loading";

function Page() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    fetch(GITHUB_API_URL)
      .then(async (resp) => {
        setData(await resp.json());
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  return data.length == 0 ? (
    <Loading msg="Loading..." />
  ) : (
    <div className="flex flex-col dark:bg-[#0a0a0a] min-h-[50rem] h-full">
      <Navbar />
      <div className="flex-1 justify-center mb-8 flex-col">
        <div className="text-2xl flex items-center justify-center mb-5">
          Contributors
        </div>
        <div className="items-center flex-col sm:flex-row w-full justify-evenly flex md:gap-x-4 gap-y-6 mb-10">
          {data.map(
            (contr: {
              login: string;
              avatar_url: string;
              html_url: string;
            }) => (
              <div
                key={contr.login}
                className="rounded-[24px] flex flex-col border border-slate-600 p-5"
              >
                <AvatarCard url={contr.avatar_url} className="w-44" />
                <a
                  href={contr.html_url}
                  target="_blank"
                  className="transition-all hover:scale-105 scale-100"
                >
                  <div className="flex justify-center gap-2 items-center mt-5 rounded-lg bg-white dark:bg-slate-800 p-2">
                    <FaGithub size={30} />
                    <span className="text-md">@{contr.login}</span>
                  </div>
                </a>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
