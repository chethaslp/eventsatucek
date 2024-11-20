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
import Loading from "@/components/ui/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { ListRsvpDialog } from "@/components/dialog/list-rsvp-dialog";
import { CheckInDialog } from "@/components/dialog/checkin-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { getImgLink } from "@/lib/data";
import Image from "next/image";
import { Edit, Edit2Icon, View } from "lucide-react";

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

      if (!data.club) {
        location.href = "/profile";
        return;
      }
      setUserData(data.data);
      setLoading(false);
    });
  }, []);

  function getUserAvatar(user: any): string {
    return user?.photoURL ? user.photoURL.replace("s96-c", "s384-c") : "";
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

      {openRsvpDialog && crntEvent && (
        <ListRsvpDialog
          open={openRsvpDialog}
          setOpen={setOpenRsvpDialog}
          evnt={crntEvent}
        />
      )}
      {openCheckInDialog && crntEvent && (
        <CheckInDialog
          open={openCheckInDialog}
          setOpen={setOpenCheckInDialog}
          evnt={crntEvent}
        />
      )}

      
      {/* {openAddMemberDialog && <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Club Member</DialogTitle>
            <DialogDescription>Add a new member to your club.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="member@uck.ac.in" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="club">Select Club</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {getClubs.map((clb)=><SelectItem value={clb}>{clb}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>} */}

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
                You are now accessing event records of{" "}
                <span className="font-bold">{userData?.club}</span>
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="py-7 w-full">
          <div className="flex justify-between">
            <h1 className="sm:text-2xl text-xl mb-3 ">Events Hosted</h1>
            <Button
              variant="default"
              onClick={() =>
                (location.href =
                  "https://docs.google.com/forms/d/e/1FAIpQLSchkVsDZD5FysBkRhokE2QGTTKrs_CqnXRt1EXGuF3DpDhCxw/viewform")
              }
            >
              Add event
            </Button>
          </div>
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
                  userData={userData}
                />
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="flex gap-2 flex-col h-full items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  setCrntEvent={setCrntEvent}
                  setOpenRsvpDialog={setOpenRsvpDialog}
                  setOpenCheckInDialog={setOpenCheckInDialog}
                  type="past"
                  club={userData?.club || ""}
                  userData={userData}
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
  userData
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCrntEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setOpenRsvpDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCheckInDialog: React.Dispatch<React.SetStateAction<boolean>>;
  type: "upcoming" | "past";
  club: string;
  userData?: UserType | null;
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
          <h2 className="text-5xl md:text-6xl">Whaaaaat?</h2>
          {type == "upcoming"
            ? "You aren't hosting any events right now."
            : "You haven&'t hosted any events so far."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {userEvents.map((evntData) => {
            const evnt = evntData.data() as Event;
            return (
              <div key={evnt.evntID} className="card flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <Image 
                  src={getImgLink(evnt.img) || '/default-event-cover.jpg'} 
                  alt={evnt.title}
                  height={192}
                  width={320}
                  className="w-48 h-48 object-cover hidden md:block"
                />
                <div className="p-4 flex justify-between w-full">
                  <div>
                    <div 
                      className="font-bold text-lg transition-colors cursor-pointer hover:text-blue-600"
                      onClick={() => (location.href = `/e/${evnt.evntID}`)}
                    >
                      {evnt.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {(evnt.dt as Timestamp).toDate().toLocaleString()}
                    </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs text-white ${
                        evnt.rsvp.status == "open"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {evnt.rsvp.status.replace("open", "Visible to All").replace("closed", "Private")}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs text-white ${
                        evnt.rsvp.type == "internal"
                          ? "bg-green-700"
                          : evnt.rsvp.type == "external"
                          ? "bg-blue-700"
                          : "bg-slate-700"
                      }`}
                    >
                      RSVP: {evnt.rsvp.type}
                    </span>
                  </div>
                  
                  </div>


                  <div className="flex flex-wrap flex-col gap-2 mt-3 items-end">
                    {(userData?.role == "Club Lead" || userData?.role == "Admin") &&
                      <Link href={evnt.editLink} target="_blank">
                        <Button variant={"ghost"} size="sm" className="flex items-center gap-1 border-b border-slate-700 text-white"><Edit size={15}/> Edit Event</Button>
                      </Link>
                    }
                    {(userData?.role == "Club Lead" || userData?.role == "Admin") && evnt.rsvp.type != "none" && (
                      <Button
                        variant={"ghost"}
                        size="sm"
                        className="border-b border-slate-700"
                        onClick={() => {
                          setCrntEvent(evnt);
                          setOpenRsvpDialog(true);
                        }}
                      >
                        <View size={16} className="mr-2" />
                        View Info
                      </Button>
                    )}
                    {evnt.rsvp.type != "none" &&
                      evnt.rsvp.status == "open" && (
                        <Button
                          variant={"ghost"}
                          className=" text-white border-b border-slate-700"
                          size="sm"
                          onClick={() => {
                            setCrntEvent(evnt);
                            setOpenCheckInDialog(true);
                          }}
                        >
                          <MdOutlineQrCodeScanner size={16} className="mr-2" />
                          Check-in
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Page;
