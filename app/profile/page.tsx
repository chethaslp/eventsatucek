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
import { Edit, ScanLine, Calendar, MapPin, Users, Trophy, Clock, ExternalLink, UserCheck2 } from "lucide-react";
import { resolveClubIcon, parseDate } from "@/lib/utils";
import { CheckInDialog } from "@/components/dialog/checkin-dialog";

function Page() {
  const user = useAuthContext();

  const [userData, setUserData] = useState<UserType>();
  const [loading, setLoading] = useState(true);
  const [openSignin, setOpenSignin] = useState(false);
  const [isUcek, setIsUcek] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [qrScanner, setQrScanner] = useState(false);
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

      {qrScanner && userData && (
        <CheckInDialog
          lateral={true}
          open={qrScanner}
          setOpen={setQrScanner}
          evnt={null}
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
                className="absolute left-5 tooltip cursor-pointer"
                data-tip="Edit profile"
                onClick={() => setQrScanner(true)}
              >
                <ScanLine color="white" size={20} />
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

  // Helper function to determine display status
  const getDisplayStatus = (evnt: Event_User): string => {
    if (evnt.status === "Registered") {
      const eventDate = parseDate(evnt.dt);
      const currentDate = new Date();
      if (currentDate > eventDate) {
        return "Missed";
      }
    }
    return evnt.status;
  };

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="sm:text-2xl text-xl font-bold flex items-center gap-2">
          Your Events
        </h1>
        {userEvents && userEvents.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 backdrop-blur-sm bg-white/10 dark:bg-white/5 px-3 py-1.5 rounded-full border border-white/20 dark:border-white/10">
            {userEvents.length} event{userEvents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {!userEvents ? (
        <div className="flex items-center justify-center flex-col h-full py-16">
          <div className="text-8xl mb-4">🎪</div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-center">No Events Yet!</h2>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't attended any events so far. Start exploring and join exciting events!
          </p>
        </div>
      ) : (
        <div className="w-full">
          {/* Enhanced Cards for Mobile and Tablet View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
            {userEvents.map((evntData) => {
              const evnt = evntData.data() as Event_User;
              return (
                <div
                  key={evnt.evntID}
                  className="group backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 dark:border-white/10 overflow-hidden hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-white/10 p-3 shadow-lg border border-white/30 dark:border-white/20">
                          <Image
                            width={40}
                            height={40}
                            referrerPolicy={"no-referrer"}
                            src={resolveClubIcon(evnt.club)}
                            alt={evnt.club}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                          {evnt.club}
                        </div>
                        <h3
                          className="font-bold text-lg leading-tight cursor-pointer text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                          onClick={() => (location.href = `/e/${evnt.evntID}`)}
                        >
                          {evnt.evntName}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{parseDate(evnt.dt).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>{parseDate(evnt.dt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border ${
                          getDisplayStatus(evnt) === "Attended"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                            : getDisplayStatus(evnt) === "Registered" 
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
                            : getDisplayStatus(evnt) === "Missed"
                            ? "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
                            : "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30"
                        }`}
                      >
                        {getDisplayStatus(evnt) === "Attended" && <UserCheck2 className="h-3 w-3" />}
                        {getDisplayStatus(evnt) === "Registered" && <Users className="h-3 w-3" />}
                        {getDisplayStatus(evnt) === "Missed" && <Clock className="h-3 w-3" />}
                        {getDisplayStatus(evnt)}
                      </span>
                      
                      <button
                        onClick={() => (location.href = `/e/${evnt.evntID}`)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 backdrop-blur-sm bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 p-2 rounded-full border border-white/20"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Table for Desktop View */}
          <div className="hidden lg:block backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-2xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="backdrop-blur-sm bg-white/20 dark:bg-white/10 border-b border-white/20 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Club
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Event
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Date & Time
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {userEvents.map((evntData, index) => {
                    const evnt = evntData.data() as Event_User;
                    return (
                      <tr 
                        key={evnt.evntID} 
                        className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors backdrop-blur-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl backdrop-blur-sm bg-white/20 dark:bg-white/10 p-2 shadow-lg border border-white/30 dark:border-white/20">
                              <Image
                                width={32}
                                height={32}
                                referrerPolicy={"no-referrer"}
                                src={resolveClubIcon(evnt.club)}
                                alt={evnt.club}
                                className="w-full h-full object-contain rounded"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {evnt.club}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 max-w-xs"
                            onClick={() => (location.href = `/e/${evnt.evntID}`)}
                          >
                            {evnt.evntName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">
                            {parseDate(evnt.dt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {parseDate(evnt.dt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border ${
                              getDisplayStatus(evnt) === "Attended"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                                : getDisplayStatus(evnt) === "Registered"
                                ? "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
                                : getDisplayStatus(evnt) === "Missed"
                                ? "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
                                : "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {getDisplayStatus(evnt) === "Attended" && <Trophy className="h-3 w-3" />}
                            {getDisplayStatus(evnt) === "Registered" && <Users className="h-3 w-3" />}
                            {getDisplayStatus(evnt) === "Missed" && <Clock className="h-3 w-3" />}
                            {getDisplayStatus(evnt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => (location.href = `/e/${evnt.evntID}`)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors backdrop-blur-sm bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 p-2 rounded-full border border-white/20"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
