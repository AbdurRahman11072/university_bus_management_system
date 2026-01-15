"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { API_BASE } from "@/lib/config";
import UserTable from "./userTable";
import { UserData } from "./userType";

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/user/get-all-user`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log to see actual structure
      setUsers(data.data || data);
    } catch (err) {
      let errorMessage = "Failed to fetch users";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("[v0] Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // Find the user to get their MongoDB _id
      const userToDelete = users.find((user) => user.uId === userId);
      if (!userToDelete) {
        throw new Error("User not found");
      }

      // Use MongoDB _id for deletion
      const response = await fetch(
        `${API_BASE}/user/delete-user/${userToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove from local state using uId
      setUsers(users.filter((user) => user.uId !== userId));
    } catch (err) {
      console.error("[v0] Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = async (updatedUser: UserData) => {
    try {
      // Use MongoDB _id for update
      const response = await fetch(
        `${API_BASE}/user/update-user/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update local state using uId
      setUsers(
        users.map((user) => (user.uId === updatedUser.uId ? updatedUser : user))
      );
    } catch (err) {
      console.error("[v0] Error updating user:", err);
      alert("Failed to update user");
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage and view all users in the system
            </p>
          </div>
          {/* <Link href={`/auth/login`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 h-auto">
              {" "}
              Create New User
            </Button>
          </Link> */}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-muted-foreground">Loading users...</span>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <UserTable
            users={users}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </main>
  );
}
