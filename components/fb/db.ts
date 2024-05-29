import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";
import { UserType, Event_User, ClubType } from "@/lib/types";
import { GenericConverter } from "@/lib/utils";

export async function getUser(user: User) {
  const rslt = await getDoc(doc(db, "/users/" + user.uid));
  if (!rslt.exists()) return null;
  return rslt.data() as UserType;
}
export async function getClub(user: User) {
  const rslt = await getDoc(doc(db, "/clubs/" + user.email));
  if (!rslt.exists()) return null;
  return rslt.data() as ClubType;
}

export async function getProfileData(user: User) {
  const userData = await getDoc(doc(db, "/users/" + user.uid));
  let club = false

  if(userData.data()?.club && userData.data()?.club != "") club = true;
  if (userData.exists()) return { ok: true, data: userData.data(), club: club};
  else return { ok: false, data: null };
}

export async function createUser(
  user: User,
  {
    admYear,
    batch,
    rollNumber,
    gender,
    phoneNumber,
    college,
    branch,
    token
  }: {
    admYear: string;
    batch: string;
    rollNumber: string;
    gender: string;
    phoneNumber: string;
    college: string;
    branch: string;
    token: string;
  }
) {
  const data = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: "Student",
    admYear: admYear,
    batch: batch,
    gender: gender,
    ph: phoneNumber,
    rollNumber: rollNumber,
    college:college,
    branch:branch,
    fcmToken: token
  } as UserType;

  return setDoc(doc(db, "/users/" + user.uid), data)
    .then(() => {
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    })
    .catch(() => false);
}

export async function rsvpEvent(user: User, data: Event_User) {
  data.updatedAt = serverTimestamp();
  return setDoc(doc(db, "users", user.uid, "attendedEvents", data.evntID), data)
    .then(() =>
      setDoc(doc(db, "events", data.evntID, "regs", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        status: "registered",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    )
    .catch((err) => {
      console.error(err);
      return false;
    });
}

export async function getUserEvents(user: User) {
  return getDocs(
    collection(doc(db, "users", user.uid), "attendedEvents").withConverter(
      GenericConverter<Event_User>()
    )
  )
    .then((data) => data.docs)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export async function getClubEvents(type: 'past' | 'upcoming', club: string) {
  let t = where("dt", "<", new Date());
  
  if(type == 'upcoming') t = where("dt", ">", new Date());

    return getDocs(
      query(
        collection(db, "events"),
        where("club", "==", club),
        t )
    )
      .then((data) => data.docs)
      .catch((err) => {
        console.error(err);
        return null;
      });
}

export async function getUserEventStatus(user: User, evntID: string) {
  return getDoc(
    doc(db, "users", user.uid, "attendedEvents", evntID).withConverter(
      GenericConverter<Event_User>()
    )
  ).catch((err) => {
    console.error(err);
    return null;
  });
}
