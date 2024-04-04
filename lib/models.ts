import { DocumentData, FieldValue } from "firebase-admin/firestore"
import { PartialWithFieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore"
import { QueryDocumentSnapshot as qds } from "firebase/firestore"


/*
    Data Type for `Question`
*/
export type Question = {
    id: string
    q: string
    flag: string
    hint: string
}

/*
    Data Type for `Quest`
*/
export type Quest = {
    metadata: QuestMetadata 
    qs?: Question[] | ""
    ts?: Team[] | ""
}

export type QuestMetadata = {
    id: string
    name: string
    desc: string
    host?: string
    img?: string

    startTime?: Number
    endTime?: Number
    active?:boolean
}

/*
    Data Type for `Team`
*/
export type User =  {
    uid: string
    name: string
    email: string
    dp: string
    c_quest: string
    c_team: string
}

/*
    Data Type for `Team`
*/
export type Team = {
    id: string
    name: string
    lead: string
    members: string[]

    points: Number
    cq: Question | ""
}


export const GenericConverter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
  });

export const genericConverter = <T>() => ({
    toFirestore(data: Partial<T>) { return data },
    fromFirestore(snapshot: qds): T { return snapshot.data() as T; }
});