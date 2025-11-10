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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const roles = ["Student", "Teacher", "Driver", "Admin"] as const;

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "Student" | "Teacher" | "Driver" | "Admin"
  >("Student");

  // Filter users by active tab role first
  const usersByRole = useMemo(() => {
    return users.filter((user) => user.roles === activeTab);
  }, [users, activeTab]);

  // Then apply search filter to the role-filtered users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return usersByRole;

    const lowercasedSearch = searchTerm.toLowerCase();

    return usersByRole.filter((user) => {
      if (filterField === "all") {
        // Search across all fields
        return Object.values(user).some((value) => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(lowercasedSearch);
        });
      } else {
        // Search in specific field
        const fieldValue = user[filterField as keyof UserData];
        if (fieldValue === null || fieldValue === undefined) return false;
        return fieldValue.toString().toLowerCase().includes(lowercasedSearch);
      }
    });
  }, [usersByRole, searchTerm, filterField]);

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleEditSave = (updatedUser: UserData) => {
    onEdit(updatedUser);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const getFieldDisplayValue = (user: UserData, field: keyof UserData) => {
    const value = user[field];
    if (value === null || value === undefined || value === "") return "N/A";
    return value.toString();
  };

  // Count users for each role for tab badges
  const roleCounts = useMemo(() => {
    return {
      Student: users.filter((user) => user.roles === "Student").length,
      Teacher: users.filter((user) => user.roles === "Teacher").length,
      Driver: users.filter((user) => user.roles === "Driver").length,
      Admin: users.filter((user) => user.roles === "Admin").length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Role Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger
            value="Student"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Students
            <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full min-w-6">
              {roleCounts.Student}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="Teacher"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Teachers
            <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full min-w-6">
              {roleCounts.Teacher}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="Driver"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Drivers
            <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full min-w-6">
              {roleCounts.Driver}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="Admin"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Admins
            <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full min-w-6">
              {roleCounts.Admin}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Search and Filter Controls - Same for all tabs */}
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 flex gap-2">
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-[180px] border-primary/30 focus:ring-primary/20">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="uId">ID</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="batchNo">Batch No</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="phone_number">Phone</SelectItem>
                  <SelectItem value="bloodGroup">Blood Group</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`Search ${activeTab.toLowerCase()}s by ${
                  filterField === "all" ? "any field" : filterField
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/20 text-center">
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      ID
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Username
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Batch No
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Department
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Blood Group
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Role
                    </TableHead>
                    <TableHead className="font-semibold text-primary whitespace-nowrap text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-4xl">🔍</div>
                          <p>No {activeTab.toLowerCase()}s found</p>
                          {searchTerm && (
                            <p className="text-sm">
                              Try adjusting your search or filter
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.uId}
                        className="hover:bg-primary/5 border-b border-border/50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground whitespace-nowrap text-center">
                          {user.uId}
                        </TableCell>
                        <TableCell className="text-foreground whitespace-nowrap text-center">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-foreground whitespace-nowrap text-center">
                          {getFieldDisplayValue(user, "email")}
                        </TableCell>
                        <TableCell className="text-foreground whitespace-nowrap text-center">
                          {user.batchNo}
                        </TableCell>
                        <TableCell className="text-foreground whitespace-nowrap text-center">
                          {user.department}
                        </TableCell>
                        <TableCell className="text-foreground whitespace-nowrap text-center">
                          {getFieldDisplayValue(user, "phone_number")}
                        </TableCell>
                        <TableCell className="text-foreground font-medium whitespace-nowrap text-center">
                          {user.bloodGroup}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                              user.roles
                            )}`}
                          >
                            {user.roles}
                          </span>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
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
          </div>

          {/* Table Footer */}
          <div className="text-sm text-muted-foreground flex justify-between items-center">
            <span>
              Showing {filteredUsers.length} of {roleCounts[activeTab]}{" "}
              {activeTab.toLowerCase()}
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>
            {searchTerm && (
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                Filtered by:{" "}
                {filterField === "all" ? "All Fields" : filterField}
              </span>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
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
