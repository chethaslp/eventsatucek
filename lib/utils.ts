import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import GDSCLogo from  "../public/logos/gdsc.png"
import IEDCLogo from  "../public/logos/iedc.png"
import FOSSLogo from  "../public/logos/foss.png"
import FMCLogo from  "../public/logos/fmc.png"
import MCCLogo from  "../public/logos/mcc.png"
import IEEELogo from  "../public/logos/ieee.png"
import MDCLogo from  "../public/logos/mdc.png"
import MULNLogo from  "../public/logos/muln.png"
import NSSLogo from  "../public/logos/nss.png"
import SFILogo from  "../public/logos/sfi.png"
import TRHLogo from  "../public/logos/trh.png"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateArray(dateString?: string): any {
  const event_date: any = {};
  const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (!dateString) {
      return ;
  }

  const parts:any = dateString.split(/[\s/:]/); 
  const date = new Date(   // format - YYYY-MM-DDTHH:mm:ss.sss
    parts[2],
    parts[1] - 1,
    parts[0],
    parts[3],
    parts[4],
    parts[5]
  );

  // Get day, month, hours, and minutes
  event_date.day = dateString.substring(0, 2);
  event_date.dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  event_date.month = monthNames[parseInt(dateString.substring(3, 5)) - 1];
  event_date.year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  event_date.from_time = formattedTime + ' ' + (hours < 12 ? 'am' : 'pm');
  return event_date;
}

export function resolveClubIcon(clb:string):any{
  return {
    "Google Developers Student Club - UCEK" : GDSCLogo,
    "IEEE - UCEK" : IEEELogo,
    "Legacy IEDC - UCEK" : IEDCLogo,
    "μlearn - UCEK" : MULNLogo,
    "FOSS - UCEK" : FOSSLogo,
    "TinkerHub - UCEK" : TRHLogo,
    "SFI UCEK" : SFILogo,
    "Meluhans Dance Club" : MDCLogo,
    "Music Club - UCEK" : MCCLogo,
    "Film Club - UCEK" : FMCLogo,
    "NSS - UCEK" : NSSLogo
  }[clb]
}