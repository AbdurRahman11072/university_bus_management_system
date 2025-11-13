"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import SurveyMain from "@/components/homeComponent/survey/surveyMain";

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
        userId: user.uId,
        userRole: user.roles || "Student",
        userDepartment: user.department,
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
      <div className="min-h-screen flex items-center justify-center bg-accent/5">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SurveyMain />;
};

export default Survey;
