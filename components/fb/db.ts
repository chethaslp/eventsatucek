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
import { User, getAuth, updatePhoneNumber } from "firebase/auth";
import { UserType, Event_User, ClubType } from "@/lib/types";
import { GenericConverter } from "@/lib/utils";
import { log } from "util";

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
  let club = false;

  if (userData.data()?.club && userData.data()?.club != "") club = true;
  if (userData.exists()) return { ok: true, data: userData.data(), club: club };
  else return { ok: false, data: null };
}

export async function createUser(
  user: User,
  {
    admYear,
    batch,
    admissionNumber,
    registrationNumber,
    gender,
    phoneNumber,
    college,
    branch,
    token,
  }: {
    admYear: string;
    batch: string;
    admissionNumber: string;
    registrationNumber: string;
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
    admissionNumber: admissionNumber,
    registrationNumber: registrationNumber,
    college: college,
    branch: branch,
    fcmToken: token,
    wifiPass: "",
    wifiUsername: "",
  } as UserType;

  return setDoc(doc(db, "/users/" + user.uid), data)
    .then(() => {
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    })
    .catch(() => false);
}

export async function rsvpEvent(user: User, data: Event_User, userData?: UserType) {
  data.updatedAt = serverTimestamp();
  return setDoc(doc(db, "users", user.uid, "attendedEvents", data.evntID), data)
    .then(() =>
      setDoc(doc(db, "events", data.evntID, "regs", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        regNo: userData?.registrationNumber,
        ph: user.phoneNumber,
        clg: userData?.college,
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

export async function checkAdmissionNumber(admissionNumber: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("admissionNumber", "==", admissionNumber));

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking admission number: ", error);
    return false;
  }
}

export async function getClubEvents(type: "past" | "upcoming", club: string) {
  let t = where("dt", "<", new Date());

  if (type == "upcoming") t = where("dt", ">", new Date());

  return getDocs(query(collection(db, "events"), where("club", "array-contains", club), t))
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

export async function updateUserProfile(user: User,{
  admYear,
  batch,
  admissionNumber,
  registrationNumber,
  wifiUsername,
  wifiPass,
}: {
  admYear: string;
  batch: string;
  admissionNumber: string;
  registrationNumber: string;
  wifiUsername: string,
  wifiPass: string,
}) {
  const userRef = doc(db, "users", user.uid);
  return getDoc(userRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        return setDoc(userRef, {
          ...docSnap.data(),
          admYear: admYear,
          batch: batch,
          admissionNumber: admissionNumber,
          registrationNumber: registrationNumber,
          wifiUsername: wifiUsername,
          wifiPass: wifiPass,
        });
      } else {
        throw new Error("User does not exist");
      }
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}
