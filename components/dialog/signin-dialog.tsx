import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaExclamation } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";

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
import { checkAdmissionNumber, createUser, getClub, getUser } from "../fb/db";
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
import { set } from "react-hook-form";

export function SigninDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // TODO : Fix Dark Theme Colours.

  const user = useAuthContext();
  const { toast } = useToast();
  const s = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()
  const { theme } = useTheme();

  const [admYear, setAdmYear] = React.useState<string>("");
  const [batch, setBatch] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [admissionNumber, setAdmissionNumber] = React.useState<string>("");
  const [registrationNumber, setRegistrationNumber] = React.useState<string>("");
  const [college, setCollege] = React.useState<string>("");
  const [branch, setBranch] = React.useState<string>("");
  const [loading, setLoading] = React.useState("");
  const [signinStep, setSigninStep] = React.useState(false);
  const [checkAdmission, setCheckAdmission] = React.useState(false);
  const [whichCollegeDialog, setWhichCollegeDialog] = React.useState(false);

  function handleSignin() {
    setLoading("Authenticating...");
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (user) => {
        const userExists = await getUser(user.user);
        if (userExists) {
          setSigninStep(false);
          setOpen(false);
          location.reload();
          return;
        }
        // User doesn't exist, ask if they're from UCEK
        setWhichCollegeDialog(true);
        setSigninStep(false);
        setLoading("");
      })
      .catch(() => setLoading(""));
  }

  const stringToBoolean = (value: any) => {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return value;
  };

  const [isUcek, setIsUcek] = React.useState<string | undefined>();

  function handleIsUcek() {
    const booleanValue = stringToBoolean(isUcek);
    setIsUcek(booleanValue);
    setWhichCollegeDialog(false);
  }
  function handleRadioChange(value: string) {
    setIsUcek(value);
  }


  const handleSubmit = async (e: any) => {
    
    e.preventDefault();
    if (!user) {
      setSigninStep(false);
      return false;
    }
    const admissionNumberExists = await checkAdmissionNumber(admissionNumber);
    if (admissionNumberExists) {
      console.log("Admission Number Exists");
      setCheckAdmission(true)
      return false;
    }
   
    setLoading("Getting you Signed Up!");
    
    // const token = await getToken(getMessaging(app), { vapidKey: PUBLIC_KEY })

    // Sending Userdata to DB
    return (
      createUser(user, {
        admYear: admYear,
        batch: batch,
        admissionNumber: admissionNumber,
        registrationNumber: registrationNumber,
        phoneNumber: phoneNumber,
        gender: gender,
        college:college,
        branch:branch,
        token: "token"

      })
        // Sending welcome mail.
        .then(async (data: any) => 
          fetch("/api/mailService/welcome", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Token": await user.getIdToken(),
            },
            body: JSON.stringify({ user: data }),
          }))
        .then(() => {
          if (s.has("r")) {
            router.push(s.get("r") || "")
            return
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
    if(!isUcek) return;
    let agg = "", agg2 = "-_";
    
    if(batch != ""){
      switch(batch) {
        case "CSE":
        case "CSE B1":
        case "CSE B2":
          agg += "415"
          agg2.replace("_", "CSE");
          break;
        case "IT":
          agg += "416"
          agg2.replace("_", "IT");
          break;
        case "ECE":
          agg += "412"
          agg2.replace("_", "ECE");
          break;
      }
    }
    if(admYear != "") {
      agg += admYear.slice(2,4);
      agg2.replace("-", admYear.slice(2,4));
    }
    if(batch != "" && admYear != "") agg += "404";
    
    setRegistrationNumber(agg);
  }, [batch, admYear]);

  React.useEffect(() => {
    setSigninStep(!user);
    if (user) {
      // User is signed in, check if they have existing data
      getUser(user).then((userExists) => {
        if (!userExists) {
          // User doesn't exist in DB, ask if they're from UCEK
          setWhichCollegeDialog(true);
        } else {
          // User exists, close dialog
          setOpen(false);
        }
      });
    } else {
      // No user signed in, don't show college dialog
      setWhichCollegeDialog(false);
    }
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
    <div className="transition-all animate-in h-full w-full flex items-center justify-center flex-col fixed z-[50] overflow-y-auto  bg-transparent backdrop-blur-md">
      <Logo className="text-4xl md:text-5xl pt-20" />
      <Button
        variant={"ghost"}
        onClick={() => setOpen(false)}
        className="fixed top-0 right-0 m-3"
      >
        <IoMdClose size={30} />
      </Button>
      <Card className="m-4 dark:bg-[#121212] shadow-lg bg-[#ffffff]">
        {signinStep ? (
          // Step 1: Google Signin
          <>
            <CardHeader>
              <CardTitle>
                <p className="text-xl md:text-2xl">Let&apos;s Get Started!</p>
              </CardTitle>
              <CardDescription>
                Signin with your Google Account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading != "" ? (
                <div className="p-4 gap-5 flex items-center justify-center flex-row">
                  <HashLoader
                    color={theme == "light" ? undefined : "white"}
                  />
                  {loading}
                </div>
              ) : (
                <div className="flex items-center justify-center flex-col gap-4">
                  <div
                    className="flex w-full p-2 cursor-pointer border rounded-md flex-row justify-center items-center dark:hover:bg-[#0000008e] hover:bg-[#cbcbcb8e] transition-all border-[#000]"
                    onClick={handleSignin}
                  >
                    <FcGoogle size={20} className="mr-2" />
                    Signin with Google
                  </div>
                </div>
              )}
            </CardContent>
          </>
        ) : whichCollegeDialog ? (
          // Step 2: Ask if UCEK student (only shown after signin if user doesn't exist)
          <>
            <CardHeader>
              <CardTitle className="text-center">
                Are you a Student at University College of Engineering
                Kariavattom?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <Button
                  variant={isUcek === "true" ? "default" : "outline"}
                  className={`h-12 text-left justify-start transition-all ${
                    isUcek === "true" 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted/50 border-2"
                  }`}
                  onClick={() => setIsUcek("true")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isUcek === "true" 
                        ? "bg-primary-foreground border-primary-foreground" 
                        : "border-muted-foreground"
                    }`}>
                      {isUcek === "true" && (
                        <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Yes, I&apos;m a UCEK Student</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant={isUcek === "false" ? "default" : "outline"}
                  className={`h-12 text-left justify-start transition-all ${
                    isUcek === "false" 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted/50 border-2"
                  }`}
                  onClick={() => setIsUcek("false")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isUcek === "false" 
                        ? "bg-primary-foreground border-primary-foreground" 
                        : "border-muted-foreground"
                    }`}>
                      {isUcek === "false" && (
                        <div className="w-2 h-2 bg-primary rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">No, I&apos;m from another institution</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => typeof isUcek != "undefined" && handleIsUcek()} 
                  type="button"
                  disabled={typeof isUcek === "undefined"}
                  className="mt-4"
                >
                  Continue
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          // Step 3: Fill details form
          <>
            <CardHeader>
              <CardTitle>
                <p className="text-xl md:text-2xl">Just a sec...</p>
              </CardTitle>
              <CardDescription>
                Fill out the following details and you are good to go!
              </CardDescription>
            </CardHeader>
            {!isUcek ? (
              <CardContent>
                {loading != "" ? (
                  <div className="p-4 gap-5 flex items-center justify-center flex-row">
                    <HashLoader
                      color={theme == "light" ? undefined : "white"}
                    />
                    {loading}
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className={"grid items-center justify-center gap-4"}
                  >
                    <Label className="border-l-2  p-2">Course Info</Label>
                    <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
                      <div className="grid gap-2 grid-flow-row ">
                        <Label htmlFor="admissionyear">
                          Admission Year
                        </Label>
                        <Select
                          required
                          onValueChange={(v) => setAdmYear(v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                      <div className="grid gap-2 grid-flow-row">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          required
                          onValueChange={(v) => setGender(v)}
                        >
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
                    <Label htmlFor="collegeName">
                          College Name
                        </Label>
                      <Input
                        className="dark:bg-[#121212]  bg-[#ffff]"
                        id="college"
                        type="text"
                        placeholder="Your college here"
                        min={1}
                        required
                        onChange={(e) =>
                          setCollege(e.currentTarget.value)
                        }
                      />
                    <Label htmlFor="branch">
                          Department
                        </Label>
                      <Input
                        className="dark:bg-[#121212]  bg-[#ffff]"
                        id="branch"
                        type="text"
                        placeholder="Civil Engineering"
                        min={1}
                        required
                        onChange={(e) =>
                          setBranch(e.currentTarget.value)
                        }
                      />
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
                        onChange={(e) =>
                          setPhoneNumber(e.currentTarget.value)
                        }
                      />
                      <Input
                        className="dark:bg-[#121212]"
                        id="email"
                        type="email"
                        placeholder="Email"
                        disabled
                        value={user?.email as string}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox required />I accept the{" "}
                        <a
                          href="/policies/terms"
                          target="_blank"
                          className="text-blue-600 hover:underline "
                        >
                          terms and conditions.
                        </a>
                      </div>
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
              </CardContent>
            ) : (
              <CardContent>
                {loading != "" ? (
                  <div className="p-4 gap-5 flex items-center justify-center flex-row">
                    <HashLoader
                      color={theme == "light" ? undefined : "white"}
                    />
                    {loading}
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className={"grid items-center justify-center gap-4 "}
                  >
                    <Label className="border-l-2  p-2">Course Info</Label>
                    <div className="grid gap-2 grid-flow-col grid-cols-2 sm:grid-flow-col">
                      <div className="grid gap-2 grid-flow-row ">
                        <Label htmlFor="admissionyear">
                          Admission Year <span className="text-red-700 font-mono">*</span>
                        </Label>
                        <Select
                          required
                          onValueChange={(v) => setAdmYear(v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                        <Label htmlFor="batch">Batch <span className="text-red-700 font-mono">*</span></Label>
                        <Select required onValueChange={(v) => setBatch(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                        <Label htmlFor="addNumber" className={`${checkAdmission ? 'text-red-600': ''} `}>{ checkAdmission ? "Already Registered"  :  "Admission No"} </Label>
                        <Input
                          className="dark:bg-[#121212] bg-[#ffff]"
                          id="addNumber"
                          type="text"
                          placeholder="23CSE111"
                          value={admissionNumber}
                          onChange={(e) =>
                            setAdmissionNumber(e.currentTarget.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2 grid-flow-row">
                        <Label htmlFor="gender">Gender <span className="text-red-700 font-mono">*</span></Label>
                        <Select
                          required
                          onValueChange={(v) => setGender(v)}
                        >
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
                      <Label htmlFor="registrationNumber">Candidate Code <span className="text-red-700 font-mono">*</span></Label>
                      <Input
                        className="dark:bg-[#121212]  bg-[#ffff]"
                        id="registrationNumber"
                        type="text"
                        placeholder="41523404###"
                        pattern="(415|412|416)(19|20|21|22|23|24|25)404(0[0-9]{2}|1[0-3][0-9])"
                        required
                        value={registrationNumber}
                        onChange={(e) =>
                          setRegistrationNumber(e.currentTarget.value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rollnumber" className="border-l-2  p-2">Personal Info  <span className="text-red-700 font-mono">*</span></Label>
                      <Input
                        className="dark:bg-[#121212]  bg-[#ffff]"
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        min={1}
                        required
                        onChange={(e) =>
                          setPhoneNumber(e.currentTarget.value)
                        }
                      />
                      <Input
                        className="dark:bg-[#121212]"
                        id="email"
                        type="email"
                        placeholder="Email"
                        disabled
                        value={user?.email as string}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox required />I accept the{" "}
                        <a
                          href="/policies/terms"
                          target="_blank"
                          className="text-blue-600 hover:underline "
                        >
                          terms and conditions.
                        </a>
                        <span className="text-red-700 font-mono">*</span>
                      </div>
                    </div>
                    <button
                      className={` bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
                      type="submit"
                    >
                      Finish Sign up &rarr;
                      <BottomGradient />
                    </button>
                  </form>
                )}
              </CardContent>
            )}
          </>
        )}
      </Card>
    </div>
  ) : null;
}
