"use client"

import moment from "moment";
import { useEffect, useState } from "react";

export default function CountdownTimer({bannerEvent, date} : {bannerEvent:Array<string> , date?: moment.Moment}){
    const [countdown, setCountdown] = useState<moment.Duration>();

    useEffect(() => {
        function updateCountdown() {
          if (bannerEvent && bannerEvent[7]) {
            console.log(date?.diff(moment()))
            setCountdown(moment.duration(moment.duration(date?.diff(moment())).subtract(1,"second"), 'milliseconds'))
          }
        }
        // Update countdown timer when bannerEvent changes
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000); // Update countdown every second
        return () => clearInterval(intervalId); // Cleanup function to clear the interval when component unmounts or when bannerEvent changes
      }, [bannerEvent]);

    return <div className={"grid grid-flow-col mt-4 gap-5 text-center auto-cols-max"}>
    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content text-sm md:text">
      <span className="countdown font-mono text-4xl md:text-5xl">
        <span style={{"--value": countdown ? countdown.days() : 0} as React.CSSProperties}></span>
      </span>
      days
    </div> 
    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content text-sm md:text">
      <span className="countdown font-mono text-4xl md:text-5xl">
        <span style={{"--value": countdown ? countdown.hours() : 0} as React.CSSProperties}></span>
      </span>
      hours
    </div> 
    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content text-sm md:text">
      <span className="countdown font-mono text-4xl md:text-5xl">
        <span style={{"--value": countdown ? countdown.minutes(): 0} as React.CSSProperties}></span>
      </span>
      min
    </div> 
    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content text-sm md:text">
      <span className="countdown font-mono text-4xl md:text-5xl">
        <span style={{"--value": countdown ? countdown.seconds() : 0} as React.CSSProperties}></span>
      </span>
      sec
    </div>
  </div>
}
