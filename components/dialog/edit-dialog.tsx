import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaExclamation } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import { HashLoader } from "react-spinners";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

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
import { app, auth, db } from "../fb/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cardlayout";
import { useTheme } from "next-themes";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { checkAdmissionNumber, createUser, getClub, getUser, updateUserProfile } from "../fb/db";
import { Logo } from "../ui/logo";
import SSImage from "@/public/img/ss-signin.png";
import Image from "next/image";
import { Separator } from "../ui/separator";
import BottomGradient from "../ui/BottomGradient";
import { usePathname, useSearchParams } from "next/navigation";
import path from "path";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { CollegeList } from "../ui/collegeList";
import { getMessaging, getToken } from "firebase/messaging";
import { PUBLIC_KEY } from "@/lib/data";
import { useRouter } from "next/navigation";
import { log } from "console";
import { UserType } from "@/lib/types";

export function EditDialog({
  open,
  setOpen,
  userData
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserType;
}) {

  const user = useAuthContext();
  const { toast } = useToast();
  const s = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

 
  
  const [admYear, setAdmYear] = React.useState<string>(userData.admYear);
  const [batch, setBatch] = React.useState<string>(userData.batch);
  const [wifiUsername, setWifiUsername] = React.useState<string>(userData.wifiUsername || "");
  const [regNo, setRegNo] = React.useState<string>(userData.registrationNumber || "");
  const [admissionNo, setAdmissionNo] = React.useState<string>(userData.admissionNumber || "");
  const [wifiPass, setWifiPass] = React.useState<string>(userData.wifiPass || "");

  const [loading, setLoading] = React.useState("");
  const [signinStep, setSigninStep] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      setSigninStep(false);
      return false;
    }

    setLoading("Updating Profile...");

    // const token = await getToken(getMessaging(app), { vapidKey: PUBLIC_KEY })

  
    return (
      updateUserProfile(user, {
        admYear: admYear,
        batch: batch,
        admissionNumber: admissionNo,
        registrationNumber: regNo,
        wifiUsername: wifiUsername,
        wifiPass: wifiPass,
      })
        .then(() => {
          if (s.has("r")) {
            router.push(s.get("r") || "");
            return;
          }
          setSigninStep(false);
          setOpen(false);
          if (pathname == "/profile") location.reload();
          return false;
        })
        .catch((err) => console.log(err))
    );
  };

  React.useEffect(() => {
    setSigninStep(!user);
  }, [user]);

  React.useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return open ? (
    <div className="transition-all animate-in h-full w-full flex items-center justify-center flex-col fixed z-[50]  bg-transparent backdrop-blur-md">
      <IoMdClose
        className="absolute right-0 top-0 m-5 cursor-pointer"
        size={20}
        onClick={() => setOpen(false)}
      />
      <Logo className="text-4xl md:text-6xl " />
      <form
        onSubmit={handleSubmit}
        className={"grid items-center justify-center gap-4"}
      >
        <Label className="border-l-2  p-2 w-80">Edit Profile</Label>
        <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
          <div className="grid gap-2 grid-flow-row ">
            <Label htmlFor="admissionyear">Admission Year</Label>
            <Select  onValueChange={(v) => setAdmYear(v)}>
              <SelectTrigger>
                <SelectValue placeholder={admYear} />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#0e0e0e] ">
                {[...new Array(6)].map((x, i) => (
                  <SelectItem
                    key={`Y${i + new Date().getFullYear() - 5}`}
                    value={(i + new Date().getFullYear() - 5).toString()}
                    className="hover:dark:bg-[#000000a5]"
                  >
                    {i + new Date().getFullYear() - 5}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 grid-flow-row ">
            <Label htmlFor="batch">Batch</Label>
            <Select  onValueChange={(v) => setBatch(v)}>
              <SelectTrigger>
                <SelectValue placeholder={userData.batch} />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#0e0e0e]">
                <SelectItem value={"CSE"} className="hover:dark:bg-[#000000a5]">
                  CSE
                </SelectItem>
                <SelectItem
                  value={"CSE B1"}
                  className="hover:dark:bg-[#000000a5]"
                >
                  CSE B1
                </SelectItem>
                <SelectItem
                  value={"CSE B2"}
                  className="hover:dark:bg-[#000000a5]"
                >
                  CSE B2
                </SelectItem>
                <SelectItem value={"IT"} className="hover:dark:bg-[#000000a5]">
                  IT
                </SelectItem>
                <SelectItem value={"ECE"} className="hover:dark:bg-[#000000a5]">
                  ECE
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="admission-no">Admission Number</Label>
          <Input
            className="dark:bg-[#121212]  bg-[#ffff]"
            id="admissionNumber"
            type="number"
            placeholder=""
            value={admissionNo}
            
            onChange={(e) => setAdmissionNo(e.currentTarget.value)}
          />
          <Label htmlFor="reg-no">Registration no</Label>
          <Input
            className="dark:bg-[#121212]  bg-[#ffff]"
            id="registrationNumber"
            type="number"
            placeholder=""
            value={regNo}
            
            onChange={(e) => setRegNo(e.currentTarget.value)}
          />
          <Label htmlFor="wifi-username">Wifi Username</Label>
          <Input
            className="dark:bg-[#121212]  bg-[#ffff]"
            id="wifi-username"
            type="text"
            placeholder=""
            min={3}
            value={wifiUsername}
            onChange={(e) => setWifiUsername(e.currentTarget.value)}
          />
        </div>

        <div className="grid gap-2 relative">
          <Label htmlFor="wifi-password">Wifi Password</Label>
          <Input
            className="dark:bg-[#121212] bg-[#ffff] pr-10"
            id="wifi-password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            min={1}
            value={wifiPass}
            onChange={(e) => setWifiPass(e.currentTarget.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-9"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button
          className="bg-gradient-to-br  relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Update Profile &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  ) : null;
}
