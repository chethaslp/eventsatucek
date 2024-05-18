import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import Handlebars from "handlebars";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const templateSource = readFileSync(
      "./components/templates/register_notification.hbs",
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
      userName: data.displayName,
      userEmail: data.email,
      admYear:data.admYear,
      batch:data.batch,
      gender:data.gender,
      ph:data.ph,
      rollNumber:data.rollNumber
    };

    const htmlToSend = template(replacements);

    const mailOptions = {
      from: "Events at Ucek <eventsatucek@gmail.com>",
      to: data.email,
      subject: "Welcome to Events@UCEK",
      html: htmlToSend,
    };

    // Send email and await the result
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Missing required arguments." },
      { status: 400 }
    );
  }
}
