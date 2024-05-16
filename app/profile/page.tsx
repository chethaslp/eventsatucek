"use client";
import { useAuthContext } from "@/components/context/auth";
import { SigninDialog } from "@/components/dialog/signin-dialog";
import { UserType, getUser } from "@/components/fb/db";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";

function Page() {
  const user = useAuthContext()
  const [userData, setUserData] = useState<UserType>()

  useEffect(()=>{
    if(!user) return
    getUser(user).then((data)=>{
      setUserData(data)
    })
  })


  return (!user)?<SigninDialog open={true} setOpen={function (value: React.SetStateAction<boolean>): void {} }/>:
    <div className="flex h-full flex-col dark:bg-[#121212]">
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

        <Separator orientation="vertical" className=" max-h-fit hidden md:flex"/>

        <div className="px-16 py-8 flex flex-1 h-full flex-col">
            <h1 className="text-2xl ">Events Attented</h1>

        {(userData)? <div className="flex items-center justify-center flex-col h-full"><h2 className="text-5xl md:text-6xl">Whaaaaat?</h2> You haven&apos;t been to any events so far. </div>:
        <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Club</th>
              <th>Event</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="https://eventsatucek.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgdsc.4b395dd8.png&w=640&q=75" alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">GDSC</div>
                  </div>
                </div>
              </td>
              <td>
              UCEverse
                <br/>
                <span className="badge badge-ghost badge-sm">open event</span>
              </td>
              <td>25 April 2024</td>
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>}
          </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
}

export default Page;
