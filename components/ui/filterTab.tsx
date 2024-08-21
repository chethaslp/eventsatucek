import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { getClubs, filterEvents } from "@/lib/data";

function FilterTab() {
  const scrollRef = useRef<HTMLDivElement>(null);
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
  };
  const handleTypeClick = (idx: any) => {
    setSelectedType(idx);
  };
  const handleTimeClick = (idx: any) => {
    setSelectedTime(idx);
  };

  return (
    <div className="bg-black flex justify-center items-center pt-8">
      <div className="w-[70%] h-fit  p-2 rounded-sm">
        <div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-[#0b0b0b] p-2 items-center w-[95%] h-8 flex rounded-lg gap-3">
              <Search color="white" />
              <input
                className="bg-[#0b0b0b] w-full outline-none focus:outline-none text-white"
                type="text"
                placeholder="Search clubs"
              />
            </div>
            <div className="bg-[#0b0b0b] p-2 items-center max-w-[95%] justify-center h-8 flex rounded-lg gap-3">
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
                    className={`text-white text-center rounded-md min-w-[13rem] cursor-pointer ${
                      selectedClub === idx ? "bg-[#222222]" : "bg-transparent"
                    }`}
                  >
                    {club}
                  </div>
                ))}
              </div>
              <ChevronRight
                color="white"
                onClick={scrollRight}
                className="cursor-pointer w-10 h-10"
              />
            </div>
            <div className="flex gap-5">
              <div className="bg-[#0b0b0b] p-2 items-center max-w-[95%] justify-center h-8 flex rounded-lg gap-3">
              <div
                className="flex overflow-x-scroll remove-scrollbar gap-2"
              >
                {["Online", "Both", "Offline"].map((club, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTypeClick(idx)}
                    className={`text-white text-center rounded-md min-w-[7rem] cursor-pointer ${
                        selectedType === idx ? "bg-[#222222]" : "bg-transparent"
                    }`}
                  >
                    {club}
                  </div>
                ))}
              </div>
              </div>
              <div className="bg-[#0b0b0b] p-2 items-center w-[95%] h-8 flex rounded-lg gap-3">
              <div
                className="flex overflow-x-scroll remove-scrollbar gap-2"
              >
                {["Upcoming", "Past", "All"].map((club, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTimeClick(idx)}
                    className={`text-white text-center rounded-md min-w-[7rem] cursor-pointer ${
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
