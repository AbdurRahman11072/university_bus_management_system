"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from "./noticeType";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NoticeCardProps {
  notice: Notice;
  onUpdate: (updatedNotice: Notice) => void;
  onDelete: (noticeId: string) => void;
}

export default function NoticeCard({
  notice,
  onUpdate,
  onDelete,
}: NoticeCardProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    subject: notice.subject,
    description: notice.description,
    noticeFor: notice.noticeFor,
  });

  const getNoticeColor = (noticeFor: string) => {
    switch (noticeFor) {
      case "Student":
        return "bg-primary/10 text-primary border-primary/20";
      case "Teacher":
        return "bg-accent/10 text-accent border-accent/20";
      case "Admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    setIsDeleteLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/notice/delete-notice/${notice.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onDelete(notice.id);
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdateLoading(true);

    try {
      const updateData = {
        subject: editFormData.subject,
        description: editFormData.description,
        noticeFor: editFormData.noticeFor,
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/notice/update-notice/${notice.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const updatedNotice: Notice = {
        ...notice,
        subject: editFormData.subject,
        description: editFormData.description,
        noticeFor: editFormData.noticeFor,
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedNotice);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating notice:", error);
      alert("Failed to update notice. Please try again.");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl text-foreground">
                {notice.subject}
              </CardTitle>
              <CardDescription className="mt-1">
                {new Date(notice.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {notice.updatedAt && (
                  <span className="ml-2 text-xs">
                    (Updated:{" "}
                    {new Date(notice.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    )
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getNoticeColor(notice.noticeFor)} border`}>
                {notice.noticeFor}
              </Badge>
              <div className="flex gap-1">
                {/* Edit Button */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Edit notice"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Notice</DialogTitle>
                      <DialogDescription>
                        Update the notice information
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Subject
                        </label>
                        <Input
                          placeholder="Enter notice subject"
                          value={editFormData.subject}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              subject: e.target.value,
                            })
                          }
                          required
                          disabled={isUpdateLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Description
                        </label>
                        <Textarea
                          placeholder="Enter notice description"
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                          required
                          rows={4}
                          disabled={isUpdateLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Notice For
                        </label>
                        <Select
                          value={editFormData.noticeFor}
                          onValueChange={(value) =>
                            setEditFormData({
                              ...editFormData,
                              noticeFor: value,
                            })
                          }
                          disabled={isUpdateLoading}
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
                          onClick={() => setIsEditDialogOpen(false)}
                          disabled={isUpdateLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdateLoading}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isUpdateLoading ? "Updating..." : "Update Notice"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={isDeleteLoading}
                  title="Delete notice"
                >
                  {isDeleteLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {notice.description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Seen by{" "}
              <span className="font-semibold text-foreground">
                {notice.seen.length}
              </span>{" "}
              users
            </span>
            <div className="flex gap-1">
              {notice.seen.slice(0, 3).map((userId) => (
                <div
                  key={userId}
                  className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary"
                  title={userId}
                >
                  {userId.charAt(0).toUpperCase()}
                </div>
              ))}
              {notice.seen.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  +{notice.seen.length - 3}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
