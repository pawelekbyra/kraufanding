import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  // @ts-ignore
  const role = sessionClaims?.metadata?.role;

  // Protect Admin routes
  if (isAdminRoute(req)) {
    if (!userId || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect Dashboard routes (Creator or Admin)
  if (isDashboardRoute(req)) {
    if (!userId || (role !== 'CREATOR' && role !== 'ADMIN')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
