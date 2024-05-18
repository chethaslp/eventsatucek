"use client";
import { useAuthContext } from "@/components/context/auth";
import { SigninDialog } from "@/components/dialog/signin-dialog";
import { getUser, getUserEvents } from "@/components/fb/db";
import { Event, Event_User, UserType } from "@/lib/types";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { cn, resolveClubIcon } from "@/lib/utils";
import Image from "next/image";
import Loading from "@/components/ui/Loading";

function Page() {
  const user = useAuthContext();

  const [userData, setUserData] = useState<UserType>()
  const [loading, setLoading] = useState(true)
  const [infoText, setInfoText] = useState(<></>)
  
  useEffect(()=>{
    if(!user) return
    getUser(user).then((data)=>{
      setUserData(data)
      setLoading(false)
    })
  },[])



  // Function to return Club's Events
  function ClubEvents(){
    return null;

  }
  

  // Profile Page
  if(loading) return <Loading msg={"Getting your profile..."}/>

  return !user ? (
    <SigninDialog
      open={true}
      setOpen={function (value: React.SetStateAction<boolean>): void {}}
    />
  ) : (
    <div className="flex h-full flex-col dark:bg-[#0a0a0a]">
      <Navbar />
      <div className="flex flex-1 mt-5 mr-3 flex-col sm:flex-row items-center md:items-start dark:bg-[#121212]">
          <div className="flex flex-col px-16 py-8 h-full">
            <div className="avatar">
              <div className="w-44 h-44 rounded-full">
                <img src={user.photoURL || ""} />
              </div>
            </div>
              <h2 className="text-xl mt-1 font-semibold">{user.displayName}</h2>
              <p className="text-muted-foreground">{userData?.role}</p>
              <div className="mt-4 border-l-4 text-muted-foreground p-1 border-blue-700 pl-3">
                <h2 className="text-md font-semibold mb-2 text-white">ABOUT</h2>
                <p>{userData?.batch} ({userData?.admYear} Admission)</p>
                <p>Roll Number: {userData?.rollNumber}</p>
              </div>
        </div>

        <Separator
          orientation="vertical"
          className=" max-h-fit hidden md:flex"
        />

        <div className="px-16 py-8 flex flex-1 h-full flex-col">

            {(userData?.role == "Club")?<ClubEvents/>:<UserEvents setLoading={setLoading} setInfoText={setInfoText}/>}

          </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
)}



// Function to return User's Events
function UserEvents({setLoading, setInfoText}:{setLoading:React.Dispatch<React.SetStateAction<boolean>>, setInfoText: React.Dispatch<React.SetStateAction<React.JSX.Element>>}){

  const user = useAuthContext()
  const [userEvents, setUserEvents] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[] | null>()

  useEffect(()=>{
    if(!user) return
      getUserEvents(user).then((data=> {
        (data?.length == 0)?setUserEvents(null): setUserEvents(data as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>[] | null)
        setLoading(false)
        setInfoText(<>You Attended <span className="font-bold">{data?.length}</span> event(s) so far.</>)
    }))
  },[])

 return <><h1 className="text-2xl ">Events Attended</h1>
   {(!userEvents)? <div className="flex items-center justify-center flex-col h-full"><h2 className="text-5xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t been to any events so far. </div>:
  <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th className="px-1 sm:px-4">Event</th>
        <th className="px-1 sm:px-4">Status</th>
        <th className="px-1 sm:px-4">Date</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {userEvents.map((evntData)=>{
        const evnt = evntData.data() as Event_User
        return <tr key={evnt.evntID}>
        <td className="px-1 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-row">
              <div className="mask mask-squircle w-12 h-12">
              <Image
                width={48}
                height={48}
                referrerPolicy={"no-referrer"}
                src={resolveClubIcon(evnt.club,false)}
                alt={evnt.club}
              />
              </div>
        <div className="text-xs md:text-base font-bold">{evnt.evntName}</div>
            </div>
          </div>
        </td>

        <td>
          <span className={cn("badge badge-sm md:badge-md", (evnt.status == "Attended")?"badge-success": (evnt.status == "Missed")? "badge-error": "badge-info"  )}>
            {evnt.status}
          </span>
        </td>
        <td>{evnt.dt.split(" ")[0]}</td>
        <th>
          <button onClick={()=> location.href = `/event/${evnt.evntID}`} className="btn btn-ghost btn-xs">View Details</button>
        </th>
      </tr>
    })}
    </tbody>
  </table>
</div>}
</>
  
}


export default Page;
