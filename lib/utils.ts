import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateArray(dateString?: string): any {
  const event_date: any = {};
  const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Parse the date string
  if (!dateString) {
      return ;
  }

  const date = new Date(dateString);
  // Get day, month, hours, and minutes
  event_date.day = dateString.substring(0, 2);
  event_date.dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  event_date.month = monthNames[parseInt(dateString.substring(3, 5)) - 1];
  event_date.year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours and minutes
  let formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  event_date.from_time = formattedTime + ' ' + (hours < 12 ? 'am' : 'pm');
  return event_date;
}

export function resolveClubIcon(clb:string){
  return {
    "Google Developers Student Club - UCEK" : "/logos/gdsc.png",
    "IEEE - UCEK" : "/logos/ieee.png",
    "Legacy IEDC - UCEK" : "/logos/iedc.png",
    "μlearn - UCEK" : "/logos/muln.png",
    "FOSS - UCEK" : "/logos/foss.png",
    "TinkerHub - UCEK" : "/logos/trh.png",
    "SFI UCEK" : "/logos/sfi.png",
    "Meluhans Dance Club" : "/logos/mdc.png",
    "Music Club - UCEK" : "/logos/mcc.png",
    "Film Club - UCEK" : "/logos/fmc.png"
  }[clb]
}