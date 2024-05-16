import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { Separator } from "./separator";
import { Sun, Moon, User, UserCheck2 } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { useToast } from "./use-toast";
import { GITHUB_URL } from "@/lib/utils";
import { RxAvatar } from "react-icons/rx";

export function Navbar({ qName }: { qName?: string }) {
  const { setTheme } = useTheme();
  const path = usePathname();
  const { toast } = useToast();
  // if(!user) redirect("/signin?c="+path)

  return (
    <div className="w-full backdrop-blur pr-5 pt-3 pl-5 pb-3 dark:bg-[#121212]">
      <div className="flex items-center justify-between gap-2 flex-row">
        <div className="flex items-center flex-row gap-2 hover:scale-105 transition-all scale-100">
          <Link href={"/"}>
            <Logo size={"6xl"} />
          </Link>
          {qName && <span className="text-lg ml-2">/&nbsp;{qName}</span>}
        </div>
        <div className="flex items-center flex-row gap-2">
          <div></div>
          <div></div>
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
          <a
            href={GITHUB_URL}
            target="_blank"
            className="w-fill hidden md:block"
          >
            <Button variant="outline" className="text-lg" size="icon">
              <FaGithub />
            </Button>
          </a>
          <a
            href='/signup'
            className="w-fill hidden md:block"
          >
            <Button variant="outline" className="text-lg" size="icon">
            <RxAvatar />
            </Button>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      <Separator className="mt-3 mb-4" />
    </div>
  );
}
