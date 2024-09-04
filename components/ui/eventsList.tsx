import React from "react";

function EventsList({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-black flex justify-center items-center pt-8 pb-16">
      <div className="md:w-[65%] w-[90%] p-2 text-center flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
}

export default EventsList;
