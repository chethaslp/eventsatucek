import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event, Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto"

/*
    CHECKIN AN USER TO THE EVENT
    Endpoint: /api/event/checkin
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

  const token = req.headers.get('X-Token')
  const clubToken = req.headers.get('X-ClubToken')
  const ticketToken = await req.text()

  if (!token || !ticketToken || !clubToken) {
    return NextResponse.json(
      { msg: 'Missing Required Fields.' },
      { status: 400 }
    );
  }

  let decodedToken, decodedUID, club;
  const [evntId, data] = ticketToken.split(".");

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Invalid Token.' },
      { status: 400 }
    );
  }

  //Verify ticket token
  try{
    //@ts-ignore
    const c = crypto.createDecipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0));
    //@ts-ignore
    decodedUID = (c.update(data, 'base64', 'utf8') + c.final('utf8')).toString();
  }catch(e){
    console.log(e)
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  // Verify club token
  try{
    //@ts-ignore
    const cl = crypto.createDecipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0));
    const raw = JSON.parse((cl.update(clubToken, 'base64', 'utf8') + cl.final('utf8')).toString())

    // if(raw[0] != decodedUID) return NextResponse.json(
    //   { msg: 'Unauthorized.' },
    //   { status: 401 }
    // );

    club = raw[1];
  }catch(e){
    console.log(e)
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }

  const evntDoc = await getFirestore().doc(`/events/${evntId}`).get();

  if(evntDoc.exists){
      const d = evntDoc.data() as {host :string, evntSecretKey: string, club: string[]}

      if(club != "All Clubs") {
        if(!d.club.includes(club)) return NextResponse.json(
          { msg: 'Unauthorized.' },
          { status: 401 }
        );
      } 

      await Promise.all([
        getFirestore().collection(`/events/${evntId}/regs`).doc(decodedUID).update({status: "attended", updatedAt: FieldValue.serverTimestamp()}),
        getFirestore().collection(`/users/${decodedUID}/attendedEvents`).doc(evntId).update({status: "Attended", updatedAt: FieldValue.serverTimestamp()})
      ]).catch(e => {
        console.log(e)
        return NextResponse.json(
          { msg: 'Failed to checkin.' },
          { status: 500 }
        );
      });
      
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
