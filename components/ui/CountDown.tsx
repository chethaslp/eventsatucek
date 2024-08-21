"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";
import { countdownHelper, parseDate } from "@/lib/utils";
const inter = Outfit({ subsets: ["latin"] });

export default function CountDown({
  bannerEvent,
  date,
}: {
  bannerEvent: Array<string>;
  date: any;
}) {
  const [countdown, setCountdown]: any = useState();
  const targetDate: Date = parseDate(date._i);

  useEffect(() => {
    function updateCountdown() {
      if (bannerEvent && bannerEvent[7]) {
        const differenceMs: number =
          targetDate.getTime() - new Date().getTime();
        setCountdown(countdownHelper(differenceMs));
      }
    }
    const intervalId = setInterval(updateCountdown, 1000); // Update countdown every second
    return () => clearInterval(intervalId); // Cleanup function to clear the interval when component unmounts or when bannerEvent changes
  }, [bannerEvent]);

  return (
    <div className={`${inter.className}`}>
      <div
        className={`grid grid-flow-col mt-4 gap-5 text-center auto-cols-max `}
      >
        <div
          className={`flex flex-col p-2 bg-[#3d3c3c6e] rounded-box text-white text-sm sm:text-sm md:text`}
        >
          <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
            <span
              className={`${inter.className}`}
              style={
                {
                  "--value": countdown ? countdown.days : 0,
                } as React.CSSProperties
              }
            ></span>
          </span>
          DAYS
        </div>
        <div className="flex flex-col p-2 bg-[#3d3c3c6e] rounded-box text-white text-sm sm:text-sm md:text">
          <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
            <span
              className={`${inter.className}`}
              style={
                {
                  "--value": countdown ? countdown.hours : 0,
                } as React.CSSProperties
              }
            ></span>
          </span>
          HOURS
        </div>
        <div className="flex flex-col p-2 bg-[#3d3c3c6e] rounded-box text-white  text-sm sm:text-sm md:text">
          <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
            <span
              className={`${inter.className}`}
              style={
                {
                  "--value": countdown ? countdown.minutes : 0,
                } as React.CSSProperties
              }
            ></span>
          </span>
          MIN
        </div>
        <div className="flex flex-col p-2 bg-[#3d3c3c6e] rounded-box text-white  text-sm sm:text-sm md:text">
          <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
            <span
              className={`${inter.className}`}
              style={
                {
                  "--value": countdown ? countdown.seconds : 0,
                } as React.CSSProperties
              }
            ></span>
          </span>
          SEC
        </div>
      </div>
    </div>
  );
}
