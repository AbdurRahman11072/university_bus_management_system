"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../../../../public/GUBLogo.svg";
import { Link } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Survey = () => {
  const { user } = useAuth(); // Remove loading since it's not available
  const [formData, setFormData] = useState({
    semester: "",
    destination: "",
    classTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to submit the survey");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use type assertions for user properties
      const username = (user as any).username || "Unknown";
      const department = (user as any).department || "Not specified";

      const surveyData = {
        username: username,

        department: department,
        semester: formData.semester,
        destination: formData.destination,
        classTime: formData.classTime,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch(
        "http://localhost:5000/api/v1/survey/post-Survey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        }
      );

      if (response.ok) {
        alert("Survey submitted successfully!");
        setFormData({
          semester: "",
          destination: "",
          classTime: "",
        });
      } else {
        throw new Error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove the loading check since it's not available

  // Type-safe user info display
  const userDisplayName = (user as any)?.username || "Not logged in";
  const userDepartment = (user as any)?.department || "Not specified";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)] my-10"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div className="text-center">
          <Link href="/" aria-label="go home" className="mx-auto block w-fit">
            <div className="logo-container">
              <Image
                src={Logo}
                alt="logo"
                width={100}
                height={50}
                className="w-48 h-12"
              />
            </div>
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">
            <span className="font-bold text-accent">
              Survey For Bus Management
            </span>
          </h1>
          <p className="text-sm">please fill the form</p>
          {user && (
            <p className="text-xs text-muted-foreground mt-2">
              Logged in as: {userDisplayName} | Department: {userDepartment}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="semester" className="block text-sm">
              Semester
            </Label>
            <Input
              type="text"
              required
              name="semester"
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Enter your semester"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="block text-sm">
              Destination
            </Label>
            <Input
              type="text"
              required
              name="destination"
              id="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Add your location. Like (Mirpur)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classTime" className="block text-sm">
              Class Time
            </Label>
            <Input
              type="text"
              required
              name="classTime"
              id="classTime"
              value={formData.classTime}
              onChange={handleChange}
              placeholder="Add Class Time. Like (08:30 AM)"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          {!user && (
            <p className="text-xs text-center text-red-500">
              Please log in to submit the survey
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Survey;
