"use client";

import { useState, useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { UserData } from "@/components/homeComponent/profile/user";
import ProfileCard from "@/components/homeComponent/profile/profile-card";
import EditProfileDialog from "@/components/homeComponent/profile/edit-profile";

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/users");
      const data = await response.json();
      const users = data.data || data;
      if (users.length > 0) {
        setUser(users[0]);
      }
    } catch (err) {
      console.error("[v0] Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              User Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
          {!loading && user && (
            <EditProfileDialog
              user={user}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-muted-foreground">
              Loading profile...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">{error}</p>
            <button
              onClick={fetchUserProfile}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && user && <ProfileCard user={user} />}
      </div>
    </main>
  );
}
