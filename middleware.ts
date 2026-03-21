import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  // 1. GUEST ACCESS (Handled by clerkMiddleware as default)

  // 2. ADMIN PROTECTION
  if (isAdminRoute(req)) {
    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (role !== "ADMIN") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  // 3. DASHBOARD PROTECTION (At least user role or creator)
  if (isDashboardRoute(req)) {
    if (!userId) {
      const url = new URL("/sign-in", req.url);
      return NextResponse.redirect(url);
    }
    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (!["ADMIN", "MODERATOR", "CREATOR", "USER"].includes(role)) {
       // if they have no role at all (not in DB)
       const url = new URL("/", req.url);
       return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
