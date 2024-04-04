import { NextResponse } from "next/server";
import { Question, GenericConverter, QuestMetadata, User, Team } from "@/lib/models";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import adminApp from "@/components/fb/admin";

const adminDb = getFirestore(adminApp)
const adminAuth = getAuth(adminApp)

export async function POST(req: Request, {params}:{params:{ qid: string }}) {

  const qid:string = params.qid
  const qRef = adminDb.collection("quest");
  const uRef = adminDb.collection("users");
  const { token, tid }  = await req.json()

  if (!token || !tid) {
    return NextResponse.json(
      { msg: 'Missing required arguments.' },
      { status: 400 }
    );
  }


  return await adminAuth.verifyIdToken(token)
  .then(async (decodedToken) => {
    const u = await uRef.doc(decodedToken.uid).withConverter(GenericConverter<User>()).get()
    if(u.exists){
      // Checks if the database has `c_team` and `c_quest` assigned to the user.
      if (u.data()?.c_team == ("" ||undefined) || u.data()?.c_quest == ("" || undefined)) return NextResponse.json({ msg: "Join a Quest/Team." },{ status: 400 })

      // Gets the Quest's metadata
      const qMetadata =  (await qRef.doc(qid+'/metadata').withConverter(GenericConverter<QuestMetadata>()).get()).data()
      if(!qMetadata?.active) return NextResponse.json( { msg: "Quest not started yet." },{ status: 401 })

      // Get Team Data
      const teamData =  (await qRef.doc(qid+'/ts/'+tid).withConverter(GenericConverter<Team>()).get())
      if(!teamData.exists) return NextResponse.json( { msg: "Team not registered." },{ status: 401 })

      // Get a random Question from the Quest and assign it to the team.
      const qs =  (await qRef.doc(qid+'/qs').withConverter(GenericConverter<Question[]>()).get()).data()
      if(!qs) return NextResponse.json( { msg: "No Questions available" },{ status: 500 })
      const q = qs[Math.floor(Math.random() * qs.length)]
      
      return NextResponse.json({ ...q });
      
    }else{
      return NextResponse.json(
        { msg: "Unauthenticated." },
        { status: 401 }
      )
    }
  })
  .catch(() => {
    return NextResponse.json(
      { msg: "Unauthenticated." },
      { status: 401 }
    )
  });
}