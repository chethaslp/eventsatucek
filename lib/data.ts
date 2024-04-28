"use client";

import Papa from "papaparse";

const EVNTS_SHEET_ID = "1JF8JCd01dGp1s3iFiriOUHZxlMro63vCAf5Qsm7RNEE"
export const PUBLIC_KEY = "BPpBelMiDJmKoVfUm-h_23puTUUsmQuhDV8wSih6vN8e9SjQ-a0gGEMUje_pOzoGPDNxNyLZcvEwmIXEW0iaZ5g"
export const firebaseConfig = {
  apiKey: "AIzaSyAdSmj_Dt2z3KTVDZcprly2GCT_0UGKZOk",
  authDomain: "proj-eventsatucek.firebaseapp.com",
  projectId: "proj-eventsatucek",
  messagingSenderId: "747267605566",
  appId: "1:747267605566:web:e6d8dbb9f4a16dbf2e7d6f"
};

// const messaging = getMessaging(app);

// getToken(messaging, { vapidKey: PUBLIC_KEY }).then((currentToken) => {
//   if (currentToken) {

//   } else {
//     console.log('No registration token available. Request permission to generate one.');

//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
// });



export function getData(url:string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
  Papa.parse<string[]>(url, {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      let d  = results.data;
      d.shift()
      resolve(d);
    },
    error(error) {
      reject(error);
    }
  });
});
}

export function getImgLink(link: string) {
  return (
    "https://drive.google.com/uc?export=download&id=" +
    link.replace("https://drive.google.com/open?id=", "")
  );
}

// Get Event details
export function getEvent(evntID:string): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where `B` = '"+evntID+"' limit 1");
  return getData(url)
}

// Get Upcoming Events
export function getUpcomingEvents(n="20"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where toDate(`H`) > now() order by(`H`) limit "+n);
  return getData(url)
}

// Get Past Events
export function getPastEvents(n="20"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where toDate(`H`) < now() order by(`H`) desc limit "+n);
  return getData(url)
}



// Sort Events Club Wise
// params: {clb -> Club Name}
export function getClubEvents(clb:string,n="10"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where `G` = '"+clb+"' limit "+n);
  return getData(url)
}
