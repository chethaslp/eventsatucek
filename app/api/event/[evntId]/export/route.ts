import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event, Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import Papa from "papaparse";

/*
    GET REGISTRATIONS FOR AN EVENT AS CSV
    Endpoint: /api/event/[evntId]/export
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest, params: {evntId: string}) {

const token = req.headers.get('X-Token')

  if (!token) {
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  let decodedToken;

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  const usr = getFirestore().collection("users").doc(decodedToken.uid);

  if((await usr.get()).exists) {
    const evntDoc = getFirestore().doc(`/events/${params.evntId}`).collection("regs");
  
    let participants:string[][] = [];

    participants.push(["Email", "Name", "Phone", "Status"]);
    (await evntDoc.get()).forEach(async doc => {
      // Get all registrations and convert to csv
      const reg = doc.data() as {email: string, name: string, ph: string};
      participants.push([reg.email, reg.name, reg.ph]);
    });
  
    const response = new NextResponse(Papa.unparse(participants))
    response.headers.set('content-type', 'text/csv');
    return response;
  }else{
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }
}
