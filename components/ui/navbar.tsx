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
import { SetStateAction, useRef, useState } from "react";
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

  // if(!user) redirect("/signin?c="+path)

  return (
    <>
      <SigninDialog open={open} setOpen={setOpen} />
      <div className="w-full backdrop-blur px-5 py-3 dark:bg-[#181818fe] bg-[#f5f5f5df] shadow-sm fixed z-20 ">
        <div className="flex items-center justify-between gap-2 flex-row">
          <div className="flex items-center flex-row gap-2 hover:scale-105 transition-all scale-100">
            <Link href={"/"}>
              <Logo className={"text-3xl md:text-5xl"} />
            </Link>
            {qName && <span className="text-lg ml-2">/&nbsp;{qName}</span>}
          </div>
          <div className="flex items-center justify-center gap-2">
            <a
              href={path == "/event/past" ? "/" : "/event/past"}
              className="w-fill hidden md:block"
            >
              <Button variant="link" className="text">
                {path == "/event/past" ? "Upcoming Events" : "Past Events"}
              </Button>
            </a>
            <a href={"/contributors"} className="w-fill hidden md:block">
              <Button variant="link" className="text">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-[#121212]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
