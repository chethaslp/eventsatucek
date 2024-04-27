import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import React from "react";
import { MdUpcoming } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";
function NoEvents() {
  return (
    <div className="h-full">
      <Navbar />
      <div className="justify-center gap-2 flex items-center h-[26rem] md:h-[30rem] flex-col">
        <div className="flex gap-2 items-center">
          <p>New Events Coming soon</p>
          <MdUpcoming />
        </div>
        <div className="flex items-center">
          Checkout our &nbsp;{" "}
          <Link className="flex underline items-center" href={"/event/past"}>
            Past Events
            <GoLinkExternal size={15} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NoEvents;
