"use client";

import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "@/components/homeComponent/profile/profile-card";
import EditProfileDialog from "@/components/homeComponent/profile/edit-profile";
import { User as UserIcon, Settings, RefreshCw, Phone, Droplets, Building, Calendar, Badge, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  console.log("ProfilePage - User data:", user); // Debug log
  console.log("ProfilePage - Auth loading:", isLoading); // Debug log

  // Redirect if not authenticated

  const handleUpdateProfile = async (updatedUserData: any) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/user/update-user/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Update successful:", result);

      // Reload the page to reflect changes
      window.location.reload();

      return result.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Checking authentication...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // If no user after loading, show redirect message
  if (!user) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please log in to view your profile.
              </p>
              <Button onClick={() => router.push("/auth/login")}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section with Profile Image */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 overflow-hidden bg-muted shadow-lg">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-primary" />
                    </div>
                  )}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="space-y-2 ">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.username || "User"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {user.roles ? `${user.roles} Account` : "User Account"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span>ID: {user.uId || user._id}</span>
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <span>•</span>
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <EditProfileDialog
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>
              <Link href="/survey">
                <Button variant="default">Add Survey</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Content - Pass user directly */}
        <div className="space-y-6">
          <ProfileCard user={user} />

          {/* Additional Info Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    Account Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-medium text-foreground">
                        {user.uId || user._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium text-foreground capitalize">
                        {user.roles?.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      Privacy Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      Notification Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional User Information Section */}
          {(user.phone_number ||
            user.bloodGroup ||
            user.department ||
            user.batchNo ||
            user.driverLicence) && (
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.phone_number && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {user.phone_number}
                      </p>
                    </div>
                  )}

                  {user.bloodGroup && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Droplets className="w-4 h-4" />
                        <span>Blood Group</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {user.bloodGroup}
                      </p>
                    </div>
                  )}

                  {user.department && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span>Department</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {user.department}
                      </p>
                    </div>
                  )}

                  {user.batchNo && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Batch Number</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {user.batchNo}
                      </p>
                    </div>
                  )}

                  {user.driverLicence && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className="w-4 h-4" />
                        <span>Driver License</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {user.driverLicence}
                      </p>
                    </div>
                  )}

                  {user.licenceExpire && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>License Expiry</span>
                      </div>
                      <p className="font-medium text-foreground text-lg">
                        {new Date(user.licenceExpire).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Statistics Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-primary" />
                Profile Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">1</div>
                  <div className="text-xs text-muted-foreground">Profile</div>
                </div>
                <div className="text-center p-4 bg-green-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    Active
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
                <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">Joined</div>
                </div>
                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.avatar_url ? "✓" : "✗"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.avatar_url ? "Photo" : "No Photo"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
