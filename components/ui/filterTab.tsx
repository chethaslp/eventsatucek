import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { getClubs, filterEvents, search } from "@/lib/data";
import { Button } from "./button";
import { cn } from "@/lib/utils";

function FilterTab({
  setFilteredEvents,
  className,
}: {
  setFilteredEvents: any;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClub, setSelectedClub] = useState(0);
  const [selectedType, setSelectedType] = useState(1);
  const [selectedTime, setSelectedTime] = useState(0);

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

  return (
    <div
      className={cn(
        "bg-black flex justify-center items-center pt-8",
        className
      )}
    >
      <div className="w-[70%] h-fit  p-2 rounded-sm">
        <div>
          <div className="flex flex-col items-center justify-center gap-3">
            <form
              className="bg-[#0b0b0b] p-2 items-center w-[95%] h-8 flex rounded-lg gap-3"
              onSubmit={handleSearch}
            >
              <Search color="white" />
              <input
                className="bg-[#0b0b0b] w-full outline-none focus:outline-none text-white"
                type="text"
                name="keyword"
                placeholder="Search events, clubs or tags"
              />
              <Button type="submit" variant={"default"} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Search"}
              </Button>
            </form>
            <div className="bg-[#0b0b0b] p-2 items-center max-w-[95%]  justify-center h-8 flex rounded-lg gap-3">
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
                    className={`text-white text-center rounded-md md:min-w-[13rem] min-w-[9rem] text-[14px] cursor-pointer ${
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
                  {["Online", "Both", "Offline"].map((club, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTypeClick(idx)}
                      className={`text-white text-center rounded-md md:min-w-[7rem] min-w-[5rem] cursor-pointer ${
                        selectedType === idx ? "bg-[#222222]" : "bg-transparent"
                      }`}
                    >
                      {club}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0b0b0b] p-2 items-center md:max-w-[95%] w-[19rem] h-8 flex rounded-lg gap-3">
                <div className="flex overflow-x-scroll remove-scrollbar gap-2">
                  {["Upcoming", "Past", "All"].map((club, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTimeClick(idx)}
                      className={`text-white text-center rounded-md md:min-w-[7rem] min-w-[5rem] cursor-pointer ${
                        selectedTime === idx ? "bg-[#222222]" : "bg-transparent"
                      }`}
                    >
                      {club}
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
