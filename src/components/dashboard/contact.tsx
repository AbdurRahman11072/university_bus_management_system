"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ContactMessage {
  uId: string;
  semester: "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th" | "7th" | "8th";
  subject: string;
  message: string;
}

const mockMessages: ContactMessage[] = [
  {
    uId: "USR001",
    semester: "4th",
    subject: "Course Material Issue",
    message:
      "I'm having trouble accessing the course materials for the advanced algorithms module. The download link seems to be broken. Could you please check and fix it?",
  },
  {
    uId: "USR002",
    semester: "2nd",
    subject: "Exam Schedule Clarification",
    message:
      "Can you clarify the exam schedule for next semester? I need to plan my study schedule accordingly.",
  },
  {
    uId: "USR003",
    semester: "6th",
    subject: "Project Submission Extension",
    message:
      "I would like to request an extension for the final project submission. I've been dealing with some personal issues and need more time.",
  },
  {
    uId: "USR004",
    semester: "3rd",
    subject: "Lab Equipment Problem",
    message:
      "The lab equipment in room 204 is not working properly. It needs maintenance before the next lab session.",
  },
  {
    uId: "USR005",
    semester: "5th",
    subject: "Internship Opportunity",
    message:
      "Are there any internship opportunities available for students in the 5th semester? I'm interested in gaining practical experience.",
  },
];

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = mockMessages.filter(
    (msg) =>
      msg.uId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.semester.includes(searchTerm)
  );

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
              No messages found matching your search.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.uId}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === msg.uId ? null : msg.uId)
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
                  {expandedId === msg.uId ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {expandedId === msg.uId && (
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
                      <div className="grid grid-cols-2 gap-4 pt-2">
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
