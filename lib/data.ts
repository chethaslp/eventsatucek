import Papa from "papaparse";

// export const EVNTS_SHEET_ID = "1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc" /* DEV */
export const EVNTS_SHEET_ID = "1JF8JCd01dGp1s3iFiriOUHZxlMro63vCAf5Qsm7RNEE" /* PROD */

export const PUBLIC_KEY = "BPpBelMiDJmKoVfUm-h_23puTUUsmQuhDV8wSih6vN8e9SjQ-a0gGEMUje_pOzoGPDNxNyLZcvEwmIXEW0iaZ5g"

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

export async function getEvents(n="15") {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq="
              + encodeURIComponent("select * where L = 'Yes' order by(`H`) desc");

  const events =  await getData(url)

  // separate past and upcoming events
  const currentTime = new Date();
  const upcomingEvents: string[][] = [];
  const pastEvents: string[][] = [];

  for (const event of events) {
    const [datePart, timePart] = event[7].split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    const eventTime = new Date(year, month - 1, day, hours, minutes, seconds);

    if ( eventTime > currentTime) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  }

  return [upcomingEvents, pastEvents];
}

// Get Upcoming Events
export function getUpcomingEvents(n="20"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where H > now() and L = 'Yes' order by(`H`) limit "+n);
  return getData(url)
}

// Get Past Events
export function getPastEvents(n="20"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where H < now() and L = 'Yes' order by(`H`) desc limit "+n);
  return getData(url)
}



// Get more Events from club.
// params: {
//   clb -> Club Name
//   id -> ID of event to be excluded from the list
// }
export function getMoreClubEvents(clb:string, id:string): Promise<string[][]> {
  clb = clb.includes(",") ? clb.split(",")[0].trim() : clb; 
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where `G` = '" + clb + "' and `B` != '" + id + "' and L = 'Yes' order by `H` limit 3");
  return getData(url)
}

// Sort Events Club Wise
// params: {clb -> Club Name}
export function filterEvents(clbid=0,type="Both",time="All",n="20"): Promise<string[][]> {

  let clb = getClubs[clbid]

  function resolveQuery(){
    var t;
    if (time == 'All') t = "1=1 order by(`H`) desc"
    else if(time == 'Upcoming') t = "H > now() order by(`H`) desc"
    else if(time == 'Past') t = "H < now() order by(`H`) desc"

    if(clbid == 0 && type == "Both") return "select * where L = 'Yes' and "+ t /* Returns if club is set to "All" and type is "Both" */
    if(clbid == 0) return `select * where I = '${type}' and L = 'Yes' and ${t} `/* Returns if club is set to "All" and type is different */
    if(type == "Both")  return `select * where G like "%${clb}%" and L = 'Yes' and ${t}` /* Returns if club is different and type is set to "Both" */
    return `select * where G like "%${clb}%" and  I = '${type}' and L = 'Yes' and ${t}` /* Returns if club and type is different. */
  }

  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent(resolveQuery());
  return getData(url)
}

export function search(keyword:string,n="20"): Promise<string[][]> {
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent(`select * where L = 'Yes' and (D like "%${keyword}%" or E contains '${keyword}' or G contains '${keyword}' or H contains '${keyword}' or K contains '${keyword}') order by(\`H\`) desc limit ${n}`);
  return getData(url)
}

export const getClubs = [
  "All",
  "IEEE SB UCEK",
  "Legacy IEDC - UCEK",
  "μlearn - UCEK",
  "FOSS - UCEK",
  "NSS - UCEK",
  "GDSC - UCEK",
  "SFI UCEK",
  "Meluhans Dance Club",
  "Music Club - UCEK",
  "IEEE RAS SBC UCEK",
  "Hult Prize UCEK",
  "Arc"
]
