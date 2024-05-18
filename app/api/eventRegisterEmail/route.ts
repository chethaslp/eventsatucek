import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import { getImgLink } from "@/lib/data";
import moment from "moment";

export async function POST(req: NextRequest) {
    const data = await req.json()
    console.log(data);
    
    try{
  const templateSource = readFileSync(
    "./components/templates/event_register_notification.hbs",
    "utf8"
  );
  const template = Handlebars.compile(templateSource);

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eventsatucek@gmail.com",
      pass: "phmm pwkw hrxc rxry",
    },
  });

  const replacements = {
    eventName: data.evnt[3],
    userName: data.displayName,
    eventPoster:getImgLink(data.evnt[5]),
    eventDate: moment(data.evnt[0], "DD/MM/YYYY HH:mm:ss").format("dddd, Do MMM"),
    eventTime:  moment(data.evnt[0], "DD/MM/YYYY HH:mm:ss").format("h:mm a"),
    eventVenue: data.evnt[10],
    eventDescription: `${data.evnt[4]}`,
    userEmail: data.email,
  };

  const htmlToSend = template(replacements);

  const mailOptions = {
    from: "Events at Ucek <eventsatucek@gmail.com>",
    to: data.email,
    subject: data.evnt[3],
    html: htmlToSend,
  };

  
 // Send email and await the result
 const info = await transporter.sendMail(mailOptions);

 console.log('Email sent: ' + info.response);
 return NextResponse.json({ status: 200 });
} catch (error) {
 console.log(error);
 return NextResponse.json(
   { msg: "Missing required arguments." },
   { status: 400 }
 );
  
}
}