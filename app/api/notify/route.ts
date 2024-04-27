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

  const {title, body, image, token, evntId} = await req.json()

  if (!title ||  !body || !image || (token != process.env.TOKEN)) {
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
      image: "https://eventsatucek.vercel.app/_next/image?w=640&q=75&url=" + encodeURIComponent(image),
      url: "https://eventsatucek.vercel.app/event/"+evntId
    },
    topic: "all",
  };

  // const message : Message = {
  //   notification: {
  //     title :title,
  //     body: body,
  //     imageUrl: image,
  //   },
  //   topic: "all"
  // };
  // Subscribe the user corresponding to the registration token to the topic.
  
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
