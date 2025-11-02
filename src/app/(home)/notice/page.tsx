"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Eye, Calendar, Users, Filter, Sparkles } from "lucide-react";

interface Notice {
  id: string;
  subject: string;
  description: string;
  noticeFor: "Student" | "Teacher" | "Driver" | "All User";
  seen: string[];
  createdAt: string;
  updatedAt?: string;
}

// Define the User type that matches your schema
interface AuthUser {
  _id: string;
  uId: number;
  username: string;
  email: string;
  batchNo: string;
  department: string;
  avatar_url?: string;
  phone_number?: string;
  bloodGroup: string;
  roles: "Student" | "Teacher" | "Driver" | "Admin";
  driverLicence?: string;
  licenceExpire?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoticeComponentProps {
  userRole?: "Student" | "Teacher" | "Driver";
  userId?: string;
}

export default function NoticeComponent({
  userRole,
  userId,
}: NoticeComponentProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("auth/login");
  }

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unseen">("all");

  // Cast user to AuthUser type and use type guards
  const authUser = user as AuthUser | null;

  // Use user from useAuth if available, otherwise use props
  const currentUserRole = authUser?.roles || userRole;
  const currentUserId = authUser?._id || userId;

  useEffect(() => {
    if (currentUserRole && currentUserId) {
      fetchNotices();
    }
  }, [currentUserRole, currentUserId]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/v1/notice/get-all-notice"
      );
      const data = await response.json();
      setNotices(data.data || []);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter notices based on user role
  const filteredNotices = notices.filter((notice) => {
    if (!currentUserRole) return false;

    const isForUser =
      notice.noticeFor === currentUserRole || notice.noticeFor === "All User";

    const isUnseen = currentUserId
      ? !notice.seen.includes(currentUserId)
      : false;

    if (filter === "unseen") {
      return isForUser && isUnseen;
    }
    return isForUser;
  });

  const getNoticeColor = (noticeFor: string) => {
    switch (noticeFor) {
      case "Student":
        return "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400";
      case "Teacher":
        return "bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400";
      case "Driver":
        return "bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400";
      case "All User":
        return "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getNoticeIcon = (noticeFor: string) => {
    switch (noticeFor) {
      case "Student":
        return "🎓";
      case "Teacher":
        return "👨‍🏫";
      case "Driver":
        return "🚌";
      case "All User":
        return "👥";
      default:
        return "📢";
    }
  };

  if (loading || !currentUserRole || !currentUserId) {
    return (
      <div className="flex justify-center items-center py-12 h-[90vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">
          Loading user information...
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 h-[90vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading notices...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[90vh]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-2xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Notices & Announcements
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay updated with the latest information for{" "}
                {currentUserRole.toLowerCase()}s
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
        </div>

        {/* Stats Card */}
      </motion.div>

      {/* Notices Grid */}
      <AnimatePresence>
        {filteredNotices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Notices Available
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {filter === "unseen"
                ? "You're all caught up! No unread notices at the moment."
                : "No notices are currently available for your role. Check back later!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice, index) => {
              const isUnseen = currentUserId
                ? !notice.seen.includes(currentUserId)
                : false;

              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-lg border-l-4 ${
                      isUnseen
                        ? "border-l-primary bg-gradient-to-r from-primary/5 to-transparent"
                        : "border-l-muted-foreground/30"
                    } hover:scale-[1.02] group`}
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getNoticeIcon(notice.noticeFor)}
                          </span>
                          <Badge
                            variant="secondary"
                            className={getNoticeColor(notice.noticeFor)}
                          >
                            {notice.noticeFor === "All User"
                              ? "Everyone"
                              : notice.noticeFor}
                          </Badge>
                        </div>
                        {isUnseen && (
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-xs text-primary font-medium">
                              New
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3
                          className={`font-bold text-lg leading-tight group-hover:text-primary transition-colors ${
                            isUnseen ? "text-foreground" : "text-foreground/80"
                          }`}
                        >
                          {notice.subject}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {notice.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{notice.seen.length}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>Seen</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredNotices.length} notice
          {filteredNotices.length !== 1 ? "s" : ""}
          {filter === "unseen" && " (unread only)"}
          {currentUserRole &&
            ` • Filtered for ${currentUserRole.toLowerCase()}s`}
        </p>
      </motion.div>
    </div>
  );
}
