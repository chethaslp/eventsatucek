import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event, Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto"
import Papa from "papaparse";

/*
    GET TICKET TOKEN
    Endpoint: /api/event/checkin
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest, {params}: {params :{evntId: string}}) {

  const token = req.headers.get('X-Token')

  if (!token) {
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  let decodedToken, decodedUID;

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  const evntDoc = await getFirestore().doc(`events/${params.evntId}`).get();

  if(evntDoc.exists){
      const d = evntDoc.data() as {host :string, evntSecretKey: string}

      const regUser = await getFirestore().collection(`/events/${params.evntId}/regs`).doc(decodedToken.uid).get();
      const userData = await getFirestore().collection(`/users/${decodedToken.uid}/attendedEvents`).doc(params.evntId).get();

      if(!regUser.exists || !userData.exists) return NextResponse.json(
        { msg: 'Unauthorized.' },
        { status: 404 }
      );

      if(((regUser.data() as {status:string}).status.toLocaleLowerCase() != "registered") || ((userData.data() as Event_User).status.toLocaleLowerCase() != "registered")) return NextResponse.json(
        { msg: 'Ticket Expired.' },
        { status: 409 }
      );

      const c = crypto.createCipheriv('aes-192-cbc', Buffer.from(d.evntSecretKey), Buffer.alloc(16, 0))
      return NextResponse.json({ ticketToken: params.evntId + "." + c.update(decodedToken.uid,'utf-8','base64').toString() + c.final('base64').toString() });
  }else{
    return NextResponse.json(
      { msg: 'Event Not Found.' },
      { status: 404 }
    );
  }
}