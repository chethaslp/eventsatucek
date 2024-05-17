import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";
import { UserType, Event_User } from "@/lib/types";
import { GenericConverter } from "@/lib/utils";

export async function getUser(user:User){
    const rslt = await getDoc(doc(db, "/users/" + user.uid));
    return rslt.data() as UserType
}

export async function createUser(user:User,{admYear,batch,rollNumber}: {admYear : string, batch: string, rollNumber: string}){
    const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "Student",
        admYear: admYear,
        batch: batch,
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
    .then(()=> true)
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