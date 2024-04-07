import Papa from "papaparse";

export function getData(): Promise<string[]> {
  const url =
    "https://docs.google.com/spreadsheets/d/1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc/gviz/tq?tqx=out:csv&sheet=s1";
  return new Promise((resolve, reject) => {
  Papa.parse<string>(url, {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      let d  = results.data;
      delete d[0];
      console.log(d);
      resolve(d);
    },
    error(error) {
      reject(error);
    }
  });
});
}