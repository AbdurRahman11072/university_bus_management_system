"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Mail, Trash, Search, User, BookOpen, MessageSquare, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/hooks/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ContactMessage {
  _id: string;
  uId: string;
  semester: "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th" | "7th" | "8th";
  subject: string;
  message: string;
  createdAt?: string;
}

const semesterColors: Record<string, string> = {
  "1st": "bg-blue-100 text-blue-800 border-blue-200",
  "2nd": "bg-green-100 text-green-800 border-green-200",
  "3rd": "bg-purple-100 text-purple-800 border-purple-200",
  "4th": "bg-orange-100 text-orange-800 border-orange-200",
  "5th": "bg-pink-100 text-pink-800 border-pink-200",
  "6th": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "7th": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "8th": "bg-red-100 text-red-800 border-red-200",
};

const semesterGradients: Record<string, string> = {
  "1st": "from-blue-500 to-blue-600",
  "2nd": "from-green-500 to-green-600",
  "3rd": "from-purple-500 to-purple-600",
  "4th": "from-orange-500 to-orange-600",
  "5th": "from-pink-500 to-pink-600",
  "6th": "from-indigo-500 to-indigo-600",
  "7th": "from-cyan-500 to-cyan-600",
  "8th": "from-red-500 to-red-600",
};

export function ContactMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/contect-us");

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.data || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.uId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteHandler = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await axiosInstance.delete(`/contect-us/${id}`);

      if (result?.status === 200) {
        toast.success("Message has been deleted successfully");
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (expandedId === id) {
          setExpandedId(null);
        }
        router.refresh();
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="w-full mt-6 border-border bg-card">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mt-6 border-border bg-card">
        <CardContent className="py-8">
          <div className="text-center text-destructive space-y-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-6 w-6 text-destructive" />
            </div>
            <p className="font-medium">Error loading messages</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchMessages} variant="outline" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6 border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Contact Messages
              </CardTitle>
              <CardDescription>
                {filteredMessages.length} message
                {filteredMessages.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by User ID, Subject, Semester, or Message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border focus:ring-2 focus:ring-primary"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-8 w-8" />
              </div>
              <p className="font-medium text-card-foreground">
                {messages.length === 0
                  ? "No messages yet"
                  : "No messages found"}
              </p>
              <p className="text-sm">
                {messages.length === 0
                  ? "Contact messages will appear here when users submit them."
                  : "Try adjusting your search terms."}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 bg-card"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === msg._id ? null : msg._id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1 text-left min-w-0">
                    <div
                      className={`w-3 h-12 rounded-full bg-gradient-to-b ${
                        semesterGradients[msg.semester]
                      }`}
                    ></div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-sm text-card-foreground font-mono">
                            {msg.uId}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            semesterColors[msg.semester]
                          } border font-medium`}
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          {msg.semester} Semester
                        </Badge>
                      </div>

                      <p className="text-base font-semibold text-card-foreground line-clamp-1 text-left">
                        {msg.subject}
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-2 text-left leading-relaxed">
                        {msg.message}
                      </p>

                      {msg.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(msg.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {expandedId === msg._id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>

                {expandedId === msg._id && (
                  <div className="px-6 py-4 bg-muted/30 border-t border-border animate-in fade-in duration-200">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            <User className="h-3 w-3" />
                            User ID
                          </div>
                          <p className="text-sm font-mono bg-background px-3 py-2 rounded-lg border border-border">
                            {msg.uId}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            <BookOpen className="h-3 w-3" />
                            Semester
                          </div>
                          <div className="bg-background px-3 py-2 rounded-lg border border-border">
                            <Badge
                              className={`${
                                semesterColors[msg.semester]
                              } border-0 font-medium`}
                            >
                              {msg.semester} Semester
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            <Calendar className="h-3 w-3" />
                            Submitted
                          </div>
                          <p className="text-sm bg-background px-3 py-2 rounded-lg border border-border">
                            {msg.createdAt
                              ? formatDate(msg.createdAt)
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          <MessageSquare className="h-3 w-3" />
                          Full Message
                        </div>
                        <div className="bg-background rounded-lg border border-border">
                          <p className="text-sm p-4 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteHandler(msg._id)}
                          disabled={deletingId === msg._id}
                          className="gap-2"
                        >
                          {deletingId === msg._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash className="h-4 w-4" />
                              Delete Message
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
