"use client";
import { useAuthContext } from "@/components/context/auth";
import { SigninDialog } from "@/components/dialog/signin-dialog";
import {
  getClub,
  getClubEvents,
  getProfileData,
  getUser,
  getUserEvents,
} from "@/components/fb/db";
import { ClubType, Event, Event_User, UserType } from "@/lib/types";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { resolveClubIcon } from "@/lib/utils";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { ListRsvpDialog } from "@/components/dialog/list-rsvp-dialog";
import { CheckInDialog } from "@/components/dialog/checkin-dialog";

function Page() {
  const user = useAuthContext();
  const [userData, setUserData] = useState<UserType | null>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [openRsvpDialog, setOpenRsvpDialog] = useState(false);
  const [openCheckInDialog, setOpenCheckInDialog] = useState(false);
  const [crntEvent, setCrntEvent] = useState<Event>();

  useEffect(() => {
    if (!user) {
      location.href = "/profile?r=/dashboard";
      return;
    }
    getProfileData(user).then((data: any) => {

      if (!data.ok) {
        location.href = "/profile?r=/dashboard";
        return;
      }
      
      if (!data.club){
        location.href = "/profile"
        return;
      }
      setUserData(data.data);
      setLoading(false);
    });
  }, []);

  function getUserAvatar(user: any): string {
    return user?.photoURL ? user.photoURL.replace("s96-c", "s384-c") : "";
  }
  function isClub(user: UserType | ClubType): user is ClubType {
    return (user as ClubType).about !== undefined;
  }

  if (loading) return <Loading msg={"Launching dashboard..."} />;

  return openSignin || !user ? (
    <SigninDialog
      open={true}
      setOpen={function (value: React.SetStateAction<boolean>): void {}}
    />
  ) : (
    <div className="flex h-full flex-col dark:bg-[#0a0a0a]">
      <Navbar />

      {openRsvpDialog && crntEvent && (<ListRsvpDialog open={openRsvpDialog} setOpen={setOpenRsvpDialog} evnt={crntEvent} />)}
      {openCheckInDialog && crntEvent && (<CheckInDialog open={openCheckInDialog} setOpen={setOpenCheckInDialog} evnt={crntEvent} />)}
      

      <div className="mt-20 p-16 flex-1 flex-col dark:bg-[#0a0a0a]">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row items-center gap-5">
            <img
              className="w-20 rounded-full"
              src={getUserAvatar(user) || ""}
            />
            <div className="flex flex-col">
              <p className="md:text-2xl font-semibold">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">
                You are now accessing event records of <span className="font-bold">{userData?.club}</span>
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="py-7 w-full">
        <h1 className="sm:text-2xl text-xl mb-3 ">Events Hosted</h1>
          <Tabs defaultValue="upcoming" className="w-full flex-1 h-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="w-full h-full">
              <div className="flex gap-2 flex-col items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  setCrntEvent={setCrntEvent}
                  setOpenRsvpDialog={setOpenRsvpDialog}
                  setOpenCheckInDialog={setOpenCheckInDialog}
                  type="upcoming"
                  club={userData?.club || ""}
                />
              </div>
            </TabsContent>
            <TabsContent value="past"><div className="flex gap-2 flex-col h-full items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  setCrntEvent={setCrntEvent}
                  setOpenRsvpDialog={setOpenRsvpDialog}
                  setOpenCheckInDialog={setOpenCheckInDialog}
                  type="past"
                  club={userData?.club || ""}
                />
              </div>
              </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

// Function to return Club's Events
function ClubEvents({
  setLoading,
  type,
  setCrntEvent,
  setOpenRsvpDialog,
  setOpenCheckInDialog,
  club,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCrntEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setOpenRsvpDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCheckInDialog: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'upcoming' | 'past';
  club: string;
}) {
  const user = useAuthContext();
  const [userEvents, setUserEvents] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | null
  >();

  useEffect(() => {
    if (!user) return;
    getClubEvents(type, club).then((data) => {
      data?.length == 0
        ? setUserEvents(null)
        : setUserEvents(
            data as unknown as
              | QueryDocumentSnapshot<DocumentData, DocumentData>[]
              | null
          );
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!userEvents ? (
        <div className="flex items-center justify-center flex-col h-full w-full">
          <h2 className="text-5xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t
          hosted any events so far.{" "}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr className="dark:text-white ">
                <th className="px-1 sm:px-4">Event</th>
                <th className="px-1 sm:px-4">Date</th>
                <th className="px-1 sm:px-4">Status</th>
                <th className="px-1 sm:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userEvents.map((evntData) => {
                const evnt = evntData.data() as Event;
                return (
                  <tr key={evnt.evntID}>
                    <td className="px-1 sm:px-4">
                      <div
                        className="font-bold underline cursor-pointer hover:no-underline"
                        onClick={() =>
                          (location.href = `/e/${evnt.evntID}`)
                        }
                      >
                        {evnt.title}
                      </div>
                    </td>
                    <td className="px-1 sm:px-4">{(evnt.dt as Timestamp).toDate().toLocaleString()}</td>
                    <td className="px-1 sm:px-4">
                      <span
                        className={`badge badge-ghost capitalize badge-sm text-white p-2 ${
                          evnt.rsvp.status == "open"
                            ? "bg-green-700"
                            : "bg-red-700"
                        }`}
                      >
                        {evnt.rsvp.status}
                      </span>
                      <span
                        className={`badge badge-ghost badge-sm capitalize text-white p-2 ${
                          evnt.rsvp.type == "internal"
                            ? "bg-green-700"
                            : (evnt.rsvp.type == "external")? "bg-blue-700" : ""
                        }`}
                      >
                        RSVP: {evnt.rsvp.type}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <Link href={evnt.editLink} target="_blank"><Button variant={"outline"}>Edit Event</Button></Link>
                      {evnt.rsvp.type != "none" && <Button variant={"outline"} onClick={()=>{
                        setCrntEvent(evnt)
                        setOpenRsvpDialog(true)
                      }}>View RSVP</Button>}
                      {evnt.rsvp.type != "none" && evnt.rsvp.status == "open" && <Button variant={"secondary"} onClick={()=>{
                        setCrntEvent(evnt)
                        setOpenCheckInDialog(true)
                      }}>Check-in</Button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Page;
