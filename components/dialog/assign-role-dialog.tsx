import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClubs } from "@/lib/data";
import { Roles, UserType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/components/context/auth";

interface AssignRoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: UserType;
}

export function AssignRoleDialog({ open, setOpen, userData }: AssignRoleDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [club, setClub] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const user = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if ((role === "Club Lead" || role === "Club Manager") && !club) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a club for this role.",
      });
      return;
    }
    setLoading(true);

    try {
      const userToken = await user?.getIdToken();
      const response = await fetch("/api/assignRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": userToken || "",
        },
        body: JSON.stringify({
          email,
          role,
          club: club !== "All" ? club : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.msg,
        });
        setEmail("");
        setRole("");
        setClub("");
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.msg,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign role. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setRole("");
      setClub("");
      setOpen(false);
    }
  };

  const roleRequiresClub = role === "Club Lead" || role === "Club Manager";
  const availableRoles = [
    "Student",
    "Club Manager", 
    "Club Lead",
  ];

  return (  
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#121212]">
        <DialogHeader>
          <DialogTitle>Assign Role to User</DialogTitle>
          <DialogDescription>
            Assign a role to a user by their email address. Make sure the user is already registered in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@uck.ac.in"
                className="bg-[#121212] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((roleOption) => (
                    <SelectItem key={roleOption} value={roleOption}>
                      {roleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {roleRequiresClub && (
              <div className="grid gap-2">
                <Label htmlFor="club">Club</Label>
                <Select value={club} onValueChange={setClub} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent defaultChecked={userData.role!="Admin"} defaultValue={userData?.role !== Roles.Admin ? userData?.club : undefined}>
                    {userData?.role == Roles.Admin ? getClubs
                      .filter((clubOption) => clubOption !== "All")
                      .map((clubOption) => (
                        <SelectItem key={clubOption} value={clubOption}>
                          {clubOption}
                        </SelectItem>
                      )): <SelectItem key={userData?.club} value={userData?.club!}>
                          {userData?.club}
                        </SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
