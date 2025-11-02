"use client";
import React, { useEffect, Suspense } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
  unauthorizedPath?: string;
  loadingFallback?: React.ReactNode;
}

const ProtectedRoute = ({
  children,
  requiredRole = "Admin",
  fallbackPath = "/auth/login",
  unauthorizedPath = "/",
  loadingFallback = <div>Loading...</div>,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(fallbackPath);
      return;
    }

    if (requiredRole && user.roles !== requiredRole) {
      router.push(unauthorizedPath);
    }
  }, [user, isLoading, requiredRole, router, fallbackPath, unauthorizedPath]);

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!user || (requiredRole && user.roles !== requiredRole)) {
    return <>{loadingFallback}</>;
  }

  return <Suspense fallback={loadingFallback}>{children}</Suspense>;
};

export default ProtectedRoute;
