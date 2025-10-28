"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

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

  const markAsSeen = async (noticeId: string) => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/notice/mark-as-seen/${noticeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (response.ok) {
        // Update local state
        setNotices(
          notices.map((notice) =>
            notice.id === noticeId
              ? { ...notice, seen: [...notice.seen, currentUserId] }
              : notice
          )
        );
      }
    } catch (error) {
      console.error("Error marking notice as seen:", error);
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
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Teacher":
        return "bg-green-100 text-green-800 border-green-200";
      case "Driver":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "All User":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading || !currentUserRole || !currentUserId) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">
          Loading user information...
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading notices...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-[90vh]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices</h1>
          <p className="text-muted-foreground mt-1">
            Notices relevant to {currentUserRole}s
          </p>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Notices
          </Button>
          <Button
            variant={filter === "unseen" ? "default" : "outline"}
            onClick={() => setFilter("unseen")}
            size="sm"
          >
            Unread Only
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-8">
                {filter === "unseen"
                  ? "No unread notices"
                  : "No notices available for your role"}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotices.map((notice) => {
            const isUnseen = currentUserId
              ? !notice.seen.includes(currentUserId)
              : false;

            return (
              <Card
                key={notice.id}
                className={`border-l-4 transition-all duration-200 ${
                  isUnseen
                    ? "border-l-blue-500 bg-blue-50/50 hover:bg-blue-50 shadow-sm"
                    : "border-l-gray-300 hover:shadow-md"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-semibold text-lg ${
                            isUnseen ? "text-blue-900" : "text-foreground"
                          }`}
                        >
                          {notice.subject}
                          {isUnseen && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          )}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          <Badge className={getNoticeColor(notice.noticeFor)}>
                            {notice.noticeFor === "All User"
                              ? "For Everyone"
                              : `For ${notice.noticeFor}s`}
                          </Badge>

                          {isUnseen && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p
                        className={`leading-relaxed ${
                          isUnseen ? "text-blue-800" : "text-muted-foreground"
                        }`}
                      >
                        {notice.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span
                          className={
                            isUnseen ? "text-blue-700" : "text-muted-foreground"
                          }
                        >
                          {new Date(notice.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Seen by {notice.seen.length} users
                        </span>
                      </div>
                    </div>

                    {isUnseen && (
                      <Button
                        onClick={() => markAsSeen(notice.id)}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Showing {filteredNotices.length} notice
        {filteredNotices.length !== 1 ? "s" : ""}
        {filter === "unseen" && " (unread only)"}
        {currentUserRole && ` for ${currentUserRole}s`}
      </div>
    </div>
  );
}
