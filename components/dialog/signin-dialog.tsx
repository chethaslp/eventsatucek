import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { and, collection, doc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "../fb/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/cardlayout"
import { useTheme } from "next-themes";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";
import { createUser } from "../fb/db";
import { Logo } from "../ui/logo";
import SSImage from "@/public/img/ss-signin.png"
import Image from "next/image";
import { Separator } from "../ui/separator";
import BottomGradient from "../ui/BottomGradient";

export function SigninDialog({open, setOpen}:{open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {

  // TODO : Fix Dark Theme Colours.

  const user = useAuthContext()
  const { toast } = useToast()
  const { theme } = useTheme()

  const [admYear, setAdmYear] = React.useState<string>("####")
  const [batch, setBatch] = React.useState<string>("###")
  const [rollNumber, setRollNumber] = React.useState<string>("######")
  const [loading, setLoading] = React.useState("")
  const [signinStep, setSigninStep] = React.useState(false)

 
  function handleSignin() {
    setLoading("Authenticating...")
    signInWithPopup(auth, new GoogleAuthProvider()).then((user)=>{
      setSigninStep(true)
      setLoading("")
    }).catch(()=> setLoading(""))
  }

  const handleSubmit = (e: any)=>{
    e.preventDefault()
    if(!user) {
      setSigninStep(false)
      console.log("Dvdsv")
      
      return false
    }

    setLoading("Getting you Signed Up!")
    return createUser(user,{admYear:admYear, batch: batch, rollNumber: rollNumber}).then(()=>{
      setSigninStep(false)
      setOpen(false)
      return false
    })

  }

  React.useEffect(()=>{
    setSigninStep(!user)
  },[user])

    return (open)?(<div className="h-[100dvh] w-full flex items-center justify-center flex-col fixed z-[50] dark:bg-[#121212] bg-slate-300">
      <Logo className="text-6xl"/>
      {(signinStep)?<Button variant={"ghost"} onClick={()=>setOpen(false)} className="fixed top-0 right-0 m-3"><IoMdClose size={30}/></Button>:null}
      <Card className="m-4 ">
        <CardHeader>
          <CardTitle>{(signinStep)?<>Let&apos;s Get Started!</>:<>Just a sec...</> }</CardTitle>
          <CardDescription>
            {(signinStep)?<>Signin with your Google Account to continue.</>:<>Fill out the following details and you are good to go!</>}
          </CardDescription>
        </CardHeader>
        <CardContent>
        {((loading != "")?<div className="p-4 gap-5 flex items-center justify-center flex-row">
  <HashLoader color={theme=="light"? undefined:"white"}/>{loading}
  </div>:
    <div className={"flex items-center justify-center flex-col gap-4"}>
      
      {(signinStep)?<div className="flex w-full p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-900 transition-all" onClick={handleSignin}>
                        <FcGoogle size={20} className="mr-2" />
                        Signin with Google
      </div>:   <form onSubmit={handleSubmit} className={"grid items-center justify-center gap-4"}>
      
      <div className="grid gap-3 w-full mx-2 items-center justify-center flex-row">
        <Label className="mx-1">Batch Info</Label>
        <div className="grid gap-2 sm:grid-flow-col">
          <Select required onValueChange={(v)=>setAdmYear(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Admission Year" />
            </SelectTrigger>
            <SelectContent>
              {[...new Array(5)].map((x,i) => <SelectItem key={`Y${i+2019}`} value={(i+2019).toString()}>{i+2019}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select required onValueChange={(v)=>setBatch(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'CSE B1'}>CSE B1</SelectItem>
              <SelectItem value={'CSE B2'}>CSE B2</SelectItem>
              <SelectItem value={'IT'}>IT</SelectItem>
              <SelectItem value={'ECE'}>ECE</SelectItem>
            </SelectContent>
          </Select>
        </div>  
      </div>
      <div className="grid gap-2 mx-4">
        <Label htmlFor="rollnumber">Roll Number</Label>
        <Input id="rollnumber" type="number" placeholder="Eg: 54" min={1} required onChange={(e)=>setRollNumber(e.currentTarget.value)}/>
      </div>
      <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Finish Sign up &rarr;
            <BottomGradient />
      </button>
    </form>}

    </div>
  )}
  
        </CardContent>
        
      </Card>
    </div>):null
}
