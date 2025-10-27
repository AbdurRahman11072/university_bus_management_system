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
      const newNotice: Notice = {
        id: Date.now().toString(),
        subject: formData.subject,
        description: formData.description,
        noticeFor: formData.noticeFor,
        seen: [],
        createdAt: new Date().toISOString(),
      };

      onAddNotice(newNotice);
      setFormData({ subject: "", description: "", noticeFor: "Student" });
      setOpen(false);
    } catch (error) {
      console.error("[v0] Error adding notice:", error);
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
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Driver">Teacher</SelectItem>
                <SelectItem value="All">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
