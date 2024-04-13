import React from "react";
import { cn } from "@/lib/utils";

const CardGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className=" md:w-[90%] w-full justify-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-x-4 gap-y-6 mb-10">
      {children}  
    </div>
  );
};
export default CardGrid;
