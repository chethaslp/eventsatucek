import * as React from "react";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
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
import { QrReader } from "react-qr-reader";
import { Result } from '@zxing/library';
import { Loader2, X } from "lucide-react";
import { set } from "react-hook-form";

export function CheckInDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: Event;
}) {

  const [qrActive, setQrActive] = React.useState(true);
  const { toast } = useToast();
  const user = useAuthContext();
  
  async function handleSuccess(result: Result | null | undefined): Promise<void> {
    if (result) {
      const txt  = result.getText();
      console.log(txt)
      if("vibrate" in navigator) navigator.vibrate(200)
      if(txt.length == 0) return

      setQrActive(false)

      fetch(`/api/event/checkin`, {
        method: "POST",
        headers: {
          "X-Token": await user?.getIdToken() || "",
        },
        body: txt,
      })
      .then(async (res) => {
        setQrActive(true)
        if(res.ok){
          toast({title:"Checked in successfully.", variant:"default"})
        }else{
          toast({title:"Failed to checkin: "+ (await res.json()).msg, variant:"destructive"})
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="!max-w-screen !w-screen !h-screen !max-h-screen !p-0 !m-0 bg-zinc-800">
        <DialogHeader className="absolute top-0 z-20 w-full p-6 bg-zinc-900 rounded-b-3xl">
          <DialogTitle>Checkin</DialogTitle>
          <DialogClose className="absolute top-0 right-0 p-4 text-white"><X/></DialogClose>

          <div className="flex rounded gap-3 items-center">
            <Image src={getImgLink(evnt.img)} width={64} height={64} className="rounded-lg w-15 h-16" alt={""}/>
            <div className="flex flex-col items-start">
              <span className="text-white font-bold">{evnt.title}</span>
              <span className="text-gray-300 ">{evnt.club}</span>
            </div>
          </div>
        </DialogHeader>
        {qrActive ? (
          <div className="w-full h-full flex items-center">
            <QrReader 
              scanDelay={1000}
              onResult={handleSuccess}
              ViewFinder={() => (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2" />
                    </svg>
                  </div>
                </div>
                </div>
              )}
              videoStyle={{ 
                width: "100%", 
                height: "100%",
                objectFit: "cover"
              }}
              containerStyle={{ 
                width: "100%", 
                height: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                justify_items: "center",
                alignItems: "center"
              }}
              constraints={{
                facingMode: "environment"
              }}
            />
          </div>
        ) : (
          <div className="flex flex-row justify-center items-center gap-4 z-20 p-4 text-white">
            <Loader2 className="animate-spin"/> Checking in...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}