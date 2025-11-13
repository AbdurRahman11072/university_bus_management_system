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
import React, { useState, useEffect } from "react";
import { Bus, Users, Clock, Shield, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/config";

// Define the form data type based on your schema
interface BusBookingFormData {
  bookingSubject: string;
  bookingDescription: string;
  bookingDate: string;
  bookingTime: string;
  studentCount: string;
  destination: string;
  additionalRequirements: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: any;
}

interface SubmissionData {
  bookingSubject: string;
  bookingDescription: string;
  bookingDate: string;
  bookingTime: string;
  totalPassanger: string; // Changed from studentCount to totalPassanger
  destination: string;
  additionalRequirements: string;
  uId: string;
  userEmail: string;
  userName: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

const BookTripPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(
    null
  );
  const [formData, setFormData] = useState<BusBookingFormData>({
    bookingSubject: "",
    bookingDescription: "",
    bookingDate: "",
    bookingTime: "",
    studentCount: "",
    destination: "",
    additionalRequirements: "",
  });

  // Use useEffect for redirect to avoid rendering issues
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields based on your schema
      if (
        !formData.bookingSubject ||
        !formData.bookingDescription ||
        !formData.bookingDate ||
        !formData.bookingTime ||
        !formData.studentCount ||
        !formData.destination
      ) {
        alert("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate field lengths based on your schema
      if (
        formData.bookingSubject.length < 10 ||
        formData.bookingSubject.length > 60
      ) {
        alert("Subject must be between 10 and 60 characters");
        setIsSubmitting(false);
        return;
      }

      if (
        formData.bookingDescription.length < 10 ||
        formData.bookingDescription.length > 200
      ) {
        alert("Description must be between 10 and 200 characters");
        setIsSubmitting(false);
        return;
      }

      // Prepare the data for API - using totalPassanger instead of studentCount
      const submissionData: SubmissionData = {
        bookingSubject: formData.bookingSubject.trim(),
        bookingDescription: formData.bookingDescription.trim(),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        totalPassanger: formData.studentCount, // Convert to string as per Zod schema
        destination: formData.destination.trim(),
        additionalRequirements: formData.additionalRequirements.trim(),
        uId: user.uId,
        userEmail: user.email || "unknown@example.com",
        userName: user.username,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      console.log("📤 Submitting form data:", submissionData);
      console.log("👤 User object:", user);

      const response = await fetch(`${API_BASE}/bus-booking/post-bus-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      console.log("📨 API Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ API Error details:", errorData);
        } catch (parseError) {
          console.error("❌ Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Handle successful submission
      console.log("✅ Booking submitted successfully:", result);
      toast.success("✅ Booking submitted successfully");

      // Store the response and submitted data
      setApiResponse(result);
      setSubmittedData(submissionData);
      setShowSuccess(true);

      // Reset form after successful submission
      setFormData({
        bookingSubject: "",
        bookingDescription: "",
        bookingDate: "",
        bookingTime: "",
        studentCount: "",
        destination: "",
        additionalRequirements: "",
      });
    } catch (error) {
      console.error("❌ Error submitting booking:", error);
      alert(
        `Failed to submit booking request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    setApiResponse(null);
    setSubmittedData(null);
    router.push("/booktrip");
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Booking Successful!
              </h3>
              <button
                onClick={closeSuccessModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Status:</strong> {apiResponse?.status}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Message:</strong> {apiResponse?.message}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Booking ID:</strong> {apiResponse?.data?._id}
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <h4 className="font-medium text-sm mb-2 text-blue-900">
                  Submitted Data:
                </h4>
                <div className="text-xs space-y-1 text-blue-800">
                  <p>
                    <strong>Subject:</strong> {submittedData?.bookingSubject}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {submittedData?.bookingDescription}
                  </p>
                  <p>
                    <strong>Date:</strong> {submittedData?.bookingDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {submittedData?.bookingTime}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {submittedData?.totalPassanger}
                  </p>
                  <p>
                    <strong>Destination:</strong> {submittedData?.destination}
                  </p>
                  {submittedData?.additionalRequirements && (
                    <p>
                      <strong>Additional Requirements:</strong>{" "}
                      {submittedData?.additionalRequirements}
                    </p>
                  )}
                  <p>
                    <strong>User ID:</strong> {submittedData?.uId}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-orange-600 font-medium">
                      {submittedData?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={closeSuccessModal} className="w-full mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto h-[85vh]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <Card className="h-full border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Book a School Trip
                    </CardTitle>
                    <CardDescription>
                      Reserve a bus for educational excursions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="h-[calc(100%-80px)]">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2">
                    {/* Booking Subject */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">
                        Trip Subject *
                        <span className="text-xs text-muted-foreground ml-1">
                          (10-60 characters)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="bookingSubject"
                        placeholder="e.g., Science Museum Visit - Grade 5 Field Trip"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                        minLength={10}
                        maxLength={60}
                        value={formData.bookingSubject}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.bookingSubject.length}/60 characters
                      </p>
                    </div>

                    {/* Booking Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">
                        Description *
                        <span className="text-xs text-muted-foreground ml-1">
                          (10-200 characters)
                        </span>
                      </label>
                      <textarea
                        name="bookingDescription"
                        placeholder="Describe the purpose, objectives, and educational value of this trip..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                        required
                        minLength={10}
                        maxLength={200}
                        value={formData.bookingDescription}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.bookingDescription.length}/200 characters
                      </p>
                    </div>

                    {/* Booking Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Trip Date *
                      </label>
                      <input
                        type="date"
                        name="bookingDate"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                        value={formData.bookingDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Booking Time */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Trip Time *
                      </label>
                      <input
                        type="time"
                        name="bookingTime"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                        value={formData.bookingTime}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Number of Students */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Students Count *
                      </label>
                      <input
                        type="number"
                        name="studentCount"
                        placeholder="0"
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                        value={formData.studentCount}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Destination */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">
                        Destination *
                      </label>
                      <input
                        type="text"
                        name="destination"
                        placeholder="Enter destination address"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                        value={formData.destination}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 mt-4 border-t border-border">
                    <Button
                      type="submit"
                      className="w-full h-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Request...
                        </div>
                      ) : (
                        "Request Bus"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      You'll receive confirmation within 24-48 hours
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Information */}
          <div className="lg:col-span-1">
            <Card className="h-full border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Trip Information
                </CardTitle>
                <CardDescription>
                  Important details about bus reservations
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Process Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Booking Process
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <span className="text-sm">Submit request form</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <span className="text-sm">Admin approval</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <span className="text-sm">Confirmation email</span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Minimum 1 day advance notice
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Educational purpose required
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Faculty supervision needed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bus Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Bus Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-muted rounded-md">
                      <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">20-50 Seats</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <Shield className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Safety Certified</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">24/7 Support</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <Bus className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">AC & Comfort</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium text-sm text-foreground mb-2">
                    Need Help?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Contact transportation office:
                    <br />
                    <span className="font-medium">transport@gub.edu.bd</span>
                    <br />
                    <span className="font-medium">+880 XXXX-XXXXXX</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTripPage;
