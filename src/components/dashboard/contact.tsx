"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Mail, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/hooks/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ContactMessage {
  uId: string;
  semester: "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th" | "7th" | "8th";
  subject: string;
  message: string;
}

const semesterColors: Record<string, string> = {
  "1st": "bg-blue-100 text-blue-800",
  "2nd": "bg-green-100 text-green-800",
  "3rd": "bg-purple-100 text-purple-800",
  "4th": "bg-orange-100 text-orange-800",
  "5th": "bg-pink-100 text-pink-800",
  "6th": "bg-indigo-100 text-indigo-800",
  "7th": "bg-cyan-100 text-cyan-800",
  "8th": "bg-red-100 text-red-800",
};

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/contect-us");

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        // Adjust this based on your API response structure
        // If the data is nested, you might need data.data or data.messages
        setMessages(data.data || data || []);
        console.log(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.uId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.semester.includes(searchTerm)
  );

  if (loading) {
    return (
      <Card className="w-full mt-10">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Loading messages...
          </div>
        </CardContent>
      </Card>
    );
  }
  const deleteHandler = async (id: string) => {
    console.log(id);

    const result = await axiosInstance.delete(`/contect-us/${id}`);

    if (result?.status === 200) {
      toast.success("Message has been deleted");
      router.refresh();
    }
    toast.error("Failed to delete message");
  };

  if (error) {
    return (
      <Card className="w-full mt-10">
        <CardContent className="py-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Messages
            </CardTitle>
            <CardDescription>
              {filteredMessages.length} message
              {filteredMessages.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
        </div>
        <Input
          placeholder="Search by User ID, Subject, or Semester..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredMessages.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {messages.length === 0
                ? "No messages found."
                : "No messages found matching your search."}
            </div>
          ) : (
            filteredMessages.map((msg: any) => (
              <div
                key={msg._id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === msg._id ? null : msg._id)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.uId}</span>
                        <Badge className={semesterColors[msg.semester]}>
                          {msg.semester} Sem
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  {expandedId === msg._id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {expandedId === msg._id && (
                  <div className="px-4 py-3 bg-muted/30 border-t">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                          Full Message
                        </p>
                        <p className="text-sm mt-1 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            User ID
                          </p>
                          <p className="text-sm font-mono">{msg.uId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Semester
                          </p>
                          <p className="text-sm">{msg.semester}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Delete
                          </p>
                          <p
                            className="text-sm text-red-500"
                            onClick={() => deleteHandler(msg._id)}
                          >
                            <Trash />
                          </p>
                        </div>
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
