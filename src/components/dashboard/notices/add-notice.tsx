"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Notice } from "./noticeType";

interface AddNoticeDialogProps {
  onAddNotice: (notice: Notice) => void;
}

export default function AddNoticeDialog({ onAddNotice }: AddNoticeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    noticeFor: "Student",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the data for the API
      const noticeData = {
        subject: formData.subject,
        description: formData.description,
        noticeFor: formData.noticeFor,
        // Add any other required fields that your backend expects
      };

      // POST data to the backend API
      const response = await fetch(
        "http://localhost:5000/api/v1/notice/post-notice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noticeData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Create the new notice object for the frontend
      const newNotice: Notice = {
        id: result.data?.id || Date.now().toString(), // Use the ID from backend if available
        subject: formData.subject,
        description: formData.description,
        noticeFor: formData.noticeFor,
        seen: [],
        createdAt: result.data?.createdAt || new Date().toISOString(),
      };

      // Call the callback to update the frontend state
      onAddNotice(newNotice);

      // Reset form and close dialog
      setFormData({ subject: "", description: "", noticeFor: "Student" });
      setOpen(false);
    } catch (error) {
      console.error("[v0] Error adding notice:", error);
      // You might want to add error handling UI here
      alert("Failed to create notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Add Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Notice</DialogTitle>
          <DialogDescription>
            Add a new notice to inform users about important updates
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Subject
            </label>
            <Input
              placeholder="Enter notice subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              placeholder="Enter notice description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notice For
            </label>
            <Select
              value={formData.noticeFor}
              onValueChange={(value) =>
                setFormData({ ...formData, noticeFor: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="All User">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Creating..." : "Create Notice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
