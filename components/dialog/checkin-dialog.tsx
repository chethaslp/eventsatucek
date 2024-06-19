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
import { QrReader } from "react-qr-reader";
import { Result } from '@zxing/library';
import { Loader2 } from "lucide-react";
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

  const [rsvps, setRsvps] = React.useState<QuerySnapshot<DocumentData, DocumentData>>();
  const [qrActive, setQrActive] = React.useState(true);
  const { toast } = useToast();
  const user = useAuthContext();

  React.useEffect(() => {
    if(!open || !user) return 
    getDocs(collection(db, "events", evnt.evntID, "regs")).then((data)=>setRsvps(data))
  }, [open])
  
  async function handleSuccess(result: Result | null | undefined): Promise<void> {

    if (result) {
      const txt  = result.getText();
      console.log(txt)
      if("vibrate" in navigator) navigator.vibrate(200)
      if(txt.length == 0) return

      setQrActive(false)

      fetch(`/api/event/${evnt.evntID}/checkin`, {
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
        <DialogContent className="max-w-[90%] max-h-[90%] dark:bg-[#121212]">
          <DialogHeader>
            <DialogTitle>Checkin</DialogTitle>
          </DialogHeader>
          {(qrActive)? <QrReader 
            scanDelay={300}
            onResult={handleSuccess}
            ViewFinder={(props)=> <div className="w-full h-full bg-black bg-opacity-50" {...props} />}
            videoStyle={{ width: "100%" , height: "100%"}}
            constraints={{
              facingMode:"environment"
            }}
            containerStyle={{ width: "100%" }}
           />: <div className="flex flex-col gap-4 p-4">
              <Loader2 className="animate-spin"/> Checking in...
            </div>}
        </DialogContent>
      </Dialog>
    );
}