// edit-profile.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Edit2,
  User,
  Phone,
  Droplets,
  Building,
  Calendar,
  Camera,
} from "lucide-react";
import { ImageUpload } from "@/components/multiStepSignUp/ImageUpload";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface EditProfileDialogProps {
  user: any;
  onUpdateProfile: (userData: any) => Promise<any>;
}

export default function EditProfileDialog({
  user,
  onUpdateProfile,
}: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
    bloodGroup: user.bloodGroup || "",
    department: user.department || "",
    batchNo: user.batchNo || "",
  });

  // Function to fetch updated user data and update cookie
  const fetchUpdatedUserData = async (userId: string) => {
    try {
      console.log("Fetching updated user data for ID:", userId);

      const response = await fetch(
        `http://localhost:5000/api/v1/user/get-user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fetched user data:", result);

      // Handle different response structures
      if (result.success && result.data) {
        return result.data; // If API returns { success: true, data: user }
      } else if (result.user) {
        return result.user; // If API returns { user: userData }
      } else if (result._id) {
        return result; // If API returns user object directly
      } else {
        console.error("Unexpected API response structure:", result);
        throw new Error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
      throw error;
    }
  };

  // Function to update the user_data cookie
  const updateUserCookie = (userData: any) => {
    try {
      console.log("Updating cookie with:", userData);

      // Set cookie with updated user data
      Cookies.set("user_data", JSON.stringify(userData), {
        expires: 7, // 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      console.log("User cookie updated successfully");

      // Verify cookie was set
      const verifyCookie = Cookies.get("user_data");
      console.log("Cookie verification:", verifyCookie ? "Success" : "Failed");
    } catch (error) {
      console.error("Error updating user cookie:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty fields and include avatar_url
      const updateData = {
        ...Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== "")
        ),
        ...(avatarUrl && { avatar_url: avatarUrl }),
      };

      console.log("Updating profile with data:", updateData);
      console.log("User ID:", user._id);

      // Make the PUT request to update the user
      const updateResponse = await fetch(
        `http://localhost:5000/api/v1/user/update-user/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updateResult = await updateResponse.json();
      console.log("Update successful:", updateResult);

      // Try multiple approaches to get updated data
      let updatedUserData;

      try {
        // Approach 1: Fetch from get-user API
        console.log("Attempting to fetch updated data from API...");
        updatedUserData = await fetchUpdatedUserData(user._id);
      } catch (fetchError) {
        console.warn(
          "Failed to fetch from API, using update response:",
          fetchError
        );

        // Approach 2: Use the response from update API if it contains user data
        if (updateResult.data) {
          updatedUserData = updateResult.data;
        } else if (updateResult.user) {
          updatedUserData = updateResult.user;
        } else {
          // Approach 3: Construct from existing user + update data
          updatedUserData = {
            ...user,
            ...updateData,
            avatar_url: avatarUrl || user.avatar_url,
          };
          console.log("Constructed user data from update:", updatedUserData);
        }
      }

      // Update the user_data cookie with the fresh data
      updateUserCookie(updatedUserData);

      // Call the parent's update function with the updated user data
      await onUpdateProfile(updatedUserData);

      toast.success("Profile updated successfully!");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle>Edit Profile</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Update your profile information and photo
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Profile Photo
            </Label>
            <div className="flex items-start gap-6">
              {/* Current Profile Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden bg-muted">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload Component */}
              <div className="flex-1">
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  previewUrl={avatarUrl}
                  label="Upload profile photo"
                  compact={true}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a clear photo of yourself for your profile
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phone_number"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label
                htmlFor="bloodGroup"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Droplets className="w-4 h-4" />
                Blood Group
              </Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleChange("bloodGroup", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Enter your department"
                disabled={isLoading}
              />
            </div>

            {/* Batch Number */}
            <div className="space-y-2">
              <Label
                htmlFor="batchNo"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Batch Number
              </Label>
              <Input
                id="batchNo"
                value={formData.batchNo}
                onChange={(e) => handleChange("batchNo", e.target.value)}
                placeholder="Enter your batch number"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
