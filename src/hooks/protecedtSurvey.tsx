"use client";
import React, { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedSurveyProps {
  children: React.ReactNode;
}

const ProtectedSurvey = ({ children }: ProtectedSurveyProps) => {
  const { user, hasCompletedSurvey, isSurveyLoading, initialCheckComplete } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define ALL public routes that don't require authentication
  const publicRoutes = ["/", "/schedule", "/contact-us"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = pathname.startsWith("/auth");
  const isSurveyRoute = pathname === "/survey";

  // Check if user has special roles (Admin or Driver)
  const isAdmin = user?.roles === "Admin";
  const isDriver = user?.roles === "Driver";
  const hasSpecialRole = isAdmin || isDriver;

  // Normalize verification flag - backend may store boolean, string, or number
  const userIsVerified = (() => {
    const v: any = (user as any)?.isVerified;
    if (v === true || v === 1) return true;
    if (typeof v === "string") {
      const s = v.toLowerCase();
      return s === "true" || s === "1" || s === "yes";
    }
    return false;
  })();

  // User should NOT access survey if they've already completed it AND don't have special role
  const shouldBlockSurveyAccess =
    user && hasCompletedSurvey && isSurveyRoute && !hasSpecialRole;

  console.log("🔍 ProtectedSurvey Debug:");
  console.log("  - pathname:", pathname);
  console.log("  - isPublicRoute:", isPublicRoute);
  console.log("  - isAuthRoute:", isAuthRoute);

  console.log("  - user:", user);
  console.log("  - user role:", user?.roles);
  console.log(
    "  - user isVerified:",
    user?.isVerified,
    "-> normalized:",
    userIsVerified
  );
  console.log("  - hasCompletedSurvey:", hasCompletedSurvey);
  console.log("  - isAdmin:", isAdmin);
  console.log("  - isDriver:", isDriver);
  console.log("  - hasSpecialRole:", hasSpecialRole);
  console.log("  - shouldBlockSurveyAccess:", shouldBlockSurveyAccess);
  console.log("  - initialCheckComplete:", initialCheckComplete);
  console.log("  - isSurveyLoading:", isSurveyLoading);

  useEffect(() => {
    console.log("🔄 useEffect triggered");

    // Don't interfere with public routes or auth routes
    if (isPublicRoute || isAuthRoute) {
      console.log("✅ Public/Auth route - no protection needed");
      return;
    }

    // Wait for checks to complete
    if (!initialCheckComplete || isSurveyLoading) {
      console.log("⏳ Waiting for auth checks to complete");
      return;
    }

    console.log("🛡️ Applying protection logic for protected route");

    // No user - go to login (only for protected routes)
    if (!user) {
      console.log("❌ No user, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // Check email verification for all authenticated users (except special roles)
    if (user && !userIsVerified && !hasSpecialRole) {
      console.log("📧 User not verified, redirecting to email verification");
      router.push("/auth/email-verification");
      return;
    }

    // If user has special role, allow access to all routes (bypass email verification)
    if (hasSpecialRole) {
      console.log(
        "⭐ Special role user (Admin/Driver) - allowing access to all routes (bypasses email verification)"
      );
      // Special role users can access everything, no redirects needed
      return;
    }

    console.log("👤 Regular user - applying survey rules");

    // Regular user exists but no survey - only allow survey route
    if (!hasCompletedSurvey && !isSurveyRoute && userIsVerified) {
      console.log(
        "📝 Regular user hasn't completed survey, redirecting to survey"
      );
      router.push("/survey");
      return;
    }

    // Regular USER CAN NEVER USE SURVEY ROUTE AGAIN AFTER COMPLETION
    if (hasCompletedSurvey && isSurveyRoute && userIsVerified) {
      console.log("🚫 Survey already completed - permanent redirect to home");
      router.push("/");
      return;
    }

    console.log("✅ All checks passed - allowing access");
  }, [
    user,
    hasCompletedSurvey,
    isSurveyLoading,
    initialCheckComplete,
    router,
    pathname,
    isSurveyRoute,
    isAuthRoute,
    isPublicRoute,
    hasSpecialRole,
  ]);

  // Show loading only for protected routes (not public or auth routes)
  if (
    !isPublicRoute &&
    !isAuthRoute &&
    (!initialCheckComplete || isSurveyLoading)
  ) {
    console.log("⏳ Showing loading for protected route");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Always render children for public and auth routes
  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // For protected routes only, apply protection rules
  if (!user) {
    return null;
  }

  // Check email verification in the render logic as well
  if (user && !userIsVerified && !hasSpecialRole) {
    console.log("📧 Render blocking - user not verified");
    return null;
  }

  // If user has special role, allow access to all routes (bypass email verification)
  if (hasSpecialRole) {
    console.log("⭐ Special role user - allowing access to all routes");
    return <>{children}</>;
  }

  // PERMANENTLY BLOCK SURVEY ACCESS AFTER COMPLETION (only for regular users)
  if (hasCompletedSurvey && isSurveyRoute) {
    console.log(
      "🚫 Blocking survey access - survey already completed by regular user"
    );
    return null;
  }

  // Redirect non-survey regular users to survey
  if (!hasCompletedSurvey && !isSurveyRoute) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedSurvey;
