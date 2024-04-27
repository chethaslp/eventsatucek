import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import GDSCLogo from "../public/logos/gdsc.png";
import IEDCLogo from "../public/logos/iedc.png";
import IEDCLogoBlack from "../public/logos/iedc_black.png";
import FOSSLogo from "../public/logos/foss.png";
import FMCLogo from "../public/logos/fmc.png";
import FMCLogoBlack from "../public/logos/fmc_black.png";
import MCCLogo from "../public/logos/mcc.png";
import MCCLogoBlack from "../public/logos/mcc_black.png";
import IEEELogo from "../public/logos/ieee.png";
import IEEELogoBlack from "../public/logos/ieee_black.png";
import MDCLogo from "../public/logos/mdc.png";
import MULNLogo from "../public/logos/muln.png";
import MULNLogoBlack from "../public/logos/muln_black.png";
import NSSLogo from "../public/logos/nss.png";
import SFILogo from "../public/logos/sfi.png";
import TRHLogo from "../public/logos/trh.png";
import TRHLogoBlack from "../public/logos/trh_black.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const GITHUB_URL = "https://github.com/chethaslp/eventsatucek";
export const GITHUB_API_URL =
  "https://api.github.com/repos/chethaslp/eventsatucek/contributors";

export function formatDateArray(dateString?: string): any {
  const event_date: any = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (!dateString) {
    return;
  }

  const parts: any = dateString.split(/[\s/:]/);
  const date = new Date( // format - YYYY-MM-DDTHH:mm:ss.sss
    parts[2],
    parts[1] - 1,
    parts[0],
    parts[3],
    parts[4],
    parts[5]
  );

  // Get day, month, hours, and minutes
  event_date.day = dateString.substring(0, 2);
  event_date.dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  event_date.month = monthNames[parseInt(dateString.substring(3, 5)) - 1];
  event_date.year = date.getFullYear();
  event_date.date = date;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  let formattedTime =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0");
  event_date.from_time = formattedTime + " " + (hours < 12 ? "am" : "pm");
  return event_date;
}

export function resolveClubIcon(clb: string,black:boolean ): any {
  return {
    "Google Developers Student Club - UCEK": GDSCLogo,
    "IEEE - UCEK": black ? IEEELogoBlack : IEEELogo,
    "Legacy IEDC - UCEK": black ? IEDCLogoBlack : IEDCLogo,
    "μlearn - UCEK": black ? MULNLogoBlack : MULNLogo,
    "FOSS - UCEK": FOSSLogo,
    "TinkerHub - UCEK": black ? TRHLogoBlack : TRHLogo,  
    "SFI UCEK": SFILogo,
    "Meluhans Dance Club": MDCLogo,
    "Music Club - UCEK": black ? MCCLogoBlack : MCCLogo,
    "Film Club - UCEK": black ? FMCLogoBlack : FMCLogo,
    "NSS - UCEK": NSSLogo,
  }[clb];
}

export function countdownHelper(millisecond: any) {
  var days = Math.floor(millisecond / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor((millisecond % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((millisecond % (1000 * 60)) / 1000);

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
}
