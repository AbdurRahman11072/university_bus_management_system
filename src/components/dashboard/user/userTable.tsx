"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EditUserDialog from "./edit-user-dialog";
import { UserData } from "./userType";

interface UserTableProps {
  users: UserData[];
  onDelete: (userId: number) => void;
  onEdit: (user: UserData) => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-destructive/10 text-destructive border border-destructive/20";
    case "Teacher":
      return "bg-primary/10 text-primary border border-primary/20";
    case "Driver":
      return "bg-secondary/10 text-secondary-foreground border border-secondary/20";
    case "Student":
      return "bg-accent/10 text-accent border border-accent/20";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
};

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.includes(searchTerm) ||
        user.bloodGroup.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleEditSave = (updatedUser: UserData) => {
    onEdit(updatedUser);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search by username, email, phone, or blood group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/30 focus:border-primary focus:ring-primary/20"
        />
      </div>

      <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/20">
              <TableHead className="font-semibold text-primary">ID</TableHead>
              <TableHead className="font-semibold text-primary">
                Username
              </TableHead>
              <TableHead className="font-semibold text-primary">
                Email
              </TableHead>
              <TableHead className="font-semibold text-primary">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-primary">
                Blood Group
              </TableHead>
              <TableHead className="font-semibold text-primary">Role</TableHead>
              <TableHead className="font-semibold text-primary">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">🔍</div>
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.uId}
                  className="hover:bg-primary/5 border-b border-border/50 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {user.uId}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {user.phone_number || "N/A"}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {user.bloodGroup}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                        user.roles
                      )}`}
                    >
                      {user.roles}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                        className="text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(user.uId)}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground flex justify-between items-center">
        <span>
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
