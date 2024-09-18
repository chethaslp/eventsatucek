import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getClubs, filterEvents, search } from "@/lib/data";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { set } from "react-hook-form";

function FilterTab({
  setFilteredEvents,
  upcomingEvents,
  className,
}: {
  setFilteredEvents: any;
  upcomingEvents: string[][] | undefined;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClub, setSelectedClub] = useState(0);
  const [selectedType, setSelectedType] = useState(1);
  const [selectedTime, setSelectedTime] = useState(0);
  const [isOpenedFirstTime, setIsOpenedFirstTime] = useState(true);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: -200, // Adjust the scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: 200, // Adjust the scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  const handleClubClick = (idx: any) => {
    setSelectedClub(idx);
    filterEvents(
      idx,
      ["Online", "Both", "Offline"][selectedType],
      ["Upcoming", "Past", "All"][selectedTime]
    ).then((evnts) => setFilteredEvents(evnts));
  };
  const handleTypeClick = (idx: any) => {
    setSelectedType(idx);
    filterEvents(
      selectedClub,
      ["Online", "Both", "Offline"][idx],
      ["Upcoming", "Past", "All"][selectedTime]
    ).then((evnts) => setFilteredEvents(evnts));
  };
  const handleTimeClick = (idx: any) => {
    setSelectedTime(idx);
    filterEvents(
      selectedClub,
      ["Online", "Both", "Offline"][selectedType],
      ["Upcoming", "Past", "All"][idx]
    ).then((evnts) => setFilteredEvents(evnts));
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setLoading(true);
    search(e.target.keyword.value).then((evnts) => {
      setFilteredEvents(evnts);
      setLoading(false);
    });
  };

  useEffect(() => {
    if(((upcomingEvents && upcomingEvents.length ==0) || !upcomingEvents) && isOpenedFirstTime) {
      setSelectedTime(1);
      setSelectedClub(0);
      setSelectedType(1);
      setIsOpenedFirstTime(false);

      filterEvents(0, "Both", "Past").then((evnts) => setFilteredEvents(evnts));
    }
  }, []);


  return (
    <div
      className={cn(
        "bg-black flex justify-center items-center md:pt-8 pt-20",
        className
      )}
    >
      <div className="md:w-[70%] w-[95%] h-fit  p-2 rounded-sm">
        <div>
          <div className="flex flex-col items-center justify-center gap-3">
            <form
              className="bg-[#0b0b0b] p-2 items-center md:w-[95%] w-full h-8 flex rounded-lg gap-3"
              onSubmit={handleSearch}
            >
              <Search color="white" />
              <input
                className="bg-[#0b0b0b] w-full outline-none focus:outline-none text-white"
                type="text"
                name="keyword"
                placeholder="Search events, clubs or tags"
              />
            </form>
            <div className="bg-[#0b0b0b] p-2 items-center md:max-w-[95%] max-w-full  justify-center h-8 flex rounded-lg gap-3">
              <ChevronLeft
                color="white"
                onClick={scrollLeft}
                className="cursor-pointer w-10 h-10"
              />

              <div
                className="flex overflow-x-scroll remove-scrollbar gap-2"
                ref={scrollRef}
              >
                {getClubs.map((club, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleClubClick(idx)}
                    className={`text-white text-center rounded-md md:min-w-[9rem] min-w-[6rem] md:text-[14px] text-[12px] cursor-pointer ${
                      selectedClub === idx ? "bg-[#222222]" : "bg-transparent"
                    }`}
                  >
                    {club == "Google Developers Student Club - UCEK"
                      ? "GDSC"
                      : club.replace("- UCEK", "")}
                  </div>
                ))}
              </div>
              <ChevronRight
                color="white"
                onClick={scrollRight}
                className="cursor-pointer w-10 h-10"
              />
            </div>
            <div className="flex gap-5 md:flex-row flex-col items-center">
              <div className="bg-[#0b0b0b] p-2 items-center md:max-w-[95%] w-[19rem] justify-center h-8 flex rounded-lg gap-3">
                <div className="flex overflow-x-scroll remove-scrollbar gap-2">
                  {["Online", "Both", "Offline"].map((type, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTypeClick(idx)}
                      className={`text-white text-center rounded-md md:min-w-[5rem] min-w-[5rem] md:text-[14px] text-[12px] cursor-pointer ${
                        selectedType === idx ? "bg-[#222222]" : "bg-transparent"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0b0b0b] p-2 items-center md:max-w-[95%] w-[18rem] justify-center h-8 flex rounded-lg gap-3">
                <div className="flex overflow-x-scroll remove-scrollbar gap-2">
                  {["Upcoming", "Past", "All"].map((time, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTimeClick(idx)}
                      className={`text-white text-center rounded-md md:min-w-[5rem] min-w-[5rem] md:text-[14px] text-[12px] cursor-pointer ${
                        selectedTime === idx ? "bg-[#222222]" : "bg-transparent"
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterTab;
