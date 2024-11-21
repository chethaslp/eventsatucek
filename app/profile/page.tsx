"use client";
import { useAuthContext } from "@/components/context/auth";
import { SigninDialog } from "@/components/dialog/signin-dialog";
import { EditDialog } from "@/components/dialog/edit-dialog";
import { getProfileData, getUser, getUserEvents } from "@/components/fb/db";
import { ClubType, Event, Event_User, UserType } from "@/lib/types";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { signOut } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { auth } from "@/components/fb/config";
import { FaEye, FaEyeSlash, FaUserEdit } from "react-icons/fa";
import { Edit } from "lucide-react";
import { resolveClubIcon } from "@/lib/utils";

function Page() {
  const user = useAuthContext();

  const [userData, setUserData] = useState<UserType>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [isUcek, setIsUcek] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [infoText, setInfoText] = useState(<></>);

  useEffect(() => {
    if (!user) {
      setOpenSignin(true);
      setLoading(false);
      return;
    }
    getProfileData(user).then((data: any) => {
      if (!data.ok) {
        setOpenSignin(true);
      } else {
        setUserData(data.data);

        if(data.data.club && data.data.club.length > 0){
          localStorage.setItem("club", data.data.club);
        } else localStorage.removeItem("club");
        
        if (data.data.college.length == 0) {
          setIsUcek(true);
        }
      }
      setLoading(false);
    });
  }, []);

  function getUserAvatar(user: any): string {
    return user?.photoURL ? user.photoURL.replace("s96-c", "s384-c") : "";
  }

  // Profile Page
  if (loading) return <Loading msg={"Getting your profile..."} />;

  return openSignin || !user ? (
    <SigninDialog
      open={true}
      setOpen={function (value: React.SetStateAction<boolean>): void {}}
    />
  ) : (
    <>
      {editDialog && userData && (
        <EditDialog
          open={editDialog}
          setOpen={setEditDialog}
          userData={userData}
        />
      )}

      <div className="flex h-full flex-col dark:bg-[#0a0a0a]">
        <Navbar />
        <div className="mt-40 flex flex-1 flex-col sm:flex-row items-center md:items-start dark:bg-[#0a0a0a]">
          <div className="flex flex-col items-center px-4 w-full mb-3 md:mb-0 md:w-72 ">
            <div className="avatar">
              <div className="w-44 h-44 rounded-full">
                <img src={getUserAvatar(user) || ""} />
              </div>
            </div>
            <div className="relative flex items-center w-full">
              <div className="w-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center text-center">
                  <h2 className="text-xl mt-1 font-semibold">
                    {user.displayName}
                  </h2>
                  <p className="text-muted-foreground">{userData?.role}</p>
                </div>
              </div>
              <div
                className="absolute right-5 tooltip cursor-pointer"
                data-tip="Edit profile"
                onClick={() => setEditDialog(true)}
              >
                <FaUserEdit color="white" size={20} />
              </div>
            </div>
            <div className="mt-4 p-1 flex flex-col gap-2 w-full">
              <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">Email :</span>
                {user.email}
              </p>
              <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">
                  {isUcek ? "Candidate Code :" : "College :"}
                </span>
                {isUcek ? userData?.registrationNumber?.split(":")[0] : userData?.college}
              </p>
              <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">Batch :</span>
                {isUcek ? userData?.batch : userData?.branch}
                {"   "}({userData?.admYear})
              </p>
              {userData?.admissionNumber && <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">
                  Admission Number:
                </span>
                {userData?.admissionNumber}
              </p>}
              <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">
                  Wifi Username:
                </span>
                {userData?.wifiUsername ? (
                  userData.wifiUsername
                ) : (
                  <button
                    className="btn bg-black text-white hover:bg-gray-950 border-gray-900"
                    onClick={() => setEditDialog(true)}
                  >
                    Add Wifi Username
                  </button>
                )}
              </p>
              <p className="flex flex-col gap-1 border rounded-lg p-3">
                <span className="text-muted-foreground text-sm">
                  Wifi Password:
                </span>
                <div className="flex justify-between">
                  {userData?.wifiPass ? (
                    <>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={userData.wifiPass}
                        readOnly
                        className="bg-transparent border-none outline-none"
                      />
                      <button
                        type="button"
                        className=""
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn bg-black text-white hover:bg-gray-950 border-gray-900 w-full"
                      onClick={() => setEditDialog(true)}
                    >
                      Add Wifi Password
                    </button>
                  )}
                </div>
              </p>
              <p>
                <br />
                {userData?.club && (
                  <p
                    className="flex flex-col gap-1 border cursor-pointer hover:bg-slate-900 rounded-lg p-3"
                    onClick={() => (location.href = "/dashboard")}
                  >
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      Clubs you have access:{" "}
                    </span>
                    <span className="font-bold">{userData?.club}</span>
                  </p>
                )}
              </p>

              <p className="flex justify-center">{infoText}</p>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className=" max-h-fit hidden md:flex"
          />

          <div className="px-3 py-5 w-full sm:px-10 sm:py-5 md:px-16 md:py-8 flex flex-1 h-full flex-col">
            <UserEvents setLoading={setLoading} setInfoText={setInfoText} />
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}

// Function to return User's Events
function UserEvents({
  setLoading,
  setInfoText,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoText: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}) {
  const user = useAuthContext();
  const [userEvents, setUserEvents] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | null
  >();

  useEffect(() => {
    if (!user) return;
    getUserEvents(user).then((data) => {
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
          You attended&nbsp;<span className="font-bold">{data?.length}</span>{" "}
          &nbsp;event(s) so far.
        </>
      );
    });
  }, []);

  return (
    <>
      <h1 className="sm:text-2xl text-xl mb-3">Your Events</h1>
      {!userEvents ? (
        <div className="flex items-center justify-center flex-col h-full">
          <h2 className="text-3xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t
          been to any events so far.{" "}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          {/* Cards for Mobile View */}
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 gap-4 md:hidden">
            {userEvents.map((evntData) => {
              const evnt = evntData.data() as Event_User;
              return (
                <div
                  key={evnt.evntID}
                  className="bg-white w-full dark:bg-[#1f1f1f] rounded-lg shadow-md p-4"
                >
                  <div className="flex w-full flex-row items-center gap-3">
                    <div className="text-xs flex items-center flex-col text-muted-foreground">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image
                          width={48}
                          height={48}
                          referrerPolicy={"no-referrer"}
                          src={resolveClubIcon(evnt.club)}
                          alt={evnt.club}
                        />
                      </div>
                      <span className="max-w-20 line-clamp-2">{evnt.club}</span>
                    </div>

                    <div className="flex-1">
                      <div
                        className="font-bold underline cursor-pointer hover:no-underline mt-2"
                        onClick={() => (location.href = `/e/${evnt.evntID}`)}
                      >
                        {evnt.evntName}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {evnt.dt.split(" ")[0]}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`badge badge-ghost badge-sm text-white p-2 ${
                            evnt.status == "Registered"
                              ? "bg-green-700"
                              : "bg-blue-700"
                          }`}
                        >
                          {evnt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table for Desktop View */}
          <table className="table hidden md:block w-full">
            {/* head */}
            <thead>
              <tr className="dark:text-white">
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
                              src={resolveClubIcon(evnt.club)}
                              alt={evnt.club}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 sm:px-4">
                      <div
                        className="font-bold underline cursor-pointer hover:no-underline"
                        onClick={() => (location.href = `/e/${evnt.evntID}`)}
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
                            : (evnt.status == "Attended" ? "bg-green-700" : "bg-blue-700")
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
