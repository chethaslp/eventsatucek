import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

/*
  ADD USER TO NOTIFICATION FEED:
    Endpoint: /api/addSubscriber
    Method: POST
    Params: { Body -> FCM Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {

  const token = await req.text()

  if (!token) {
    return NextResponse.json(
      { msg: 'Missing required arguments.' },
      { status: 400 }
    );
  }

  // Subscribe the user corresponding to the registration token to the topic.
  return getMessaging().subscribeToTopic(token, "all")
    .then((response) => {
        return NextResponse.json(
            { data: response },
            { status: 200 }
          );
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });

}
