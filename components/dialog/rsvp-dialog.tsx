import * as React from "react";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
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

export function RsvpDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: string[];
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [error, setError] = React.useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#121212]">
          <DialogHeader>
            <DialogTitle>RSVP?</DialogTitle>
            <DialogDescription>
              Requisite datas for processing the RSVP will be shared with the host. 
            </DialogDescription>
          </DialogHeader>
          <RsvpForm evnt={evnt} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="dark:bg-[#121212]">
        <DrawerHeader className="text-left">
          <DrawerTitle>RSVP?</DrawerTitle>
          <DrawerDescription>
          Requisite datas for processing the RSVP will be shared with the host. 
          </DrawerDescription>
        </DrawerHeader>
        <RsvpForm evnt={evnt} setOpen={setOpen} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function RsvpForm({
  evnt,
  setOpen,
}: {
  evnt: string[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useAuthContext();
  const { toast } = useToast();
  const { theme } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = React.useState("")

  const handleRSVP = async ()=>{
    if(!user) return
    setLoading("Getting you in...")
    
    if(!(await getUser(user))){
      setLoading("Redirecting you to profile page. Please complete your profile data.")
      location.href = `/profile?r=/event/${evnt[1]}`
      return
    }

    rsvpEvent(user, {
      evntID: evnt[1],
      evntName: evnt[3],
      club: evnt[6],
      status: "Registered",
      dt: evnt[7]
    })
    // Sending mail to the registered User.
    .then(()=> fetch("/api/eventRegisterEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...user, evnt}),
    }))
    // Checking if the event has a external RSVP link and redirecting to it.
    .then(()=>{
      if(evnt[9] && evnt[9] !== ""){
        setLoading("You are being redirected to external RSVP link.")
        location.href = evnt[9]
      } 
      setOpen(false);
    })
    .catch((error) => {
      console.error("Error sending token to server:", error);
    });

    return false;
  };

  return loading != "" ? (
    <div className="p-4 gap-5 flex items-center justify-center flex-row">
      <HashLoader color={theme == "light" ? undefined : "white"} />
      {loading}
    </div>
  ) : (
    <div className="flex flex-col gap-2 mx-3">
      <h3> Do you confirm RSVP to this event? </h3>
      <div className="flex flex-row gap-2 border rounded p-2 mb-2">
        <Image
          className="rounded-lg"
          src={getImgLink(evnt[5])}
          width={50}
          height={50}
          alt={evnt[3]}
        ></Image>
        <div className="flex flex-col">
          <h2 className="text md:text-md">{evnt[3]}</h2>
          <small className="text-muted-foreground text-xs">{evnt[6]}</small>
        </div>
      </div>
      <Button onClick={handleRSVP}>Confirm</Button>
    </div>
  );
}
