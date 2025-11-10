"use client";
import React from "react";

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

interface RejectedBookingProps {
  booking: BusBooking; // Changed from specific "Rejected" to general BusBooking
  onTryAgain?: () => void;
  className?: string;
}

const RejectedBookingAlert: React.FC<RejectedBookingProps> = ({
  booking,
  onTryAgain,
  className = "",
}) => {
  // Only show the alert if the booking is actually rejected
  if (booking.status !== "Rejected") {
    return null;
  }

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

  return (
    <div
      className={`bg-card rounded-xl border border-destructive/30 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-destructive/20 bg-gradient-to-r from-destructive/5 to-destructive/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-destructive"
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
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Booking Rejected
              </h2>
              <p className="text-sm text-muted-foreground">
                Your booking request was not approved
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                BOOKING DETAILS
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-card-foreground text-sm">
                    {booking.bookingSubject}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.bookingDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatTime(booking.bookingTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                TIMELINE
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      Booking Submitted
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      Booking Rejected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                ADMINISTRATOR FEEDBACK
              </h3>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    {booking.feedback ? (
                      <div>
                        <p className="text-sm font-medium text-card-foreground mb-2">
                          Reason for Rejection
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {booking.feedback}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          No Feedback Provided
                        </p>
                        <p className="text-xs text-muted-foreground">
                          The administrator did not provide specific feedback
                          for this rejection.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                WHAT YOU CAN DO NEXT
              </h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Submit a New Request
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Consider the feedback and create a new booking request
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Contact Support
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reach out if you need clarification on the feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40">
          {onTryAgain && (
            <button
              onClick={onTryAgain}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
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
              <span>Submit New Booking Request</span>
            </button>
          )}

          <button className="px-6 py-3 border border-border text-card-foreground rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-center space-x-2">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact version for use in lists
export const CompactRejectedBooking: React.FC<RejectedBookingProps> = ({
  booking,
  onTryAgain,
  className = "",
}) => {
  // Only show if the booking is actually rejected
  if (booking.status !== "Rejected") {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div
      className={`bg-card rounded-lg border border-destructive/20 p-4 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span className="text-xs font-medium text-destructive">
              REJECTED
            </span>
          </div>

          <h3 className="font-semibold text-card-foreground text-sm mb-1">
            {booking.bookingSubject}
          </h3>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {booking.bookingDescription}
          </p>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>{formatDate(booking.bookingDate)}</span>
            <span>•</span>
            <span>
              {booking.feedback ? "Feedback provided" : "No feedback"}
            </span>
          </div>
        </div>

        {onTryAgain && (
          <button
            onClick={onTryAgain}
            className="ml-4 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default RejectedBookingAlert;
