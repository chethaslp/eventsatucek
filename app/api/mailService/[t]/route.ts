import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import { getImgLink } from "@/lib/data";
import moment from "moment";
import path from "path";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from "firebase-admin/firestore";
import { Event } from "@/lib/types";
import mail_welcome from "./templates/mail_welcome";
import mail_rsvp_external from "./templates/mail_rsvp_external";
import mail_rsvp_internal from "./templates/mail_rsvp_internal";

export async function POST(req: NextRequest, {params}:{params:{ t: string }}) {

  const data = await req.json();
  const token = req.headers.get("X-Token")
  let evntData, resp, tokenData;

  if (!token) return NextResponse.json(
    { msg: 'Missing required arguments.' },
    { status: 400 }
  ); 


  !getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

  try {
  tokenData = await getAuth().verifyIdToken(token)
  } catch (e) {
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 401 }
    );
  }

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  let template, replacements

  const mailOptions = {
    from: "Events@UCEK <eventsatucek@gmail.com>",
    to: data.user.email,
    subject: "Welcome to Events@UCEK!",
    html : ""
  };

  if(params.t == "welcome"){
    // For Welcome Mail

    template = mail_welcome;
    replacements = {
      userName:  data.user.displayName,
      userEmail:  data.user.email
    };

    await getAuth().updateUser(tokenData.uid, { phoneNumber: resolvePhoneNumber(data.user.ph) })

    resp = { msg: "Welcome mail sent." }

  }else if(params.t == "rsvp"){
    // For RSVP Mail

    evntData = (await getFirestore().doc(`events/${data.evnt[1]}`).get()).data() as unknown as Event  // Getting the RSVP infos of the event from the DB

    const date = moment(data.evnt[7],"DD/MM/YYYY HH:mm:ss")
    if(evntData.rsvp.type == "external"){
        template = mail_rsvp_external;
    } else if(evntData.rsvp.type == "internal"){
        template = mail_rsvp_internal;
    } else {
      // RSVP is set to none. In this case no need to sent the mail.

      return NextResponse.json(
        { msg: 'RSVP not enabled.' },
        { status: 406 }
      ); 

    }
    
    replacements = {
      rsvpData: evntData.rsvp,
      eventName: evntData.title,
      eventID: evntData.evntID,
      userName: data.user.displayName,
      eventPoster: getImgLink(evntData.img),
      eventDate: date?.format("dddd, Do MMM YYYY"),
      eventTime: date?.format("h:mm a"),
      eventVenue: data.evnt[10],
      userEmail: data.user.email,
      clubIcon: resolveClubIcon((typeof evntData.club == "string") ? evntData.club : evntData.club[0]),
    };
    evntData.rsvp.custom_text

    resp = { ...evntData?.rsvp }
  }else{
    // If its neither of them.
    return NextResponse.json(
      { msg: 'Unknown endpoint' },
      { status: 404 }
    ); 
  }
  
  try {
    mailOptions.html = Handlebars.compile(template)(replacements);

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(resp);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Error Occured." },
      { status: 500 }
    );
  }
}


function resolveClubIcon(clb: string): any {
  return "https://eventsatucek.vercel.app" + {
    "Google Developers Student Club - UCEK": "/logos/gdsc.png",
    "IEEE - UCEK": "/logos/ieee.png",
    "Legacy IEDC - UCEK": "/logos/iedc.png",
    "μlearn - UCEK": "/logos/muln.png",
    "FOSS - UCEK": "/logos/foss.png",
    "TinkerHub - UCEK": "/logos/trh.png",
    "SFI UCEK": "/logos/sfi.png",
    "Meluhans Dance Club": "/logos/mdc.png",
    "Music Club - UCEK": "/logos/mcc.png",
    "Film Club - UCEK": "/logos/fmc.png",
    "NSS - UCEK": "/logos/nss.png",
    "Renvnza '24": "/logos/renvnza.png",
  }[clb];
}

function resolvePhoneNumber(ph: string): string {
  // add +91 to the phone number if not present
  if(ph.length == 10) return "+91" + ph;
  else if(ph.length == 12 && ph.startsWith("+91")) return ph; 
  else return ph;
}
