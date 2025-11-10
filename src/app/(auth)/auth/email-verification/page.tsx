"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface EmailVerificationProps {
  onVerificationSuccess?: () => void;
  redirectUrl?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onVerificationSuccess,
  redirectUrl = "/",
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [countdown, setCountdown] = useState(0);
  const [activeInput, setActiveInput] = useState(0);
  const [email, setEmail] = useState<string | null>(null);

  // Get email from cookies
  useEffect(() => {
    const getEmailFromCookies = () => {
      try {
        const cookies = document.cookie.split(";");
        const emailCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("verification-email=")
        );

        if (emailCookie) {
          const emailValue = emailCookie.split("=")[1]?.trim();
          if (emailValue) {
            setEmail(decodeURIComponent(emailValue));
            return;
          }
        }

        // Fallback to useAuth user email
        if (user?.email) {
          setEmail(user.email);
          return;
        }

        // If no email found anywhere
        toast.error("No email found. Please log in again.");
      } catch (error) {
        console.error("Error getting email from cookies:", error);
        toast.error("Error retrieving email. Please log in again.");
      }
    };

    getEmailFromCookies();
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit when all inputs are filled
  useEffect(() => {
    const isFilled = verificationCode.every((digit) => digit !== "");
    if (isFilled && email && !isLoading) {
      handleVerification();
    }
  }, [verificationCode]);

  const handleVerification = async () => {
    if (!email) {
      toast.error("No email found. Please log in again.");
      return;
    }

    const code = verificationCode.join("");

    if (code.length !== 6) {
      return;
    }

    setIsLoading(true);
    console.log("Sending verification request...", { email, code });

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/verify-email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            verificationCode: code,
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.status === "success" || response.ok) {
        toast.success("🎉 Email verified successfully! Welcome aboard!");

        // Clear the verification email cookie after successful verification
        document.cookie =
          "verification-email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        if (onVerificationSuccess) {
          onVerificationSuccess();
        } else if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000);
        }
      } else {
        toast.error(
          data.message || "Invalid verification code. Please try again."
        );
        setVerificationCode(["", "", "", "", "", ""]);
        setActiveInput(0);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("🚨 Failed to verify email. Please try again.");
      setVerificationCode(["", "", "", "", "", ""]);
      setActiveInput(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || !email) return;

    setIsResending(true);
    console.log("Resending code to:", email);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/new-code",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      console.log("Resend response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resend response data:", data);

      if (data.status === "Success" || response.ok) {
        toast.success("📧 New verification code sent! Check your email inbox.");
        setCountdown(60);
        setVerificationCode(["", "", "", "", "", ""]);
        setActiveInput(0);
      } else {
        toast.error(
          data.message ||
            "❌ Failed to send verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("🚨 Failed to send verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (!verificationCode[index] && index > 0) {
        setActiveInput(index - 1);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const pasteArray = pasteData.split("").slice(0, 6);
    const newCode = [...verificationCode];

    pasteArray.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setVerificationCode(newCode);
    setActiveInput(Math.min(pasteArray.length, 5));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification();
  };

  // Show loading while retrieving email
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">
            Loading verification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mx-auto mb-4">
              <svg
                className="w-10 h-10 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Verify Your Email
            </h1>
            <p className="text-lg text-muted-foreground">
              We sent a 6-digit code to your email address
            </p>
            <p className="font-semibold text-foreground text-xl bg-muted/50 px-4 py-2 rounded-lg inline-block">
              {email}
            </p>
          </div>
        </div>

        {/* Modern Code Input */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-foreground text-center">
              Enter verification code
            </label>
            <form
              onSubmit={handleManualSubmit}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setActiveInput(index)}
                    className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl bg-card text-foreground transition-all duration-200 focus:outline-none focus:scale-105 ${
                      activeInput === index
                        ? "border-primary ring-4 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || verificationCode.some((digit) => digit === "")
                }
                className="w-full max-w-xs py-4 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          </div>

          {/* Resend Code Section */}
          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="group inline-flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Sending new code...</span>
                </>
              ) : countdown > 0 ? (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Resend code in {countdown}s</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
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
                  <span>Resend verification code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Can't find the email? Check your spam folder or{" "}
            <button
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-2 transition-colors disabled:opacity-50"
            >
              request a new code
            </button>
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Code expires in 10 minutes</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
