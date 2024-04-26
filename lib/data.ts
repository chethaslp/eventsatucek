import Papa from "papaparse";

const EVNTS_SHEET_ID = "1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc"


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
              + encodeURIComponent("select * where toDate(`H`) < now() order by(`H`) limit "+n);
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
