"use client";
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navbar";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="flex  justify-center p-5">
        <div className="flex flex-row md:w-[70rem] md:h-[25rem] border-2 rounded-lg shadow-md">
          <div className="flex flex-col  items-center px-16 py-8">
            <div className="avatar">
              <div className="w-44 h-44 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
              <h2 className="text-xl mt-1 font-semibold">Rashmika</h2>
              <p>Btech CSE 2nd Year </p>
              <div className="mt-4 border-l-4 p-1 border-blue-700">
                <h2 className="text-md font-semibold ">ABOUT</h2>
                <p>Acting Lead at Movie Club. <br /> Best actress at college of engineering.</p>
              </div>
          </div>
          <div className="px-16 py-8">
            <h1 className="text-2xl ">Events Attented</h1>
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
      {/* row 2 */}
      <tr>
    
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img src="https://eventsatucek.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmuln_black.ff73a7b9.png&w=384&q=75" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div className="font-bold">Interns Call</div>
            </div>
          </div>
        </td>
        <td>
          Mu Learn
          <br/>
          <span className="badge badge-ghost badge-sm">Intern call</span>
        </td>
        <td>02 April 2024</td>
        <th>
          <button className="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
      {/* row 3 */}
    </tbody>
  </table>
</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}

export default Page;
