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
import { Edit, Edit2Icon, QrCode, View } from "lucide-react";
import { TicketDialog } from "@/components/dialog/ticket-dialog";

function Page() {
  const user = useAuthContext();
  const [userData, setUserData] = useState<UserType | null>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [openRsvpDialog, setOpenRsvpDialog] = useState(false);
  const [openLateralCheckInDialog, setOpenLateralCheckInDialog] = useState(false);
  const [openCheckInDialog, setOpenCheckInDialog] = useState(false);
  const [crntEvent, setCrntEvent] = useState<Event>();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

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
          lateral={false}
          userData={null}
          open={openCheckInDialog}
          setOpen={setOpenCheckInDialog}
          evnt={crntEvent}
        />
      )}

      {openLateralCheckInDialog && crntEvent && (
        <TicketDialog
          open={openLateralCheckInDialog}
          setOpen={setOpenLateralCheckInDialog}
          evnt={[crntEvent.title, crntEvent.evntID, "", crntEvent.title, "", crntEvent.img, "Lateral Check-in"]}
          lateralCheckin={true}
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

      <div className="mt-20 p-5 md:p-16 flex-1 flex-col dark:bg-[#0a0a0a]">
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "past")} className="w-full flex-1 h-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="w-full h-full">
              <div className="flex flex-col items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  setCrntEvent={setCrntEvent}
                  setOpenRsvpDialog={setOpenRsvpDialog}
                  setOpenCheckInDialog={setOpenCheckInDialog}
                  setOpenLateralCheckInDialog={setOpenLateralCheckInDialog}
                  type="upcoming"
                  club={userData?.club || ""}
                  userData={userData}
                  setActiveTab={setActiveTab}
                />
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="flex flex-col h-full items-center w-full">
                <ClubEvents
                  setLoading={setLoading}
                  setCrntEvent={setCrntEvent}
                  setOpenRsvpDialog={setOpenRsvpDialog}
                  setOpenLateralCheckInDialog={setOpenLateralCheckInDialog}
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
  setOpenLateralCheckInDialog,
  club,
  userData,
  setActiveTab
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCrntEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setOpenRsvpDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLateralCheckInDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCheckInDialog: React.Dispatch<React.SetStateAction<boolean>>;
  type: "upcoming" | "past";
  club: string;
  userData?: UserType | null;
  setActiveTab?: React.Dispatch<React.SetStateAction<"upcoming" | "past">>;
}) {
  const user = useAuthContext();
  const [userEvents, setUserEvents] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | null
  >();

  useEffect(() => {
    if (!user) return;
    getClubEvents(type, club).then((data) => {
      const events = data as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>[] | null;
      
      if (events?.length === 0 || !events) {
        setUserEvents(null);
        if (type === "upcoming" && setActiveTab) {
              setActiveTab("past");
        }
      } else {
        setUserEvents(events);
      }
      
      setLoading(false);
    });
  }, [user, type, club]);

  return (
    <>
      {!userEvents ? (
        <div className="flex items-center justify-center flex-col h-full w-full py-16">
          <div className="text-8xl mb-4">
            {type === "upcoming" ? "📅" : "📚"}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-center">
            {type === "upcoming" ? "No Upcoming Events" : "No Past Events"}
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {type === "upcoming"
              ? "You aren't hosting any events right now. Create your first event to get started!"
              : "You haven't hosted any events so far. Your past events will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {userEvents.map((evntData) => {
            const evnt = evntData.data() as Event;
            return (
              <div key={evnt.evntID} className="group backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 dark:border-white/10 overflow-hidden hover:bg-white/20 dark:hover:bg-white/10 flex min-h-[180px]">
                <div className="relative w-40 flex-shrink-0">
                  <Image 
                    src={getImgLink(evnt.img) || '/default-event-cover.jpg'} 
                    alt={evnt.title}
                    height={200}
                    width={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        evnt.rsvp.status === "open"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {evnt.rsvp.status.replace("open", "Public").replace("closed", "Private")}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        evnt.rsvp.type === "internal"
                          ? "bg-blue-600 text-white"
                          : evnt.rsvp.type === "external"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {evnt.rsvp.type === "internal" ? "Internal RSVP" : evnt.rsvp.type === "external" ? "External RSVP" : "No RSVP"}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 
                      className="font-bold text-lg leading-tight cursor-pointer text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1"
                      onClick={() => (location.href = `/e/${evnt.evntID}`)}
                    >
                      {evnt.title}
                    </h3>
                    <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                      </svg>
                      {(evnt.dt as Timestamp).toDate().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                    {(userData?.role === "Club Lead" || userData?.role === "Admin") && (
                      <Link href={evnt.editLink} target="_blank">
                        <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950">
                          <Edit size={12}/>
                          Edit
                        </Button>
                      </Link>
                    )}
                    
                    {(userData?.role === "Club Lead" || userData?.role === "Admin") && evnt.rsvp.type !== "none" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-xs hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950"
                        onClick={() => {
                            setCrntEvent(evnt);
                            setOpenLateralCheckInDialog(true);
                          }}
                      >
                        <QrCode size={14} className="mr-1" />
                        Lateral
                      </Button>
                       
                    )}
                  </div>

                  {evnt.rsvp.type !== "none" && evnt.rsvp.status === "open" && (
                    <div className="flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => {
                          setCrntEvent(evnt);
                          setOpenCheckInDialog(true);
                        }}
                      >
                        <MdOutlineQrCodeScanner size={14} className="mr-1" />
                        Check-in
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                         onClick={() => {
                          setCrntEvent(evnt);
                          setOpenRsvpDialog(true);
                        }}
                      >
                       <View size={12} className="mr-1" />
                        RSVPs
                      </Button>
                    </div>
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
