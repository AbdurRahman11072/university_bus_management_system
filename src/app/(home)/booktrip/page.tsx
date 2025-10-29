"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React from "react";

const BookTripPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("auth/login");
  }
  return (
    <div className="container mx-auto space-y-4 w-[95vw] lg:w-[40vw] md:w-[90vw] xl:w-[35vw]  my-10">
      <Card>
        <CardHeader>
          <CardTitle>Book a Bus for School Trips</CardTitle>
          <CardDescription>
            Reserve a bus for educational excursions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Trip Name
            </label>
            <input
              type="text"
              placeholder="e.g., Science Museum Visit"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Discription
            </label>
            <input
              type="text"
              placeholder="e.g., Why you want to go there"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Trip Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Number of Students
            </label>
            <input
              type="number"
              placeholder="Enter number"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Destination
            </label>
            <input
              type="text"
              placeholder="Enter destination"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11">
            Request Bus
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookTripPage;
