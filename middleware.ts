// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the current path
  const { pathname } = request.nextUrl;

  // Get authentication token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // Get user data from cookies
  const userCookie = request.cookies.get("user_data")?.value;
  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.error("Error parsing user_data cookie:", error);
    }
  }

  console.log(`🛡️ Middleware checking: ${pathname}`);

  // Define protected routes
  const protectedRoutes = [
    "/schedule",
    "/notice",
    "/booktrip",
    "/profile",
    "/dashboard",
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if current path is auth route
  const isAuthRoute = pathname.startsWith("/auth");

  // Check if current path is admin route
  const isAdminRoute = pathname.startsWith("/dashboard");

  // 🔒 Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    console.log("🚫 No token - redirecting to login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 👑 Redirect if non-admin tries to access admin routes
  if (isAdminRoute && token && user?.role !== "Admin") {
    console.log("🚫 Non-admin accessing admin route");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 🔄 Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    console.log("✅ Authenticated user on auth page - redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Allow access
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
