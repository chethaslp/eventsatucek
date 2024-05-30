import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event } from "@/lib/types";

/*
  SEND NOTIFICATIONS:
    Endpoint: /api/notify
    Method: POST
    Params: { Body -> FCM Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

  const {title, body, image, token, club, evntId, dt, publish, editLink, rsvp, rsvp_custom_text, rsvp_link, rsvp_total_allowed, rsvp_custom_quest, checkins, venue, hostMail} = await req.json()

  if (!title ||  !body || !image || !club || !dt || (token != process.env.TOKEN)) {
    console.log(token, process.env.TOKEN)
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  const evntDoc = getFirestore().doc(`/events/${evntId}`)

  const eventExists = (await evntDoc.get()).exists


  let rsvp_data: Event['rsvp'] = {
    type: rsvp, 
    status: publish? "open": "closed",
    checkins: checkins
  }
  if (rsvp_data.type == "internal"){
    rsvp_data.custom_quest = rsvp_custom_quest;
    rsvp_data.custom_text = rsvp_custom_text;
    rsvp_data.tpa = rsvp_total_allowed;
  }else if(rsvp_data.type == "external"){
    rsvp_data.link = rsvp_link;
  }
  
  let clubList: string[] = []
  club.split(",").forEach((clb: string) => {clubList.push(clb.trim())})

  await evntDoc.set({
      evntID: evntId,
      club: clubList,
      venue: venue,
      host: hostMail,
      img: image,
      title: title,
      editLink: editLink,
      dt: Timestamp.fromDate(new Date(dt)),
      rsvp: rsvp_data
    }, { merge: true})
    
    
  
  // If publish status is false OR If the event already exists in the DB then, do not publish. 
  if (!publish || eventExists) return NextResponse.json({ msg: "Added." });

  const message : Message = {
    data: {
      title: title,
      message: body,
      icon: resolveClubIcon(clubList? clubList[0]: "/logo.png") || "/logo.png",
      image:  getImgLink(image),
      url: "/e/"+evntId
    },
    topic: "all",
  };
  
  return getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    return NextResponse.json(
      { msg: response },
      { status: 200 }
    );
  })
  .catch((error) => {
    console.log('Error sending message:', error);
    return NextResponse.json(
      { msg: 'Error.' },
      { status: 500 }
    );
  });

}

function getImgLink(link: string) {
  return "/_next/image?w=640&q=75&url=" + encodeURIComponent(
    "https://drive.google.com/uc?export=download&id=" +
    link.replace("https://drive.google.com/open?id=", "")
  );
}

function resolveClubIcon(clb: string): any {
  return {
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
