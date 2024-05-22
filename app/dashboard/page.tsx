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
  const [userData, setUserData] = useState<UserType | ClubType>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [infoText, setInfoText] = useState(<></>);
  const [formData, setFormData] = useState<FormData>();

  useEffect(() => {
    if (!user) {
      location.href = "/?signin1";
      return;
    }
    getProfileData(user).then((data: any) => {
      console.log(data);
      if (data.data.role == "Student") {
        location.href = "/profile";
      }
      if (!data.ok) {
        setOpenSignin(true);
      } else {
        setUserData(data.data);
      }
      setLoading(false);
    });
  }, []);

  function getUserAvatar(user: any): string {
    return user?.photoURL ? user.photoURL.replace("s96-c", "s384-c") : "";
  }
  function isClub(user: UserType | ClubType): user is ClubType {
    return (user as ClubType).about !== undefined;
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...(formData as FormData),
          coverImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...(formData as FormData), [id]: value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...(formData as FormData), [id]: value });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend Works
    console.log(formData);
  };

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
              {userData && isClub(userData) ? (
                <p className="md:text-md">{userData.about}</p>
              ) : null}
            </div>
          </div>
          <div>
            <Dialog>
              <DialogTrigger className="btn">Create Event</DialogTrigger>
              <DialogContent className="sm:max-w-[425px] transition-all duration-200 ease-in-out">
                <form
                  onSubmit={handleFormSubmit}
                  className={
                    "grid items-center justify-center gap-4 transition-all duration-200 ease-in-out"
                  }
                >
                  <Label className="border-l-2  p-2">Create an Event </Label>
                  <div className="grid gap-2 grid-flow-col">
                    <div className="grid gap-2 ">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        className="dark:bg-[#121212] bg-[#ffff]"
                        id="eventName"
                        type="text"
                        placeholder="Gen Ai Workshop"
                        onChange={handleInputChange}
                        min={1}
                        required
                      />
                      <Label htmlFor="eventDescription">
                        Event Description
                      </Label>
                      <Textarea
                        className="dark:bg-[#121212] bg-[#ffff]"
                        id="eventDescription"
                        placeholder="Gen Ai Workshop"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2 grid-flow-col">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="coverImage">Cover Image</Label>
                      <Input
                        id="coverImage"
                        type="file"
                        onChange={handleFileInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
                    <div className="grid gap-2 grid-flow-row ">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        className="dark:bg-[#121212] bg-[#ffff]"
                        id="date"
                        type="date"
                        min={1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2 grid-flow-row">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        className="dark:bg-[#121212] bg-[#ffff]"
                        id="time"
                        type="time"
                        min={1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <RadioGroup className="flex flex-row">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="online"
                          id="eventType"
                          checked={formData?.eventType === "online"}
                          onChange={handleRadioChange}
                        />
                        <Label htmlFor="option-one">Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          value="offline"
                          id="eventType"
                          type="radio"
                          checked={formData?.eventType === "offline"}
                          onChange={handleRadioChange}
                        />
                        <Label htmlFor="option-two">Offline</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      className="dark:bg-[#121212]  bg-[#ffff]"
                      id="venue"
                      type="text"
                      placeholder="Golden Jubliee Hall"
                      min={1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                    <Label htmlFor="rsvpType">RSVP Type</Label>
                    <a href="/policies/aboutrsvp" target="_blank" className="underline text-[13px] hover:no-underline">What is this?</a>
                    </div>
                    <RadioGroup className="flex flex-row">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="int-rsvp"
                          id="rsvpType"
                          checked={formData?.rsvpType === "int-rsvp"}
                          onChange={handleRadioChange}
                        />
                        <Label htmlFor="option-one">Internal RSVP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          value="ext-rsvp"
                          id="rsvpType"
                          type="radio"
                          checked={formData?.rsvpType === "ext-rsvp"}
                          onChange={handleRadioChange}
                        />
                        <Label htmlFor="option-two">External RSVP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          value="no-rsvp"
                          id="rsvpType"
                          type="radio"
                          checked={formData?.rsvpType === "no-rsvp"}
                          onChange={handleRadioChange}
                        />
                        <Label htmlFor="option-two">No RSVP</Label>
                      </div>
                    </RadioGroup>
                    {formData && formData.rsvpType === "ext-rsvp" ? (
                      <div className="transition-all duration-200 ease-in-out">
                        <Label htmlFor="rsvpLink">RSVP Link</Label>
                        <Input
                          className="dark:bg-[#121212] bg-[#ffff]"
                          id="rsvpLink"
                          type="url"
                          placeholder="include protocols(http:// or https://)"
                          min={1}
                          onChange={handleInputChange}
                          required
                        />{" "}
                      </div>
                    ) : null}
                  </div>
                  <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                  >
                    Finish Sign up &rarr;
                    <BottomGradient />
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="py-7">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="upcoming" >Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="w-full">
              <div className="flex gap-2 flex-col items-center w-full">
                <MdUpcoming size={40} />
                <p className="text-lg font-bold">
                  No New Events right now.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="past">Change your password here.</TabsContent>
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
  setInfoText,
  club,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoText: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
  club: string;
}) {
  const user = useAuthContext();
  const [userEvents, setUserEvents] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | null
  >();

  useEffect(() => {
    if (!user) return;
    getClubEvents(user, club).then((data) => {
      data?.length == 0
        ? setUserEvents(null)
        : setUserEvents(
            data as unknown as
              | QueryDocumentSnapshot<DocumentData, DocumentData>[]
              | null
          );
      setLoading(false);
      setInfoText(
        <>
          You Attended <span className="font-bold">{data?.length}</span>{" "}
          event(s) so far.
        </>
      );
    });
  }, []);

  return (
    <>
      <h1 className="sm:text-2xl text-xl ">Events Attended</h1>
      {!userEvents ? (
        <div className="flex items-center justify-center flex-col h-full">
          <h2 className="text-5xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t
          been to any events so far.{" "}
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
