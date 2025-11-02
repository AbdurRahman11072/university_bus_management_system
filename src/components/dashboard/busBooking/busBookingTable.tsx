"use client";
import React, { useState, useEffect } from "react";

interface BusBooking {
  _id: string;
  bookingSubject: string;
  bookingDescription: string;
  bookingTime: string;
  bookingDate: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

const BusBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all bus bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
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
    }
  };

  // Approve booking - FIXED: Correct API endpoint and PUT method
  const handleApprove = async (booking: BusBooking) => {
    try {
      setApprovingId(booking._id);
      setError(null);

      // Prepare update data - only send necessary fields
      const updateData = {
        status: true,
      };

      console.log("Approving booking:", booking._id);
      console.log("Sending update data:", updateData);

      const response = await fetch(
        `http://localhost:5000/api/v1/bus-booking/update-bus-booking/${booking._id}`,
        {
          method: "PUT", // Changed to PUT method
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to approve booking: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Update response:", result);

      // Update local state immediately
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? { ...b, status: true, updatedAt: new Date().toISOString() }
            : b
        )
      );
    } catch (err) {
      console.error("Error approving booking:", err);
      setError(
        err instanceof Error ? err.message : "Failed to approve booking"
      );
    } finally {
      setApprovingId(null);
    }
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

  // Filter bookings
  const pendingBookings = bookings.filter((booking) => !booking.status);
  const approvedBookings = bookings.filter((booking) => booking.status);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="text-lg font-semibold text-card-foreground">
            Bus Booking Management
          </h2>
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
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Approved
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {approvedBookings.length}
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
      </div>

      {/* Approved Bookings Table - Shows on top when there are approved bookings */}
      {approvedBookings.length > 0 && (
        <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 bg-gradient-to-r from-green-500/5 to-green-500/2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
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
                  Approved Bookings
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {approvedBookings.length} approved booking
                  {approvedBookings.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

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
                    Approved On
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {approvedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-green-500/3 transition-colors duration-150"
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
                        {formatDateTime(booking.updatedAt)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-200">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Approved</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Bookings Table */}
      {pendingBookings.length > 0 && (
        <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 bg-gradient-to-r from-primary/5 to-primary/2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Pending Booking Requests
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {pendingBookings.length} request
                  {pendingBookings.length !== 1 ? "s" : ""} awaiting approval
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchBookings}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center space-x-2"
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

          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
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
                    Requested
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {pendingBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-primary/3 transition-colors duration-150"
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
                        {formatDateTime(booking.createdAt)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <span>Pending</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleApprove(booking)}
                        disabled={approvingId === booking._id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow disabled:cursor-not-allowed"
                      >
                        {approvingId === booking._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Approving...</span>
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
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State when no bookings */}
      {bookings.length === 0 && !loading && (
        <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              No Booking Requests
            </h3>
            <p className="text-muted-foreground">
              No bus booking requests found.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusBookingTable;
