import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event, Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto"
import Papa from "papaparse";

/*
    CHECKIN AN USER TO THE EVENT
    Endpoint: /api/event/checkin
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

  const token = req.headers.get('X-Token')
  const ticketToken = await req.text()

  if (!token || !ticketToken) {
    return NextResponse.json(
      { msg: 'Missing Required Fields.' },
      { status: 400 }
    );
  }

  let decodedToken, decodedUID;

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Invalid Token.' },
      { status: 400 }
    );
  }

  const [evntId, data] = ticketToken.split(".");
  const evntDoc = await getFirestore().doc(`/events/${evntId}`).get();
  const hostData = (await getFirestore().doc(`/users/${decodedToken.uid}`).get()).data() as {club: string, role: string}

  if(evntDoc.exists){
      const d = evntDoc.data() as {host :string, evntSecretKey: string, club: string[]}
      if(hostData.role != "Admin" && d.club.includes(hostData.club)) return NextResponse.json(
        { msg: 'Unauthorized.' },
        { status: 401 }
      );
      try{
        //@ts-ignore
        const c = crypto.createDecipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0))
        //@ts-ignore
        decodedUID = (c.update(data, 'base64', 'utf8') + c.final('utf8')).toString();
        
      }catch(e){
        console.log(e)
        return NextResponse.json(
          { msg: 'Unauthorized.' },
          { status: 400 }
        );
      }

      const regUser = await getFirestore().collection(`/events/${evntId}/regs`).doc(decodedUID).get();
      const userData = await getFirestore().collection(`/users/${decodedUID}/attendedEvents`).doc(evntId).get();


      if(!regUser.exists || !userData.exists) return NextResponse.json(
        { msg: 'Unauthorized.' },
        { status: 404 }
      );

      if(((regUser.data() as {status:string}).status.toLocaleLowerCase() != "registered") || ((userData.data() as Event_User).status.toLocaleLowerCase() != "registered")) return NextResponse.json(
        { msg: 'This user is already checked in.' },
        { status: 409 }
      );

      regUser.ref.update({status: "attended"})    
      userData.ref.update({status: "Attended"}) 
      
      return NextResponse.json(
        { msg: 'User Checked in.' },
      );
      
  }else{
    return NextResponse.json(
      { msg: 'Event Not Found.' },
      { status: 404 }
    );
  }
}
