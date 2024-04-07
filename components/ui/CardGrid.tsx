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
    <div className="w-[90%] justify-items-center grid md:gap-x-1 gap-y-6  md:grid-cols-3 mb-10">
      {children}
    </div>
  );
};
export default CardGrid;
