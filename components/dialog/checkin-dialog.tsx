import {
  Dialog,
  DialogClose,
  DialogContent, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getImgLink } from "@/lib/data";
import { Event, UserType } from "@/lib/types";
import { Result } from '@zxing/library';
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { QrReader } from "react-qr-reader";
import { HashLoader } from "react-spinners";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";

export function CheckInDialog({
  open,
  lateral,
  setOpen,
  evnt,
  userData
}: {
  open: boolean;
  lateral: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: Event | null;
  userData: UserType | null;
}) {
  const [qrActive, setQrActive] = React.useState(true);
  const { toast } = useToast();
  const user = useAuthContext();
  
  const [clubToken, setClubToken] = React.useState<string | null>(null);
  const [userToken, setUserToken] = React.useState<string | null>(null);

  const fetchClubToken = React.useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/getClubToken`, {
        method: "POST",
        headers: {
          "X-Token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        setClubToken(data.clubToken);
        localStorage.setItem('clubToken_'+user?.uid, data.clubToken);
      }
    } catch (error) {
      console.error('Failed to fetch club token:', error);
      
      toast({
        title: "Failed to fetch club token",
        variant: "destructive"
      });
    }
  }, []); 

  React.useEffect(() => {
    if(lateral) return;
    if (user) {
      const retrieveToken = async () => {
        try {
          const token = await user.getIdToken();
          
          setUserToken(token);
        localStorage.setItem('userToken_'+user?.uid, token);
          
          await fetchClubToken(token);
        } catch (error) {
          console.error('Token retrieval failed:', error);
        }
      };

      retrieveToken();
    }
  }, [user, fetchClubToken]); 

  React.useEffect(() => {
    if(!lateral) return;

    setTimeout(() => {
      setClubToken("lateral");
    }, 1000);
  });

  function handleSuccess(result: Result | null | undefined) {
    if (result) {
      const txt = result.getText();
      
      const userToken = localStorage.getItem('userToken_'+user?.uid);
      const clubToken = localStorage.getItem('clubToken_'+user?.uid);

      if (!userToken || !clubToken) {
        toast({
          title: "Tokens not available. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if ("vibrate" in navigator) navigator.vibrate(200);

      setQrActive(false);

      fetch(`/api/event/checkin`, {
        method: "POST",
        headers: {
          "X-Token": userToken,
          "X-ClubToken": clubToken
        },
        body: txt,
      })
      .then(async (res) => {
        setQrActive(true);
        
        if (res.ok) {
          toast({ title: "Checked in successfully.", variant: "success" });
        } else {
          const errorMsg = (await res.json()).msg;
          toast({ 
            title: `Failed to check in: ${errorMsg}`, 
            variant: "destructive" 
          });
        }
      })
      .catch(error => {
        console.error('Check-in error:', error);
        setQrActive(true);
        toast({ 
          title: "Check-in failed. Please try again.", 
          variant: "destructive" 
        });
      });
    }
  }

  async function handleSuccessLateral(result?: Result | null | undefined, error?: Error | null | undefined): Promise<void> {
    if(!result) return

    const userToken = await user?.getIdToken();
    if (!userToken) {
      toast({
        title: "Token not available. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const txt = result.getText();
    if ("vibrate" in navigator) navigator.vibrate(200);

    setQrActive(false);

    fetch(`/api/event/checkin-lateral`, {
      method: "POST",
      headers: {
        "X-Token": userToken,
      },
      body: txt,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="!max-w-screen !w-screen !h-screen !max-h-screen !p-0 !m-0 bg-zinc-800">
        <DialogHeader className="absolute top-0 z-30 w-full p-6 bg-zinc-900 rounded-b-3xl">
          <DialogTitle>{lateral? "Scanner":"Checkin"}</DialogTitle>
          <DialogClose className="absolute top-0 right-0 p-4 text-white"><X/></DialogClose>

          {evnt && <div className="flex rounded gap-3 items-center">
            <Image src={getImgLink(evnt.img)} width={64} height={64} className="rounded-lg w-15 h-16" alt={""}/>
            <div className="flex flex-col items-start">
              <span className="text-white font-bold">{evnt.title}</span>
              <span className="text-gray-300 ">{evnt.club}</span>
            </div>
          </div>}
        </DialogHeader>

        {!clubToken && <div className="flex absolute items-center justify-center w-full h-full backdrop-blur z-20"><HashLoader color="white"/></div>}
        {qrActive ? (
          <div className="w-full h-full flex items-center">
            <QrReader 
              scanDelay={1000}
              onResult={lateral? handleSuccessLateral :handleSuccess}
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