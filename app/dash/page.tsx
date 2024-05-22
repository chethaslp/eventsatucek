"use client";
import { useAuthContext } from "@/components/context/auth";
import { SigninDialog } from "@/components/dialog/signin-dialog";
import { getClub, getClubEvents, getProfileData, getUser, getUserEvents } from "@/components/fb/db";
import { ClubType, Event, Event_User, UserType } from "@/lib/types";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { resolveClubIcon } from "@/lib/utils";
import Image from "next/image";
import Loading from "@/components/ui/Loading";

function Page() {
  const user = useAuthContext();

  const [userData, setUserData] = useState<UserType | ClubType>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [infoText, setInfoText] = useState(<></>);

  useEffect(() => {
    if (!user) {
      location.href = "/?signin1";
      return;
    }
    getProfileData(user).then((data: any) => {
      console.log(data);
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
  

  // Profile Page
  if (loading) return <Loading msg={"Getting your profile..."} />;

  return openSignin || !user ? (
    <SigninDialog
      open={true}
      setOpen={function (value: React.SetStateAction<boolean>): void {}}
    />
  ) : (
    <div className="flex h-full flex-col dark:bg-[#0a0a0a]">
      <Navbar />
      <div className="mt-40 flex flex-1 flex-col sm:flex-row items-center md:items-start dark:bg-[#0a0a0a]">
        <div className="flex flex-col px-16 py-8">
          <div className="avatar">
            <div className="w-44 h-44 rounded-full">
              <img src={getUserAvatar(user) || ""} />
            </div>
          </div>
          <h2 className="text-xl mt-1 font-semibold">{user.displayName}</h2>
          <p className="text-muted-foreground">{userData?.role}</p>
          <div className="mt-4 border-l-4 text-muted-foreground p-1 border-blue-700 pl-3 w-40">
            <h2 className="text-md font-semibold mb-2 dark:text-white">
              ABOUT
            </h2>
            {userData && isClub(userData) ? (
                <p>{userData.about}</p>
            ) : (
              <p>
              {userData?.batch} ({userData?.admYear} Admission)
              <p>Roll Number: {userData?.rollNumber}</p>
            </p>
            )}
            
          </div>
        </div>

        <Separator
          orientation="vertical"
          className=" max-h-fit hidden md:flex"
        />

        <div className="px-3 py-5 sm:px-10 sm:py-5 md:px-16 md:py-8 flex flex-1 h-full flex-col">
          {userData?.role == "Club" ? (
            <ClubEvents />
          ) : (
            <UserEvents setLoading={setLoading} setInfoText={setInfoText} />
          )}
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

// Function to return Club's Events
function ClubEvents({ setLoading, setInfoText, club }: { setLoading: React.Dispatch<React.SetStateAction<boolean>>; setInfoText: React.Dispatch<React.SetStateAction<React.JSX.Element>>; club:string}) {
  
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
