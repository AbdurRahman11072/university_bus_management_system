"use client";
import React, { useState, useEffect } from "react";

interface BusBooking {
  _id: string;
  bookingSubject: string;
  bookingDescription: string;
  bookingTime: string;
  bookingDate: string;
  status: "Accepted" | "Rejected" | "Pending";
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

type TabType = "pending" | "accepted" | "rejected";

const BusBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BusBooking | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all bus bookings
  const fetchBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        "http://localhost:5000/api/v1/bus-booking/get-all-bus-booking"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.data || data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Accept booking
  const handleAccept = async (booking: BusBooking) => {
    try {
      setProcessingId(booking._id);
      setError(null);

      const updateData = {
        status: "Accepted" as const,
      };

      console.log("Accepting booking:", booking._id);
      console.log("Sending update data:", updateData);

      const response = await fetch(
        `http://localhost:5000/api/v1/bus-booking/update-bus-booking/${booking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to accept booking: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Update response:", result);

      // Update local state immediately
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? { ...b, status: "Accepted", updatedAt: new Date().toISOString() }
            : b
        )
      );
    } catch (err) {
      console.error("Error accepting booking:", err);
      setError(err instanceof Error ? err.message : "Failed to accept booking");
    } finally {
      setProcessingId(null);
    }
  };

  // Open reject modal
  const handleRejectClick = (booking: BusBooking) => {
    setSelectedBooking(booking);
    setFeedback("");
    setIsRejectModalOpen(true);
  };

  // Submit rejection with feedback
  const handleRejectSubmit = async () => {
    if (!selectedBooking) return;

    // Validate feedback
    if (feedback.length < 10) {
      setError("Feedback must be at least 10 characters long");
      return;
    }

    if (feedback.length > 200) {
      setError("Feedback must be less than 200 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const updateData = {
        status: "Rejected" as const,
        feedback: feedback,
      };

      console.log("Rejecting booking:", selectedBooking._id);
      console.log("Sending update data:", updateData);

      const response = await fetch(
        `http://localhost:5000/api/v1/bus-booking/update-bus-booking/${selectedBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to reject booking: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Reject response:", result);

      // Update local state immediately
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? {
                ...b,
                status: "Rejected",
                feedback: feedback,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );

      // Close modal
      setIsRejectModalOpen(false);
      setSelectedBooking(null);
      setFeedback("");
    } catch (err) {
      console.error("Error rejecting booking:", err);
      setError(err instanceof Error ? err.message : "Failed to reject booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close reject modal
  const handleCloseModal = () => {
    setIsRejectModalOpen(false);
    setSelectedBooking(null);
    setFeedback("");
    setError(null);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchBookings(true);
  };

  // Handle try again button click
  const handleTryAgain = () => {
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return timeString;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return new Date(dateTimeString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get status badge styles
  const getStatusBadge = (status: "Accepted" | "Rejected" | "Pending") => {
    const baseClasses =
      "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border";

    switch (status) {
      case "Accepted":
        return `${baseClasses} bg-green-500/10 text-green-600 border-green-200`;
      case "Rejected":
        return `${baseClasses} bg-destructive/10 text-destructive border-destructive/20`;
      case "Pending":
        return `${baseClasses} bg-amber-500/10 text-amber-600 border-amber-200`;
      default:
        return `${baseClasses} bg-muted/50 text-muted-foreground border-border`;
    }
  };

  // Get status dot color
  const getStatusDot = (status: "Accepted" | "Rejected" | "Pending") => {
    switch (status) {
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-destructive";
      case "Pending":
        return "bg-amber-500 animate-pulse";
      default:
        return "bg-muted-foreground";
    }
  };

  // Filter bookings based on status
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );
  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  );
  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  );

  // Get current bookings based on active tab
  const getCurrentBookings = () => {
    switch (activeTab) {
      case "pending":
        return pendingBookings;
      case "accepted":
        return acceptedBookings;
      case "rejected":
        return rejectedBookings;
      default:
        return pendingBookings;
    }
  };

  // Get tab configuration
  const tabs = [
    {
      id: "pending" as TabType,
      name: "Pending Requests",
      count: pendingBookings.length,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "amber",
    },
    {
      id: "accepted" as TabType,
      name: "Accepted",
      count: acceptedBookings.length,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "green",
    },
    {
      id: "rejected" as TabType,
      name: "Rejected",
      count: rejectedBookings.length,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      color: "red",
    },
  ];

  const currentBookings = getCurrentBookings();

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">
              Bus Booking Management
            </h2>
            <button
              disabled
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium flex items-center space-x-2 opacity-50 cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-foreground">
          Bus Booking Management
        </h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors text-sm font-medium flex items-center space-x-2 shadow-sm"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-card-foreground mt-1">
                {bookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {pendingBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Accepted
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {acceptedBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Rejected
              </p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {rejectedBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="border-b border-border/40">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-500/5`
                    : "border-transparent text-muted-foreground hover:text-card-foreground hover:bg-muted/50"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                <span
                  className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500 text-white`
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2 text-destructive">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Table Content */}
          {currentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {activeTab === "pending"
                        ? "Requested"
                        : activeTab === "accepted"
                        ? "Accepted On"
                        : "Rejected On"}
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    {activeTab === "rejected" && (
                      <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Feedback
                      </th>
                    )}
                    {activeTab === "pending" && (
                      <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {currentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`hover:bg-primary/3 transition-colors duration-150 ${
                        activeTab === "accepted"
                          ? "hover:bg-green-500/3"
                          : activeTab === "rejected"
                          ? "hover:bg-destructive/3"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="min-w-0 max-w-md">
                          <h3 className="text-sm font-semibold text-card-foreground mb-1">
                            {booking.bookingSubject}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {booking.bookingDescription}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-card-foreground">
                            <svg
                              className="w-4 h-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-card-foreground">
                            <svg
                              className="w-4 h-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{formatTime(booking.bookingTime)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(
                            activeTab === "pending"
                              ? booking.createdAt
                              : booking.updatedAt
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className={getStatusBadge(booking.status)}>
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusDot(
                              booking.status
                            )}`}
                          ></div>
                          <span>{booking.status}</span>
                        </div>
                      </td>

                      {activeTab === "rejected" && (
                        <td className="py-4 px-6">
                          <div className="text-sm text-muted-foreground max-w-xs">
                            {booking.feedback ? (
                              <div
                                className="line-clamp-2"
                                title={booking.feedback}
                              >
                                {booking.feedback}
                              </div>
                            ) : (
                              <span className="text-muted-foreground/70">
                                No feedback provided
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {activeTab === "pending" && (
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAccept(booking)}
                              disabled={processingId === booking._id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow disabled:cursor-not-allowed"
                            >
                              {processingId === booking._id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span>Accept</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleRejectClick(booking)}
                              disabled={processingId === booking._id}
                              className="px-4 py-2 bg-destructive hover:bg-destructive/90 disabled:bg-destructive/50 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow disabled:cursor-not-allowed"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {activeTab === "pending" && (
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {activeTab === "accepted" && (
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {activeTab === "rejected" && (
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                No{" "}
                {activeTab === "pending"
                  ? "Pending"
                  : activeTab === "accepted"
                  ? "Accepted"
                  : "Rejected"}{" "}
                Bookings
              </h3>
              <p className="text-muted-foreground">
                {activeTab === "pending"
                  ? "No pending booking requests at the moment."
                  : activeTab === "accepted"
                  ? "No accepted bookings found."
                  : "No rejected bookings found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 fade-in"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border/60 shadow-2xl z-50 slide-in-right overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Reject Booking Request
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Booking Info */}
              {selectedBooking && (
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-card-foreground mb-2">
                    {selectedBooking.bookingSubject}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedBooking.bookingDescription}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(selectedBooking.bookingDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatTime(selectedBooking.bookingTime)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Form */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-card-foreground mb-2"
                  >
                    Feedback for Student *
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Please provide constructive feedback explaining why this booking cannot be accepted (10-200 characters)"
                    className="w-full h-32 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background text-card-foreground resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span
                      className={`text-xs ${
                        feedback.length < 10
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      Minimum 10 characters
                    </span>
                    <span
                      className={`text-xs ${
                        feedback.length > 200
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feedback.length}/200
                    </span>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-destructive text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-border text-card-foreground rounded-lg hover:bg-muted disabled:opacity-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={
                      isSubmitting ||
                      feedback.length < 10 ||
                      feedback.length > 200
                    }
                    className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 disabled:bg-destructive/50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <span>Reject Booking</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BusBookingTable;
