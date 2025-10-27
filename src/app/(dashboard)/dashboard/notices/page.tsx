"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Notice } from "@/components/dashboard/notices/noticeType";
import NoticeCard from "@/components/dashboard/notices/notice-card";
import AddNoticeDialog from "@/components/dashboard/notices/add-notice";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All"); // Start with "All" as default

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/v1/notice/get-all-notice"
      );
      const data = await response.json();
      console.log("notice", data.data);

      setNotices(data.data);
    } catch (err) {
      console.error("[v0] Error fetching notices:", err);
      // Fallback to demo data
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotice = (newNotice: Notice) => {
    setNotices([newNotice, ...notices]);
  };

  const filteredNotices =
    filter === "All"
      ? notices
      : notices.filter((notice) => notice.noticeFor === filter);

  // Get unique notice types, ensuring no duplicates with "All"
  const noticeTypes = [
    "All",
    ...new Set(notices.map((n) => n.noticeFor).filter(Boolean)),
  ];

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Notices</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest announcements
            </p>
          </div>
          <AddNoticeDialog onAddNotice={handleAddNotice} />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {noticeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === type
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-muted-foreground">
              Loading notices...
            </span>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No notices found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
