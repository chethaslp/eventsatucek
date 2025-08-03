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
import "dotenv/config"

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
    console.log(e);
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
    from: "Events@UCEK <events@uck.ac.in>",
    to: data.user.email,
    subject: "Welcome to Events@UCEK! 👋🎉",
    html : ""
  };

  if(params.t == "welcome"){
    // For Welcome Mail

    template = mail_welcome;
    replacements = {
      userName:  data.user.displayName,
      userEmail:  data.user.email
    };

    try {
      await getAuth().updateUser(tokenData.uid, { phoneNumber: resolvePhoneNumber(data.user.ph) })
    }
    // @ts-ignore
    catch(e){
      console.log(e)
    // @ts-ignore
      if(e.code == "auth/phone-number-already-exists"){
        // TODO: Handle this case
      }
    }

    resp = { msg: "Welcome mail sent." }

  }else if(params.t == "rsvp"){
    // For RSVP Mail

    evntData = (await getFirestore().doc(`events/${data.evnt[1]}`).get()).data() as unknown as Event  // Getting the RSVP infos of the event from the DB


    if(!evntData || !evntData.rsvp){
          return NextResponse.json(
            { msg: 'Event not found or RSVP not enabled.' },
            { status: 404 }
          );
        }
        
    const date = moment(data.evnt[7],"DD/MM/YYYY HH:mm:ss")
    if(evntData.rsvp.type == "external"){
        template = mail_rsvp_external;
        mailOptions.subject = evntData?.title? "Registration: " + evntData.title : ""
    } else if(evntData.rsvp.type == "internal"){
        template = mail_rsvp_internal;
        mailOptions.subject = evntData?.title? "You're in 🎉: " + evntData.title: ""
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
      clubName: (typeof evntData.club == "string") ? evntData.club : evntData.club[0],
      customText: evntData.rsvp.custom_text,
    };

    resp = { ...evntData?.rsvp }
  }else{
    // If its neither of them.
    return NextResponse.json(
      { msg: 'Unknown endpoint' },
      { status: 404 }
    ); 
  }
  
  try {
    Handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
      return (arg1 == arg2) ? options.fn() : options.inverse();
  });
    mailOptions.html = Handlebars.compile(template)(replacements);

    // Send email
    await Promise.all([
      transporter.sendMail(mailOptions),
      sendRegistrationUpdates(data.user, evntData!, data.userData)
    ]);

    return NextResponse.json(resp);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Error Occured." },
      { status: 500 }
    );
  }
}

async function sendRegistrationUpdates(user: any, evnt: Event, userData: any) {
  // Sending registration updates to the webhook if it exists.
  if(evnt.rsvp.webhook && evnt.rsvp.webhook != ""){
    await fetch(evnt.rsvp.webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          name: user.displayName,
          email: user.email,
          phone: resolvePhoneNumber(userData.ph),
        },
        evnt: {
          title: evnt.title,
          id: evnt.evntID,
        }
      }),
    })
    .catch((error) => console.error("Error sending registration updates:", error));
  }
}



function resolveClubIcon(clb: string): any {
  return "https://eventsatucek.vercel.app" + {
    "Google Developers Student Club - UCEK": "/logos/gdsc.png",
    "IEEE SB UCEK": "/logos/ieee.png",
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
    "Hult Prize - UCEK": "/logos/hp.png",
    "Arc": "/logos/arc.png"
  }[clb];
}

function resolvePhoneNumber(ph: string): string {
  // add +91 to the phone number if not present
  if(ph.length == 10) return "+91" + ph;
  else if(ph.length == 12 && ph.startsWith("+91")) return ph; 
  else return ph;
}
