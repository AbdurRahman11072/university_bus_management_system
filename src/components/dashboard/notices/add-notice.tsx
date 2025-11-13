"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bell,
  X,
  Users,
  FileText,
  MessageSquare,
  Send,
  User,
  GraduationCap,
  Bus,
  Eye,
} from "lucide-react";
import { Notice } from "./noticeType";
import { toast } from "sonner";
import { API_BASE } from "@/lib/config";

interface AddNoticeDialogProps {
  onAddNotice: (notice: Notice) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoticeDialog({
  onAddNotice,
  isOpen,
  onClose,
}: AddNoticeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    noticeFor: "Student",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      noticeFor: "Student",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const noticeData = {
        subject: formData.subject,
        description: formData.description,
        noticeFor: formData.noticeFor,
      };

      const response = await fetch(`${API_BASE}/notice/post-notice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const newNotice: Notice = {
        id: result.data?.id || Date.now().toString(),
        subject: formData.subject,
        description: formData.description,
        noticeFor: formData.noticeFor,
        seen: [],
        createdAt: result.data?.createdAt || new Date().toISOString(),
      };

      onAddNotice(newNotice);

      toast("Success", {
        description: "New notice has been created successfully",
      });

      handleClose();
    } catch (error) {
      console.error("[v0] Error adding notice:", error);
      toast.error("Failed to create notice", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const getNoticeForIcon = (value: string) => {
    switch (value) {
      case "Student":
        return <GraduationCap className="w-4 h-4" />;
      case "Teacher":
        return <User className="w-4 h-4" />;
      case "Driver":
        return <Bus className="w-4 h-4" />;
      case "All User":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getNoticeForColor = (value: string) => {
    switch (value) {
      case "Student":
        return "from-primary to-primary/90";
      case "Teacher":
        return "from-purple-600 to-purple-700";
      case "Driver":
        return "from-orange-600 to-orange-700";
      case "All User":
        return "from-green-600 to-green-700";
      default:
        return "from-primary to-primary/90";
    }
  };

  const getNoticeForButtonColor = (value: string) => {
    switch (value) {
      case "Student":
        return "bg-primary/10 text-primary border-primary/20";
      case "Teacher":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Driver":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "All User":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${
          isClosing ? "fade-out" : "fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-background z-50 shadow-2xl border-border ${
          isClosing ? "slide-out-right" : "slide-in-right"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between bg-gradient-to-r ${getNoticeForColor(
            formData.noticeFor
          )} px-8 py-6 text-primary-foreground`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-6 h-6 text-background" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-background">
                Create New Notice
              </h2>
              <p className="text-background/80 text-sm mt-1">
                Add important announcements and updates for users
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-background hover:bg-background/20 rounded-lg w-10 h-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="h-[calc(100vh-80px)] overflow-y-auto px-8 pb-8 space-y-6 mt-6"
        >
          {/* Notice Information Section */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <Label className="text-lg font-semibold text-card-foreground flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              Notice Information
            </Label>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter notice subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="focus:ring-2 focus:ring-primary h-12 border-border text-card-foreground"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter detailed notice description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={6}
                  disabled={loading}
                  className="focus:ring-2 focus:ring-primary border-border resize-none min-h-[150px] text-card-foreground"
                />
              </div>
            </div>
          </div>

          {/* Audience Section */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <Label className="text-lg font-semibold text-card-foreground flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              Target Audience
            </Label>
            <div className="space-y-4">
              <Label className="text-sm font-medium text-card-foreground">
                Select who should see this notice
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "Student",
                    label: "Students",
                    icon: <GraduationCap className="w-4 h-4" />,
                  },
                  {
                    value: "Teacher",
                    label: "Teachers",
                    icon: <User className="w-4 h-4" />,
                  },
                  {
                    value: "Driver",
                    label: "Drivers",
                    icon: <Bus className="w-4 h-4" />,
                  },
                  {
                    value: "All User",
                    label: "All Users",
                    icon: <Users className="w-4 h-4" />,
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, noticeFor: option.value })
                    }
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      formData.noticeFor === option.value
                        ? `${getNoticeForButtonColor(
                            option.value
                          )} border-current font-semibold scale-105 shadow-md`
                        : `bg-muted text-muted-foreground border-transparent hover:border-current/50 hover:scale-102 hover:bg-muted/80`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.noticeFor === option.value
                            ? "bg-background/20"
                            : "bg-background"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs opacity-80 mt-1">
                          {option.value === "All User"
                            ? "Everyone"
                            : option.label}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.noticeFor && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                  {getNoticeForIcon(formData.noticeFor)}
                  <span className="text-sm font-medium text-muted-foreground">
                    This notice will be visible to:{" "}
                    <span className="text-primary font-semibold">
                      {formData.noticeFor === "All User"
                        ? "All Users"
                        : formData.noticeFor + "s"}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {formData.subject && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <Label className="text-lg font-semibold text-card-foreground flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-secondary-foreground" />
                </div>
                Notice Preview
              </Label>
              <div className="space-y-3">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-card-foreground text-lg mb-2">
                    {formData.subject}
                  </h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {formData.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getNoticeForIcon(formData.noticeFor)}
                      <span>
                        For:{" "}
                        {formData.noticeFor === "All User"
                          ? "All Users"
                          : formData.noticeFor + "s"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border sticky bottom-0 bg-background pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-14 text-base font-medium border-2 border-border hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.subject || !formData.description}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating Notice...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Create Notice
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
