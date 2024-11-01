import * as React from "react";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DocumentData,
  QuerySnapshot,
  and,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../fb/config";
import { useTheme } from "next-themes";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImgLink } from "@/lib/data";
import { getUser, rsvpEvent } from "../fb/db";
import { Event, Event_RSVP, Event_User, Event as _Event } from "@/lib/types";
import Papa from "papaparse";

export function ListRsvpDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: Event;
}) {

  const [rsvps, setRsvps] = React.useState<QuerySnapshot<DocumentData, DocumentData>>();

  React.useEffect(() => {
    if(!open) return 
    getDocs(collection(db, "events", evnt.evntID, "regs")).then((data)=>setRsvps(data))
  }, [open])

  function exportCSV(){
    if(rsvps == null) return
    const csv = Papa.unparse(rsvps.docs.map((doc)=>{
      const d = doc.data() as Event_RSVP
      return {Name: d.name, Email: d.email, PhoneNumber: d.ph, Status: d.status, RegisteredAt: d.createdAt.toDate().toLocaleString()}
  }))
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evnt.title} - RSVPs at ${new Date().toLocaleString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className="max-w-[90%] max-h-[90%] dark:bg-[#121212]">
          <DialogHeader>
            <DialogTitle>{evnt.title}</DialogTitle>
            <DialogDescription className="flex-row justify-between flex">
              <span>{evnt.club} <i>~ Posted by {evnt.host}</i></span>
              <Button className="mr-5 mb-5" onClick={exportCSV}>Export as CSV</Button>
            </DialogDescription>
          </DialogHeader>

          {(rsvps != null) ? (
            <div className="flex flex-col gap-2">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Reg. No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.docs.map((doc) => {
                    const d = doc.data() as Event_RSVP
                    return <tr key={doc.id}>
                      <td className="border px-4 py-2">{d.regNo}</td>
                      <td className="border px-4 py-2">{d.name}</td>
                      <td className="border px-4 py-2">{d.email}</td>
                      <td className="border px-4 py-2">{d.ph || "None"}</td>
                      <td className="border px-4 py-2"><span className={`badge capitalize ${d.status=="attended"?"badge-success": (d.status == "missed")? "badge-error": "badge-warning"}`}>{doc.data().status}</span></td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>):(
            <div className="flex flex-col gap-2">
              <p>No RSVPs yet.</p>
            </div>
          )}
                  
        </DialogContent>
      </Dialog>
    );
}