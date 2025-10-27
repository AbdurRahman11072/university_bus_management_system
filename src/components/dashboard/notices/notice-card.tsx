import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notice } from "./noticeType";

interface NoticeCardProps {
  notice: Notice;
}

export default function NoticeCard({ notice }: NoticeCardProps) {
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

  return (
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
            </CardDescription>
          </div>
          <Badge className={`${getNoticeColor(notice.noticeFor)} border`}>
            {notice.noticeFor}
          </Badge>
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
  );
}
