import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const noticeDetails = [
  {
    title: "Route 5A Schedule Change",
    description:
      "Starting from next week, Route 5A will have an additional stop at the new campus extension.",
    date: "Today",
    priority: "high",
  },
  {
    title: "Maintenance Alert",
    description:
      "Bus #1003 will be under maintenance on Friday. Please use alternative routes.",
    date: "Yesterday",
    priority: "medium",
  },
  {
    title: "Payment Reminder",
    description:
      "Semester pass payment deadline is December 15th. Please complete your payment.",
    date: "2 days ago",
    priority: "high",
  },
  {
    title: "New GPS Tracking Feature",
    description:
      "We've launched real-time GPS tracking for all buses. Check your app for live updates.",
    date: "1 week ago",
    priority: "low",
  },
];

const NoticePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Notices & Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest announcements
          </p>
        </div>

        <div className="space-y-4">
          {noticeDetails.map((notice, i) => (
            <Card
              key={i}
              className={`border-l-4 ${
                notice.priority === "high"
                  ? "border-l-destructive"
                  : notice.priority === "medium"
                  ? "border-l-secondary"
                  : "border-l-primary"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {notice.title}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {notice.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {notice.date}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                      notice.priority === "high"
                        ? "bg-destructive/20 text-destructive"
                        : notice.priority === "medium"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {notice.priority.charAt(0).toUpperCase() +
                      notice.priority.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
