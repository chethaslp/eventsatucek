import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { Event_User } from "@/lib/types";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto"

/*
    GET TICKET TOKEN
    Endpoint: /api/event/checkin
    Method: POST
    Params: { X-Token -> Firebase ID Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

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

  const userData = (await getFirestore().collection("users").doc(decodedToken.uid).get()).data()

  if(userData){
      if(!userData.club || userData.club == "") return NextResponse.json(
        { msg: 'Unauthorized.' },
        { status: 404 }
      );

      //@ts-ignore
      const c = crypto.createCipheriv('aes-192-cbc', Buffer.from(process.env.ENC_SECRET || "testkey"), Buffer.alloc(16, 0))
      return NextResponse.json({ clubToken: c.update(JSON.stringify([decodedToken.uid, userData.club]),'utf8','base64').toString() + c.final('base64').toString() });
  }else{
    return NextResponse.json(
      { msg: 'Event Not Found.' },
      { status: 404 }
    );
  }
}