import { CollectionReference, FieldValue, Timestamp } from "firebase/firestore";

export type UserType = {
    uid: string;
    displayName: string;
    club?: string;
    email: string;
    role: 'Student' | 'Club' | 'Admin';
    admYear: string;
    batch: string;
    admissionNumber: string;
    college: string;
    branch: string;
    attendedEvents?: CollectionReference;
    fcmToken?: string;
    wifiUsername?: string;
    wifiPass?: string;
    registrationNumber?: string;
};

export type ClubType = {
    displayName: string;
    email: string;
    role: 'Club';
    about: string;
    hostedEvents?: CollectionReference;
};

export type Event_User = {
    evntID: string;
    evntName: string;
    club: string;
    status: 'Attended' | 'Registered' | 'Missed';
    dt: string;
    updatedAt?: FieldValue;
};

export type Event_RSVP = {
    status: 'attended' | 'registered' | 'missed';
    email: string;
    name: string;
    ph?: string;
    uid: string;
    regNo?: string;
    updatedAt?: Timestamp;
    createdAt: Timestamp;
};


export type Event = {
    evntID: string;
    dt: Timestamp;
    host:string;
    title: string;
    club: string;
    img: string;
    editLink: string;
    
    rsvp: {
        status: 'open' | 'closed' | 'cancelled';
        type: 'internal' | 'external' | 'none';
        custom_text?: string;
        link?: string;
        tpa?: number;
        checkins: boolean;
        custom_quest?: string;
    }

    updatedAt?: FieldValue;
};