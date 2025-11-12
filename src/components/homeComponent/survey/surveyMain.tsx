"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Logo from "../../../../public/GUBLogo.svg";
import { GraduationCap, UserCheck } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import SurveyForm from "./SurveyForm";
import PaymentForm from "./PaymentForm";
import ConfirmationStep from "./ConfirmationStep";

// Types
export type FormStep = "survey" | "payment" | "confirmation";
export type PaymentStatus = "pending" | "success" | "failed";

// Define BKashData type here to ensure consistency
export type BKashData = {
  phoneNumber: string;
  transactionId: string;
  amount: number;
};

export type SurveyData = {
  userId?: string;
  userName?: string;
  userRole: "Student" | "Teacher";
  userDepartment?: string;
  userSemester: string;
  classTime: string;
  classEndTime: string;
  destination: string;
  acBus: string;
  payment: boolean;
  paymentId?: string;
  submittedAt?: string;
  transactionId: string;
};

export type PaymentData = {
  userId: string;
  userName: string;
  userRole: string;
  phoneNumber: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  surveyData: Omit<SurveyData, "payment" | "paymentId">;
};

const SurveyMain = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<FormStep>("survey");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");

  const [formData, setFormData] = useState<SurveyData>({
    userId: "",
    userName: "",
    userRole: "Student",
    userDepartment: "",
    userSemester: "",
    destination: "",
    classTime: "",
    classEndTime: "",
    acBus: "Non-AC",
    payment: false,
    transactionId: "",
  });

  // Use the BKashData type here to ensure consistency
  const [bKashData, setBKashData] = useState<BKashData>({
    phoneNumber: "",
    transactionId: "",
    amount: 50,
  });

  // Initialize form data when user is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user.uId,
        userName: user.name,
        userRole: (user.roles as "Student" | "Teacher") || "Student",
        userDepartment: user.department || "",
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  const handleNextStep = () => {
    setCurrentStep("payment");
  };

  const handlePreviousStep = () => {
    setCurrentStep("survey");
  };

  const handleConfirmation = () => {
    setCurrentStep("confirmation");
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case "survey":
        return 33;
      case "payment":
        return 66;
      case "confirmation":
        return 100;
      default:
        return 0;
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

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step{" "}
              {currentStep === "survey" ? 1 : currentStep === "payment" ? 2 : 3}{" "}
              of 3
            </span>
            <span className="text-sm font-medium text-gray-600">
              {currentStep === "survey" && "Survey Details"}
              {currentStep === "payment" && "Payment"}
              {currentStep === "confirmation" && "Confirmation"}
            </span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

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
                  <Badge variant="secondary">{user.roles}</Badge>
                  {user.roles === "Student" && (
                    <span>Dept: {user.department}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Render Current Step */}
          {currentStep === "survey" && (
            <SurveyForm
              formData={formData}
              setFormData={setFormData}
              user={user}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === "payment" && (
            <PaymentForm
              formData={formData}
              bKashData={bKashData}
              setBKashData={setBKashData}
              isSubmitting={isSubmitting}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              setIsSubmitting={setIsSubmitting}
              onPreviousStep={handlePreviousStep}
              onConfirmation={handleConfirmation}
            />
          )}

          {currentStep === "confirmation" && (
            <ConfirmationStep formData={formData} bKashData={bKashData} />
          )}

          {/* Additional Info */}
          {currentStep !== "confirmation" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Your information helps us optimize bus routes and schedules for
                better service. All data is kept confidential and used solely
                for transportation planning purposes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyMain;
