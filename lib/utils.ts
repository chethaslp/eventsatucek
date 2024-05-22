import { type ClassValue, clsx } from "clsx";
import 'moment'
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
import RenvnzaLogo from "../public/logos/renvnza.png";
import RenvnzaLogoBlack from "../public/logos/renvnza_black.png";
import moment from "moment";
import { QueryDocumentSnapshot } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const GITHUB_URL = "https://github.com/chethaslp/eventsatucek";
export const GITHUB_API_URL =
  "https://api.github.com/repos/chethaslp/eventsatucek/contributors";

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
    "Renvnza '24": black ? RenvnzaLogoBlack : RenvnzaLogo,
  }[clb];
}

export function parseDate(dateString: string): Date {
  const [day, month, year, hour, minute, second] = dateString
    .split(/\/|\s|:/)
    .map(Number);
  // Note: month - 1 because JavaScript Date months are zero-based
  return new Date(year, month - 1, day, hour, minute, second);
}

export function countdownHelper(millisecond: any):any {
  interface Time{
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
  }

    const result: Time = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  result.days = Math.floor(millisecond / (1000 * 60 * 60 * 24));
  result.hours = Math.floor(
    (millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  result.minutes = Math.floor((millisecond % (1000 * 60 * 60)) / (1000 * 60));
  result.seconds = Math.floor((millisecond % (1000 * 60)) / 1000);

  return result
}


export const GenericConverter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});