import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaExclamation } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
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
import { auth, db } from "../fb/config";
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
import { createUser, getClub, getUser } from "../fb/db";
import { Logo } from "../ui/logo";
import SSImage from "@/public/img/ss-signin.png";
import Image from "next/image";
import { Separator } from "../ui/separator";
import BottomGradient from "../ui/BottomGradient";
import { useSearchParams } from "next/navigation";

export function SigninDialog({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // TODO : Fix Dark Theme Colours.

  const user = useAuthContext();
  const { toast } = useToast();
  const s = useSearchParams()
  const { theme } = useTheme();

  const [admYear, setAdmYear] = React.useState<string>("");
  const [batch, setBatch] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [rollNumber, setRollNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState("");
  const [signinStep, setSigninStep] = React.useState(false);

  function handleSignin() {
    setLoading("Authenticating...");
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (user) => {
        if(await getUser(user.user) || await getClub(user.user)) {
          setSigninStep(false);
          setOpen(false);
          return
        }
        setSigninStep(false);
        setLoading("");
      })
      .catch(() => setLoading(""));
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!user) {
      setSigninStep(false);
      return false;
    }
    
    setLoading("Getting you Signed Up!");
    // Sending Userdata to DB
    return createUser(user, {
      admYear: admYear,
      batch: batch,
      rollNumber: rollNumber,
      phoneNumber: phoneNumber,
      gender: gender,
    })
    // Sending welcome mail.
    .then((data) => fetch("/api/registerEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set Content-Type header
      },
      body: JSON.stringify(data), // Stringify token object
    })).then(()=> {
      if(s.has("r")) location.href = s.get("r") || ""
      setSigninStep(false);
      setOpen(false);
      return false;
    }).catch((err)=>console.log(err));
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
      <Logo className="text-4xl md:text-6xl " />
      {signinStep ? (
        <Button
          variant={"ghost"}
          onClick={() => setOpen(false)}
          className="fixed top-0 right-0 m-3"
        >
          <IoMdClose size={30} />
        </Button>
      ) : null}
      <Card className="m-4 dark:bg-[#121212] shadow-lg bg-[#ffffff]">
        <CardHeader>
          <CardTitle>
            <p className="text-xl md:text-2xl">
              {signinStep ? <>Let&apos;s Get Started!</> : <>Just a sec...</>}
            </p>
          </CardTitle>
          <CardDescription>
            {signinStep ? (
              <>Signin with your Google Account to continue.</>
            ) : (
              <>Fill out the following details and you are good to go!</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading != "" ? (
            <div className="p-4 gap-5 flex items-center justify-center flex-row">
              <HashLoader color={theme == "light" ? undefined : "white"} />
              {loading}
            </div>
          ) : (
            <div className={"flex items-center justify-center flex-col gap-4"}>
              {signinStep ? (
                <div
                  className="flex w-full p-2 cursor-pointer border rounded-md flex-row justify-center items-center dark:hover:bg-[#0000008e] hover:bg-[#cbcbcb8e] transition-all border-[#000]"
                  onClick={handleSignin}
                >
                  <FcGoogle size={20} className="mr-2" />
                  Signin with Google
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className={"grid items-center justify-center gap-4"}
                >
                  <Label className="border-l-2  p-2">Course Info</Label>
                  <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
                    <div className="grid gap-2 grid-flow-row ">
                      <Label htmlFor="admissionyear">Admission Year</Label>
                      <Select required onValueChange={(v) => setAdmYear(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="2020" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#0e0e0e] ">
                          {[...new Array(5)].map((x, i) => (
                            <SelectItem
                              key={`Y${i + 2019}`}
                              value={(i + 2019).toString()}
                              className="hover:dark:bg-[#000000a5]"
                            >
                              {i + 2019}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2 grid-flow-row ">
                    <Label htmlFor="batch">Batch</Label>
                      <Select required onValueChange={(v) => setBatch(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="IT" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#0e0e0e]">
                          <SelectItem
                            value={"CSE"}
                            className="hover:dark:bg-[#000000a5]"
                          >
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
                          <SelectItem
                            value={"IT"}
                            className="hover:dark:bg-[#000000a5]"
                          >
                            IT
                          </SelectItem>
                          <SelectItem
                            value={"ECE"}
                            className="hover:dark:bg-[#000000a5]"
                          >
                            ECE
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
                    <div className="grid gap-2 grid-flow-row ">
                      <Label htmlFor="rollnumber">Roll Number</Label>
                      <Input
                        className="dark:bg-[#121212] bg-[#ffff]"
                        id="rollnumber"
                        type="number"
                        placeholder="Eg: 54"
                        min={1}
                        required
                        onChange={(e) => setRollNumber(e.currentTarget.value)}
                      />
                    </div>
                    <div className="grid gap-2 grid-flow-row">
                      <Label htmlFor="gender">Gender</Label>
                      <Select required onValueChange={(v) => setGender(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#0e0e0e] ">
                          <SelectItem
                            value={"male"}
                            className="hover:dark:bg-[#000000a5]"
                          >
                            Male
                          </SelectItem>
                          <SelectItem
                            value={"female"}
                            className="hover:dark:bg-[#000000a5]"
                          >
                            Female
                          </SelectItem>
                          <SelectItem
                            value={"unknown"}
                            className="hover:dark:bg-[#000000a5]"
                          >
                            I Prefer not to disclose
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rollnumber">Personal Info</Label>
                    <Input
                      className="dark:bg-[#121212]  bg-[#ffff]"
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      min={1}
                      required
                      onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                    />
                    <Input
                      className="dark:bg-[#121212]"
                      id="email"
                      type="email"
                      placeholder="Email"
                      disabled
                      value={user?.email as string}
                    />
                  </div>
                  <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                  >
                    Finish Sign up &rarr;
                    <BottomGradient />
                  </button>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  ) : null;
}
