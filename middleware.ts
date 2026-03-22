import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that should be protected
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.publicMetadata as any)?.role;

  // 1. ADMIN PROTECTION
  if (isAdminRoute(req)) {
    if (role !== "ADMIN") {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // 2. DASHBOARD PROTECTION
  if (isDashboardRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (!role || !["ADMIN", "MODERATOR", "CREATOR", "USER"].includes(role)) {
       const homeUrl = new URL("/", req.url);
       return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
