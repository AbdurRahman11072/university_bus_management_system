import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes
  const isPublicRoute = path === "/auth/login" || path === "/auth/register";

  // Protected routes
  const isProtectedRoute =
    path === "/schedule" ||
    path === "/notice" ||
    path === "/booktrip" ||
    path === "/profile" ||
    path.startsWith("/dashboard");

  // Get token
  const token = request.cookies.get("auth_token")?.value || "";

  console.log("Path:", path, "Token:", !!token);

  // If user has token and is on public route, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // If user has no token and is on protected route, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  // Additional: Check admin role for dashboard
  if (path.startsWith("/dashboard") && token) {
    const userCookie = request.cookies.get("user_data")?.value;
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user.role !== "Admin") {
          return NextResponse.redirect(new URL("/", request.nextUrl));
        }
      } catch (error) {
        console.error("Error parsing user_data:", error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/schedule",
    "/schedule/:path*",
    "/notice",
    "/notice/:path*",
    "/booktrip",
    "/booktrip/:path*",
    "/profile",
    "/profile/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
