import * as React from "react";
import useMediaQuery from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTheme } from "next-themes";
import QRCode from "react-qr-code";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImgLink } from "@/lib/data";
import { Event as _Event } from "@/lib/types";

export function TicketDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: string[];
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#121212]">
          <DialogHeader>
            <DialogTitle>Your Ticket</DialogTitle>
            <DialogDescription>
          Please show this ticket to the event host.
            </DialogDescription>
          </DialogHeader>
          { open && <ShowTicket evnt={evnt} setOpen={setOpen} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="dark:bg-[#121212] mb-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>Your Ticket</DrawerTitle>
          <DrawerDescription>
          Please show this ticket to the event host.
          </DrawerDescription>
        </DrawerHeader>
        { open && <ShowTicket evnt={evnt} setOpen={setOpen} />}
      </DrawerContent>
    </Drawer>
  );
}

function ShowTicket({ evnt, setOpen }: { evnt: string[]; setOpen: React.Dispatch<React.SetStateAction<boolean>>;}) {
  
  const user = useAuthContext();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [ticketToken, setTicketToken] = React.useState<string>();

  const router = useRouter();

  const [loading, setLoading] = React.useState("")

  React.useEffect(()=>{
    // Fetch ticket from the server
    if(!user) {
      setLoading("Please login to continue.")
      setTimeout(()=>location.href = `/login?r=/e/${evnt[1]}`, 2000)
      return
    }

    setLoading("Getting your ticket...");
    (async ()=>{
      const ls = localStorage.getItem("ticketToken_"+evnt[1])
      if(ls && ls != ""){
        setTicketToken(ls)
        setLoading("")
        return
      }

      fetch(`/api/event/${evnt[1]}/getTicket`, {
        method: "POST",
        headers: {
          "X-Token": await user.getIdToken()
        }
      }).then(async (data)=> {
        if(data.status == 400){
          setLoading("Unauthorized. Please login to continue.")
          setTimeout(()=>location.href = `/login?r=/e/${evnt[1]}`, 2000)
          return
        }
        if(data.status == 404){
          setLoading("Unauthorized. Please RSVP to continue.")
          setTimeout(()=>setOpen(false), 2000)
          return
        }
        if(data.status == 409){
          setLoading("Ticket Expired. Please RSVP to continue.")
          setTimeout(()=>setOpen(false), 2000)
          return
        }
        const d = await data.json()
        localStorage.setItem("ticketToken_"+evnt[1], d.ticketToken)
        setTicketToken(d.ticketToken)
        setLoading("")
      })

    })()

  },[])


  return loading != "" ? (
    <div className="p-4 gap-5 flex items-center justify-center flex-row">
      <HashLoader color={theme == "light" ? undefined : "white"} />
      {loading}
    </div>
  ) : (
    <div className="flex flex-col gap-2 mx-3">
      <h3> </h3>
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

      <div className="flex border rounded-lg p-2 mb-2 bg-white">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={ticketToken || ""}
          viewBox={`0 0 256 256`}
        />
      </div>
      <Button variant="outline" onClick={()=>setOpen(false)}>Close</Button>
    </div>
  );
}
