"use client";
import { useAuthContext } from "@/components/context/auth";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import React, { useEffect } from "react";

function Page() {

  const user = useAuthContext()

  return (
    <>
      <Navbar />
      <div className="px-16 py-20   md:px-32 md:py-28 dark:bg-[#0a0a0a]">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          RSVP in Events@UCEK
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          RSVP options for events at UCEK include Internal RSVP, External RSVP,
          or No RSVP.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Internal RSVP
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Events@UCEK has an comprehensive internal RSVP service which includes
          the following benefits:-
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li> Users can RSVP directly in the events with a single click of a button, and hosts can view live data about the RSVP,  in the club pages.</li>
          <li>Users will receive confirmation mails automatically.</li>
          <li>Clubs can sent mails to all registered users.</li>
          <li>Host can export attendee data as CSV files.</li>
          <li>Hosts can enable check-ins where user specific QR Codes are scanned (in Offline events) to confirm their attendance.</li>
        </ul>


        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        External RSVP
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
        Events@UCEK will mark the user as &apos;Registered (to that event)&apos; and redirects the user to the external RSVP link that you provide.
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Users who have RSVP&apos;d, will be saved in the database, you can access it in the club page.</li>
          <li>Still, the completion of external RSVP cannot be ensured by our site.</li>
        </ul>


        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        No RSVP
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
        This option will disable RSVP service, the RSVP button will be removed from the event&apos;s page.
        </p>
      </div>
      <Footer/>
    </>
  );
}

export default Page;
