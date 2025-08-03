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
import { 
  EditIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Users, 
  UserCheck, 
  TrendingUp,
  Eye,
  Filter,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import { BiExport } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function ListRsvpDialog({
  open,
  setOpen,
  evnt,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  evnt: Event;
}) {

  const itemsPerPage = 15;
  const [rsvps, setRsvps] = React.useState<Event_RSVP[]>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentItems, setCurrentItems] = React.useState<Event_RSVP[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredRsvps, setFilteredRsvps] = React.useState<Event_RSVP[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sortField, setSortField] = React.useState<string>("createdAt");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [loading, setLoading] = React.useState(false);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'e':
            event.preventDefault();
            if (evnt.editLink) window.open(evnt.editLink, '_blank');
            break;
          case 'k':
            event.preventDefault();
            document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
            break;
        }
      }
      if (event.key === 'Escape' && !event.ctrlKey && !event.metaKey) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, evnt.editLink, setOpen]);

  React.useEffect(() => {
    if (!rsvps) return;
    let filtered = rsvps.filter(rsvp => {
      const searchFields = [
        rsvp.name,
        rsvp.email,
        rsvp.ph,
        rsvp.clg,
        rsvp.dept,
        rsvp.regNo,
        rsvp.status
      ].filter(Boolean);
      
      return searchFields.some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(rsvp => rsvp.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "createdAt":
          aValue = a.createdAt?.toDate() || new Date(0);
          bValue = b.createdAt?.toDate() || new Date(0);
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredRsvps(filtered);
    setCurrentPage(1);
    const indexOfLastItem = 1 * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filtered.slice(indexOfFirstItem, indexOfLastItem));
  }, [searchTerm, rsvps, statusFilter, sortField, sortDirection]);

  React.useEffect(() => {
    if(!open) return;
    setLoading(true);
    getDocs(collection(db, "events", evnt.evntID, "regs")).then((data)=>{
      setRsvps(data.docs.map((doc)=>doc.data() as Event_RSVP));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [open])


  React.useEffect(() => {
    if(!filteredRsvps) return;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredRsvps.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredRsvps]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  function exportCSV(){
    if(rsvps == null) return;
    const dataToExport = statusFilter !== "all" 
      ? filteredRsvps 
      : (searchTerm === "" ? rsvps : filteredRsvps);
    
    const csv = Papa.unparse(dataToExport.map((d)=>{
      return {
        "Registered At": d.createdAt.toDate().toLocaleString(),
        Name: d.name,
        Email: d.email,
        "Phone Number": d.ph,
        College: d.clg || "University College of Engineering",
        Department: d.dept || resolveDept(d.regNo),
        Year: resolveYear(d.regNo),
        "Candidate Code": d.regNo?.split(":")[0] || "-",
        Status: d.status
      }
    }));
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
        <DialogContent className="max-w-[95%] max-h-[95vh] dark:bg-[#0a0a0a] w-full flex flex-col" onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader className="space-y-3 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6" />
              {evnt.title}
            </DialogTitle>
            <DialogDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-muted-foreground">
                {evnt.club} • <span className="italic">Posted by {evnt.host}</span>
              </span>
              <Badge variant="outline" className="w-fit">
                Event ID: {evnt.evntID}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading registrations...</span>
            </div>
          ) : (rsvps && rsvps.length !== 0) ? (
            <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{rsvps?.length || 0}</h3>
                      <p className="text-sm text-muted-foreground">Total Registrations</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <UserCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {rsvps?.filter(doc => doc.status === "attended").length || 0}
                      </h3>
                      <p className="text-sm text-muted-foreground">Total Attendees</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {rsvps?.filter(doc => doc.status === "attended").length 
                          ? ((rsvps?.filter(doc => doc.status === "attended").length / rsvps.length) * 100).toFixed(1) + '%'
                          : '0%'}
                      </h3>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search registrations... (Ctrl+K)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 dark:bg-[#121212] bg-[#ffff]"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="h-4 w-4 mr-2" />
                        Status: {statusFilter === "all" ? "All" : statusFilter}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("registered")}>
                        Registered
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("attended")}>
                        Attended
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("missed")}>
                        Missed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(evnt.editLink, '_blank')} 
                    className="flex-1 sm:flex-none"
                    title="Edit Event (Ctrl+E)"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Button 
                    onClick={exportCSV} 
                    className="flex-1 sm:flex-none"
                    disabled={!rsvps || rsvps.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Results Info */}
              {searchTerm !== "" || statusFilter !== "all" ? (
                <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3 flex-shrink-0">
                  <span className="text-muted-foreground">
                    Showing {filteredRsvps.length} of {rsvps.length} registrations
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== "all" && ` with status "${statusFilter}"`}
                  </span>
                  {(searchTerm !== "" || statusFilter !== "all") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : null}

              {/* Table */}
              <div className="border rounded-xl overflow-hidden bg-card flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto flex-1">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-4 font-medium">
                          <button
                            onClick={() => handleSort("name")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Name
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="text-left p-4 font-medium">
                          <button
                            onClick={() => handleSort("email")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Email
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="text-left p-4 font-medium">Phone</th>
                        <th className="text-left p-4 font-medium hidden sm:table-cell">College</th>
                        <th className="text-left p-4 font-medium">Department</th>
                        <th className="text-left p-4 font-medium hidden md:table-cell">Year</th>
                        <th className="text-left p-4 font-medium hidden lg:table-cell">Code</th>
                        <th className="text-left p-4 font-medium">
                          <button
                            onClick={() => handleSort("createdAt")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Status & Date
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="text-left p-4 font-medium hidden lg:table-cell">
                          <button
                            onClick={() => handleSort("createdAt")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Registered
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center p-12">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Search className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-medium">No registrations found</h3>
                                <p className="text-sm text-muted-foreground">
                                  Try adjusting your search or filter criteria
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((d, index) => (
                          <tr key={d.email} className="border-b hover:bg-muted/25 transition-colors">
                            <td className="p-4">
                              <div className="font-medium">{d.name}</div>
                              <div className="text-sm text-muted-foreground sm:hidden">{d.email}</div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{d.email}</td>
                            <td className="p-4 text-sm">{d.ph || "-"}</td>
                            <td className="p-4 text-sm hidden sm:table-cell">
                              <div className="max-w-[150px] truncate" title={d.clg || "University College of Engineering"}>
                                {d.clg || "University College of Engineering"}
                              </div>
                            </td>
                            <td className="p-4 text-sm">
                              <div className="max-w-[100px] truncate" title={String(d.dept || resolveDept(d.regNo))}>
                                {d.dept || resolveDept(d.regNo)}
                              </div>
                            </td>
                            <td className="p-4 text-sm hidden md:table-cell">{resolveYear(d.regNo)}</td>
                            <td className="p-4 text-sm font-mono hidden lg:table-cell">
                              {d.regNo?.split(":")[0] || "-"}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <Badge
                                  variant={
                                    d.status === "attended" 
                                      ? "default" 
                                      : d.status === "registered" 
                                      ? "secondary" 
                                      : "destructive"
                                  }
                                  className={cn(
                                    "capitalize w-fit",
                                    d.status === "attended" && "bg-green-500/10 text-green-700 border-green-500/20",
                                    d.status === "registered" && "bg-blue-500/10 text-blue-700 border-blue-500/20",
                                    d.status === "missed" && "bg-red-500/10 text-red-700 border-red-500/20"
                                  )}
                                >
                                  {d.status}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {d.createdAt?.toDate().toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                              {d.createdAt?.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {filteredRsvps.length > itemsPerPage && (
                <div className="flex items-center justify-between flex-shrink-0 pt-4 border-t bg-background">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRsvps.length)} of {filteredRsvps.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px] text-sm">
                      Page {currentPage} of {Math.ceil(filteredRsvps.length / itemsPerPage)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredRsvps.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredRsvps.length / itemsPerPage)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Registrations Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                No one has registered for this event yet. Registrations will appear here once people start signing up.
              </p>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>
    );
}