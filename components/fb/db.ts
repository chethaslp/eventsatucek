import { CollectionReference, doc, getDoc, setDoc, collection, getDocs, FieldValue, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";

export type UserType = {
    uid: string
    displayName: string,
    email: string,
    role: 'Student' | 'Club' | 'Admin',
    admYear : string,
    batch : string,
    rollNumber: string

    attendedEvents?: CollectionReference,
}

export type attendedEvents = {
    evntID : string,
    evntName : string,
    status : 'attended' | 'registered' | 'missed',
    updatedAt? : FieldValue
}

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

export async function addUserEvent(user:User, data:attendedEvents){
    data.updatedAt = serverTimestamp()
    return setDoc(doc(db, "users", user.uid,'attendedEvents', data.evntID), data)
    .then(()=> true)
    .catch((err)=> {
        console.error(err)
        return false
    })
}

export async function getUserEvents(user:User) {
    return getDocs(collection(doc(db, "users", user.uid),'attendedEvents'))
    .then((data)=> data.docs)
    .catch((err)=> {
        console.error(err)
        return null
    })
}