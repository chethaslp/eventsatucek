import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import { Separator } from "./separator";
import { Sun, Moon, CircleUser, ScanLine } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { useToast } from "./use-toast";
import { GITHUB_URL } from "@/lib/utils";
import { Avatar } from "./avatar";
import { useAuthContext } from "../context/auth";
import { signOut } from "firebase/auth";
import { SigninDialog } from "../dialog/signin-dialog";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { auth } from "../fb/config";
import Image from "next/image";
import { QrReader } from "react-qr-reader";

export function Navbar({ qName }: { qName?: string }) {
  const { setTheme } = useTheme();
  const path = usePathname();
  const { toast } = useToast();
  const user = useAuthContext();
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem('role');

  const [openScanner, setOpenScanner]  =useState(false)
  function handleUserLogin(): void {
    if (user) signOut(auth);
    else setOpen(true);
  }

  const [color, setColor] = useState('');

   const listenScrollEvent = () => {
      if (window.scrollY > 600) {
         setColor('rgba(0, 0, 0, 10');
      } else {
         setColor('');
      }
   };
   
   useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
 })

  // if(!user) redirect("/signin?c="+path)

  return (
    <>
      <SigninDialog open={open} setOpen={setOpen} />  
      <div className="w-full  px-5 py-3 shadow-sm fixed z-20 md:bg-transparent bg-black " style={{ backgroundColor: color,  transition: 'background-color 0.5s ease' }}>
        <div className="flex items-center justify-between gap-2 flex-row">
          <div className="flex items-center text-white flex-row gap-2 hover:scale-105 transition-all scale-100">
            <Link href={"/"}>
              <Logo className={"text-3xl md:text-5xl"} />
            </Link>
            {qName && <span className="text-lg ml-2 ">/&nbsp;{qName}</span>}
          </div>
          <div className="flex items-center justify-center gap-2">
            <a
              href={path == "/e/past" ? "/" : "/e/past"}
              className="w-fill hidden md:block "
            >
              <Button variant="link" className="text text-white">
                {path == "/e/past" ? "Upcoming Events" : "Past Events"}
              </Button>
            </a>
            <a href={"/contributors"} className="w-fill hidden md:block">
              <Button variant="link" className="text text-white">
                Contributors
              </Button>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer ">
                {user ? (
                  <Avatar className="w-9 h-9">
                    <Image
                      height={25}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="aspect-square h-full w-full"
                      width={25}
                      src={user.photoURL || ""}
                      alt={user.displayName || ""}
                    />
                  </Avatar>
                ) : (
                  <Button variant="outline" size="icon">
                    <CircleUser />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-[#121212]">
                {user ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => (location.href = role == 'club' ? "/dashboard" : "/profile")}
                      className="cursor-pointer "
                    >
                      {role == 'club' ? "View Dashboard" : "View Profile"}
                      
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuItem
                  onClick={handleUserLogin}
                  className="cursor-pointer"
                >
                  {user ? "Signout" : "Signin"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
