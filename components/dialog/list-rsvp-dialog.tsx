import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaFileExport } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  collection, getDocs
} from "firebase/firestore";
import { db } from "../fb/config";
import { Event, Event_RSVP } from "@/lib/types";
import Papa from "papaparse";
import { EditIcon } from "lucide-react";
import { BiExport } from "react-icons/bi";

export function ListRsvpDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: Event;
}) {

  const itemsPerPage = 20;
  const [rsvps, setRsvps] = React.useState<Event_RSVP[]>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentItems, setCurrentItems] = React.useState<Event_RSVP[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredRsvps, setFilteredRsvps] = React.useState<Event_RSVP[]>([]);

  React.useEffect(() => {
    if (!rsvps) return;
    const filtered = rsvps.filter(rsvp => 
      Object.values(rsvp).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredRsvps(filtered);
    setCurrentPage(1);
    const indexOfLastItem = 1 * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filtered.slice(indexOfFirstItem, indexOfLastItem));
  }, [searchTerm, rsvps]);

  React.useEffect(() => {
    if(!open) return 
    getDocs(collection(db, "events", evnt.evntID, "regs")).then((data)=>{
      setRsvps(data.docs.map((doc)=>doc.data() as Event_RSVP))
    })
  }, [open])


  React.useEffect(() => {
    if(rsvps == null) return
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(rsvps.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, rsvps]);

  function exportCSV(){
    if(rsvps == null) return
    const csv = Papa.unparse(rsvps.map((d)=>{
      return {Register_No: d.regNo || "", Name: d.name, Email: d.email, PhoneNumber: d.ph, Status: d.status, RegisteredAt: d.createdAt.toDate().toLocaleString()}
  }))
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evnt.title} - RSVPs at ${new Date().toLocaleString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function resolveDept(regNo: string | undefined): React.ReactNode {
    if (!regNo) return "Unknown Department";
    const deptCode = regNo.substring(0, 3);
    const cls = regNo.split(":")[1];
    return {
      "415": "CSE",
      "416": "IT",
      "412": "ECE",
     }[deptCode] + " " + (cls? (cls!="0"?cls : "") : "")  || "Unknown Department";
  }

  function resolveYear(regNo: string | undefined): React.ReactNode {
    if (!regNo) return " - ";
    const year = parseInt(regNo.substring(3, 5), 10);
    if (isNaN(year)) return "Unknown Year";
    const admissionYear = (new Date().getFullYear() % 100) - (year % 100);
    return admissionYear >= 0 ? `${admissionYear + 1}` : " - ";  
  }

    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className="max-w-[90%] max-h-[90%] dark:bg-[#121212] w-full" onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{evnt.title}</DialogTitle>
            <DialogDescription className="flex flex-col md:flex-row justify-between">
              <span>{evnt.club} <i>~ Posted by {evnt.host}</i></span>
            </DialogDescription>
          </DialogHeader>

          {(rsvps && rsvps.length != 0) ? (<>
            <div className="md:flex flex-col gap-2 hidden">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <h2 className="text-3xl font-bold">
                      {rsvps?.length || 0}
                    </h2>
                    <p className="text-sm">Total Registrations</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10">
                    <h2 className="text-3xl font-bold">
                      {rsvps?.filter(doc => doc.status === "attended").length || 0}
                    </h2>
                    <p className="text-sm">Total Attendees</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10">
                    <h2 className="text-3xl font-bold">
                      {rsvps?.filter(doc => doc.status === "attended").length 
                        ? ((rsvps?.filter(doc => doc.status === "attended").length / rsvps.length) * 100).toFixed(1) + '%'
                        : '0%'}
                    </h2>
                    <p className="text-sm">Attendance Ratio</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <Input
                    type="text"
                    placeholder="Search in all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-[#121212] mb-4 md:mb-0"
                    />
                  <div className="flex flex-col md:flex-row">
                  <Button className="mt-2 mr-2 md:mt-0 w-full md:w-auto" variant={"outline"} onClick={()=> window.open(evnt.editLink, '_blank')}>Edit Event <EditIcon size={15} className="ml-2"/></Button>
                  <Button className="mr-0 md:mr-5 mb-5 md:mb-0 w-full md:w-auto" onClick={exportCSV}>Export as CSV <BiExport size={15} className="ml-2"/></Button>
                  </div>
                </div>
              <div className="overflow-x-auto">
                <div className="overflow-x-auto">
                  <div className="overflow-y-auto max-h-96">
                  <table className="table-auto w-full min-w-[1000px]">
                    <thead>
                    <tr>
                    <th className="px-4 py-2">College</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Candidate Code</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchTerm!="" && (filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center">
                      No results found.
                      </td>
                    </tr>
                    ) : <div> Found {filteredRsvps.length} results.</div>)}
                    {(searchTerm==""? currentItems : filteredRsvps).map((d) => (
                    <tr key={d.email} className="text-center">
                      <td className="border px-4 py-2">{d.clg? d.clg : "University College of Engineering"}</td>
                      <td className="border px-4 py-2">{d.dept? d.dept : resolveDept(d.regNo)}</td>
                      <td className="border px-4 py-2">{resolveYear(d.regNo)}</td>
                      <td className="border px-4 py-2">{d.regNo?.split(":")[0] || "-"}</td>
                      <td className="border px-4 py-2">{d.name}</td>
                      <td className="border px-4 py-2">{d.email}</td>
                      <td className="border px-4 py-2">{d.ph}</td>
                      <td className={cn("border px-4 py-2 capitalize", (d.status=="registered"? "": "bg-green-500"))}>{d.status}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  >
                  Previous
                </Button>
                <span className="flex items-center">
                  Page {currentPage} of {Math.ceil((rsvps?.length || 0) / 20)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((rsvps?.length || 0) / 20)))}
                  disabled={currentPage === Math.ceil((rsvps?.length || 0) / 20)}
                  >
                  Next
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              Display size is too small. Please use a larger device to view this page or use desktop mode.
            </div>
            </>
            ):(
            <div className="flex flex-col gap-2">
              <p>No RSVPs yet.</p>
            </div>
          )}
                  
        </DialogContent>
      </Dialog>
    );
}