import Papa from "papaparse";

export function getData(url:string): Promise<string[]> {
  return new Promise((resolve, reject) => {
  Papa.parse<string>(url, {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      let d  = results.data;
      delete d[0];
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

export function getEvent(evntID:string): Promise<string[]> {
  const url = "https://docs.google.com/spreadsheets/d/1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc/gviz/tq"
              + "?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where `B` = '"+evntID+"'");
  return getData(url)
}

export function getUpcomingEvents(): Promise<string[]> {
  const url = "https://docs.google.com/spreadsheets/d/1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc/gviz/tq"
              + "?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where toDate(`H`) > now() order by(`H`)");
  return getData(url)
}

export function getPastEvents(): Promise<string[]> {
  const url = "https://docs.google.com/spreadsheets/d/1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc/gviz/tq"
              + "?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where toDate(`H`) < now() order by(`H`)");
  return getData(url)
}