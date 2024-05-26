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
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomGradient from "@/components/ui/BottomGradient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MdUpcoming } from "react-icons/md";

function Page() {
  interface FormData {
    eventName: string;
    eventDescription: string;
    coverImage: string;
    date: string;
    time: string;
    eventType: string;
    venue: string;
    rsvpType?: string;
    rsvpLink?: string;
    // Add more fields as needed
  }

  const user = useAuthContext();
  const [userData, setUserData] = useState<UserType | null>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [infoText, setInfoText] = useState(<></>);
  const [formData, setFormData] = useState<FormData>();

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
      <div className="mt-20 p-16 flex flex-col dark:bg-[#0a0a0a]">
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
        <div className="py-7">
        <h1 className="sm:text-2xl text-xl mb-3 ">Events Hosted</h1>
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList defaultValue={"upcoming"} defaultChecked={true}>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="w-full">
              <div className="flex gap-2 flex-col items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  type="upcoming"
                  club={userData?.club || ""}
                />
              </div>
            </TabsContent>
            <TabsContent value="past"><div className="flex gap-2 flex-col items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
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
  club,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
        <div className="flex items-center justify-center flex-col h-full">
          <h2 className="text-5xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t
          hosted any events so far.{" "}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="dark:text-white ">
                <th className="px-1 sm:px-4">Club</th>
                <th className="px-1 sm:px-4">Event</th>
                <th className="px-1 sm:px-4">Date</th>
                <th className="px-1 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {userEvents.map((evntData) => {
                const evnt = evntData.data() as Event_User;
                return (
                  <tr key={evnt.evntID}>
                    <td className="px-1 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-xs flex items-center flex-row text-muted-foreground">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              width={48}
                              height={48}
                              referrerPolicy={"no-referrer"}
                              src={resolveClubIcon(evnt.club, false)}
                              alt={evnt.club}
                            />
                          </div>
                          <span className="hidden sm:block">{evnt.club}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 sm:px-4">
                      <div
                        className="font-bold underline cursor-pointer hover:no-underline"
                        onClick={() =>
                          (location.href = `/event/${evnt.evntID}`)
                        }
                      >
                        {evnt.evntName}
                      </div>
                    </td>
                    <td className="px-1 sm:px-4">{evnt.dt.split(" ")[0]}</td>
                    <td className="px-1 sm:px-4">
                      <span
                        className={`badge badge-ghost badge-sm text-white p-2 ${
                          evnt.status == "Registered"
                            ? "bg-green-700"
                            : "bg-blue-700"
                        }`}
                      >
                        {evnt.status}
                      </span>
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
