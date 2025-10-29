"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Logo from "../../../../public/GUBLogo.svg";
import { Link, Clock, MapPin, GraduationCap, UserCheck } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Survey = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userSemester: "",
    destination: "",
    classTime: "",
    classEndTime: "",
    acBus: "Non-AC",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
      const surveyData = {
        userId: user.uId || user.id,
        userRole: user.roles || "Student",
        userDepartment: user.department || "Not specified",
        username: user.name,
        userSemester: formData.userSemester,
        destination: formData.destination,
        classTime: formData.classTime,
        classEndTime: formData.classEndTime,
        acBus: formData.acBus,
        submittedAt: new Date().toISOString(),
      };
      console.log("SurveyData: ", surveyData);

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
        alert("Survey submitted successfully! Thank you for your feedback.");
        setFormData({
          userSemester: "",
          destination: "",
          classTime: "",
          classEndTime: "",
          acBus: "Non-AC",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/5 py-6 px-4">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center py-4 bg-accent text-white -mt-6 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <Image
              src={Logo}
              alt="GUB Logo"
              width={120}
              height={60}
              className="filter brightness-0 invert"
            />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <UserCheck className="h-6 w-6" />
            Bus Service Survey
          </CardTitle>
          <p className="text-white mt-2">
            Help us improve your campus transportation experience
          </p>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {/* User Info Display */}
          {user && (
            <div className="mb-6 p-4 bg-primary-foreground rounded-lg border border-accent">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-black" />
                  <span className="font-semibold text-accent">{user.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-black font-semibold">
                  <span>ID: {user.uId}</span>
                  <span>Role: {user.roles}</span>
                  {user.roles === "Student" && (
                    <span>Dept: {user.department}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Semester */}
            <div className="space-y-3">
              <Label
                htmlFor="userSemester"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                Current Semester
              </Label>
              <Select
                value={formData.userSemester}
                onValueChange={(value) =>
                  handleSelectChange("userSemester", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your semester" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(
                    (semester) => (
                      <SelectItem key={semester} value={`Semester ${semester}`}>
                        Semester {semester}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="space-y-3">
              <Label
                htmlFor="destination"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-green-600" />
                Preferred Destination
              </Label>
              <Select
                value={formData.destination}
                onValueChange={(value) =>
                  handleSelectChange("destination", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mirpur">Mirpur</SelectItem>
                  <SelectItem value="Uttara">Uttara</SelectItem>
                  <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                  <SelectItem value="Gulshan">Gulshan</SelectItem>
                  <SelectItem value="Banani">Banani</SelectItem>
                  <SelectItem value="Mohakhali">Mohakhali</SelectItem>
                  <SelectItem value="Farmgate">Farmgate</SelectItem>
                  <SelectItem value="Malibagh">Malibagh</SelectItem>
                  <SelectItem value="Badda">Badda</SelectItem>
                  <SelectItem value="Basundhara">Basundhara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Class Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label
                  htmlFor="classTime"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-purple-600" />
                  Class Start Time
                </Label>
                <Input
                  type="time"
                  required
                  name="classTime"
                  id="classTime"
                  value={formData.classTime}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="classEndTime"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-purple-600" />
                  Class End Time
                </Label>
                <Input
                  type="time"
                  required
                  name="classEndTime"
                  id="classEndTime"
                  value={formData.classEndTime}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Bus Preference */}
            {user?.roles === "Teacher" && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-orange-600">🚌</span>
                  Bus Type Preference
                </Label>
                <RadioGroup
                  value={formData.acBus}
                  onValueChange={(value) => handleSelectChange("acBus", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AC" id="ac" />
                    <Label htmlFor="ac" className="cursor-pointer font-normal">
                      AC Bus
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non-AC" id="non-ac" />
                    <Label
                      htmlFor="non-ac"
                      className="cursor-pointer font-normal"
                    >
                      Non-AC Bus
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || !user}
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Survey"
              )}
            </Button>

            {!user && (
              <p className="text-center text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                Please log in to submit the survey
              </p>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Your information helps us optimize bus routes and schedules for
              better service. All data is kept confidential and used solely for
              transportation planning purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Survey;
