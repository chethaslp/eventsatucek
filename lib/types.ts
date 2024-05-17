import { CollectionReference, FieldValue } from "firebase/firestore";

export type UserType = {
    uid: string;
    displayName: string;
    email: string;
    role: 'Student' | 'Club' | 'Admin';
    admYear: string;
    batch: string;
    rollNumber: string;

    attendedEvents?: CollectionReference;
};

export type Event_User = {
    evntID: string;
    evntName: string;
    club: string;
    status: 'attended' | 'registered' | 'missed';
    dt: string;
    updatedAt?: FieldValue;
};


export type Event = {
    evntID: string;
    title: string;
    status: 'open' | 'closed' | 'cancelled';
    club: string;
    img: string;
    editLink: string;
    updatedAt?: FieldValue;
};