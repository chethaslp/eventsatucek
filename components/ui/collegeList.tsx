"use client";

import * as React from "react";
import { Check, CheckIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CollegeList({selectedOption, onSelect }:any) {
  type College = string[][];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [colleges, setColleges] = React.useState<College>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleFetchColleges = async () => {
      setLoading(true);
      setError(null);

      try {
        await fetch(`/api/getCollege`, {
          method: "POST",
        }).then(async (data) => {
          const reuslt: College = await data.json();
          console.log(reuslt);
          setColleges(reuslt);
          console.log(colleges);
        });
      } catch (err) {
        setError("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };

    handleFetchColleges();
  }, []);

  React.useEffect(() => {
    console.log(colleges);
  }, [colleges]);


  const test = ["pari", "dada"];
  return (
    <div className="relative">
    <select
      value={selectedOption}
      onChange={(e) => onSelect(e.target.value)}
      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
    >
      {colleges.map((college,idx) => (
        <option key={idx} value={college[2]}>
          {college[2]}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg
        className="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
  );
}
