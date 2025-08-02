import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event, Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto"

/*
    CHECKIN AN USER TO THE EVENT LATERALY
    Endpoint: /api/event/checkin-lateral
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();


export async function GET(req: NextRequest) {

  let decodedToken;

  const evntID = req.headers.get("X-EventID")
  const token = req.headers.get('X-Token')
  if (!token || !evntID) {
    return NextResponse.json(
      { msg: 'Missing Required Fields.' },
      { status: 400 }
    );
  }

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Invalid Token.' },
      { status: 400 }
    );
  }

  const userData = (await getFirestore().collection("users").doc(decodedToken.uid).get()).data()

  if(userData){
    if(!userData.club || userData.club == "") return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 404 }
    );

    // Creating a doc in firestore to store checkin token
    const d = await getFirestore().collection("events").doc(evntID).collection("checkin-tokens").add({uid: decodedToken.uid, evntID: evntID, createdAt: FieldValue.serverTimestamp()})


    //@ts-ignore
    const c = crypto.createCipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0))
    return NextResponse.json({ token: c.update(JSON.stringify([evntID, d.id]),'utf8','base64').toString() + c.final('base64').toString() });
  }else{
    return NextResponse.json(
      { msg: 'User Not Found.' },
      { status: 404 }
    );
  }


}

export async function POST(req: NextRequest) {

  const token = req.headers.get('X-Token')
  const checkinToken = await req.text()

  if (!token || !checkinToken) {
    return NextResponse.json(
      { msg: 'Missing Required Fields.' },
      { status: 400 }
    );
  }

  let decodedToken, decodedUID, club;

  //Verify identity token firebase
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (e) {
    return NextResponse.json(
      { msg: 'Invalid Token.' },
      { status: 400 }
    );
  }

  // Verify token
  try{
    //@ts-ignore
    const cl = crypto.createDecipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0));
    const raw = JSON.parse((cl.update(checkinToken, 'base64', 'utf8') + cl.final('utf8')).toString())



    const doc = await getFirestore().collection("events").doc(raw[0]).collection("checkin-tokens").doc(raw[1]).get()


    if(doc.exists){
      // Check if token is expired
      // TOKEN TTL : 5 mins

      const now = Timestamp.now();
      if(doc.data()?.createdAt.toMillis() < new Timestamp(now.seconds - 300, now.nanoseconds).toMillis()) {
        return NextResponse.json(
          { msg: 'Token Expired.' },
          { status: 401 }
        );
      }

      // Checkin the user to the event
      await Promise.all([
        getFirestore().collection(`/events/${raw[0]}/regs`).doc(decodedToken.uid).update({status: "attended", updatedAt: FieldValue.serverTimestamp()}),
        getFirestore().collection(`/users/${decodedToken.uid}/attendedEvents`).doc(raw[0]).update({status: "Attended", updatedAt: FieldValue.serverTimestamp()})
      ]).catch(e => {
        console.log(e)
        return NextResponse.json(
          { msg: 'Failed to checkin.' },
          { status: 500 }
        );
      });

      // Delete the token
      await doc.ref.delete()

      return NextResponse.json(
        { msg: 'You are checked in!' }
      );
    
    } else{
      return NextResponse.json(
        { msg: 'Unauthorized.' },
        { status: 401 });
    }


  }catch(e){
    console.log(e)
    return NextResponse.json(
      { msg: 'Unauthorized.' },
      { status: 400 }
    );
  }
}
