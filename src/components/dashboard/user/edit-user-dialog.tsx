"use client";

import React from "react";

import { useState } from "react";
import { API_BASE } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { UserData } from "./userType";

interface EditUserDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: UserData) => void;
}

export default function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState<UserData>(user);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the backend API with MongoDB _id
      const response = await fetch(
        `${API_BASE}/user/update-user/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      onSave(formData);
      onOpenChange(false);
    } catch (err) {
      console.error("[v0] Error updating user:", err);
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader className="border-b border-primary/10 pb-4">
          <DialogTitle className="text-primary text-xl">
            Edit User Information
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the user details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-foreground font-semibold"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone_number"
                className="text-foreground font-semibold"
              >
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleChange}
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bloodGroup"
                className="text-foreground font-semibold"
              >
                Blood Group
              </Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) =>
                  handleSelectChange("bloodGroup", value)
                }
              >
                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20">
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="roles" className="text-foreground font-semibold">
                Role
              </Label>
              <Select
                value={formData.roles}
                onValueChange={(value) =>
                  handleSelectChange("roles", value as any)
                }
              >
                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="avatar_url"
                className="text-foreground font-semibold"
              >
                Avatar URL
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ""}
                onChange={handleChange}
                className="border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          {formData.avatar_url && (
            <div className="space-y-2 border-t border-primary/10 pt-4">
              <Label className="text-foreground font-semibold">
                Avatar Preview
              </Label>
              <div className="flex justify-center">
                <img
                  src={formData.avatar_url || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
                />
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-primary/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
