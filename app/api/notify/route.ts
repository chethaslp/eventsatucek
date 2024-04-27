import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';

/*
  SEND NOTIFICATIONS:
    Endpoint: /api/notify
    Method: POST
    Params: { Body -> FCM Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

  const {title, body, image, token, club, evntId} = await req.json()

  if (!title ||  !body || !image || !club || (token != process.env.TOKEN)) {
    console.log(token, process.env.TOKEN)
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }
  const message : Message = {
    data: {
      title: title,
      message: body,
      icon: resolveClubIcon(club) || "",
      image:  getImgLink(image),
      url: "/event/"+evntId
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
  }[clb];
}