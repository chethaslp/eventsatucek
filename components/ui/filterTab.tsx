import { Search } from "lucide-react";
import React from "react";

function FilterTab() {
  return (
    <div className="bg-black flex justify-center items-center pt-8">
      <div className="w-[70%] h-24 bg-[#515050] p-2 rounded-sm">
        <div>
          <div className="flex items-center justify-center">
            <div className="bg-[#0b0b0b] p-2 items-center w-[95%] h-8 flex rounded-lg gap-3">
              <Search color="white"/>
              <input className="bg-[#0b0b0b] w-full outline-none focus:outline-none text-white" type="text" placeholder="Search clubs"  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterTab;
