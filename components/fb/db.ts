import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";
import { UserType, Event_User } from "@/lib/types";
import { GenericConverter } from "@/lib/utils";

export async function getUser(user:User){
    const rslt = await getDoc(doc(db, "/users/" + user.uid));
    return rslt.data() as UserType
}

export async function createUser(user:User,{admYear, batch, rollNumber, gender, phoneNumber }: {admYear : string, batch: string, rollNumber: string, gender: string, phoneNumber: string}){
    const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "Student",
        admYear: admYear,
        batch: batch,
        gender: gender,
        ph: phoneNumber,
        rollNumber: rollNumber
     } as UserType

        return setDoc(doc(db, "/users/" + user.uid),data).then(()=> {
            localStorage.setItem('user', JSON.stringify(data)) 
            return data
        }).catch(()=> false)
}

export async function rsvpEvent(user:User, data:Event_User){
    data.updatedAt = serverTimestamp()
    return setDoc(doc(db, "users", user.uid,'attendedEvents', data.evntID), data)
    .then(()=> setDoc(doc(db, "events", data.evntID, "regs", user.uid), { uid:user.uid, name: user.displayName, email: user.email, status: "registered", updatedAt: serverTimestamp(), createdAt: serverTimestamp() }))
    .catch((err)=> {
        console.error(err)
        return false
    })
}

export async function getUserEvents(user:User) {
    return getDocs(collection(doc(db, "users", user.uid),'attendedEvents').withConverter(GenericConverter<Event_User>()))
    .then((data)=> data.docs)
    .catch((err)=> {
        console.error(err)
        return null
    })
}


export async function getUserEventStatus(user:User, evntID: string) {
    return getDoc(doc(db, "users", user.uid,'attendedEvents',evntID).withConverter(GenericConverter<Event_User>()))
    .catch((err)=> {
        console.error(err)
        return null
    })
}