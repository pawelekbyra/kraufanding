import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that require specific tier levels (just as an example,
// but real enforcement should be in Server Components/API routes)
const isPremiumRoute = createRouteMatcher(["/premium(.*)", "/archive(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  // Redirect unauthenticated users from premium paths
  if (!userId && isPremiumRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // Example: Read tier from Clerk publicMetadata if available
  // This metadata can be populated from the Stripe webhook
  const tier = (sessionClaims?.metadata as any)?.tier || 0;

  // We can attach the tier to headers so Server Components can read it without DB hit
  const response = NextResponse.next();
  response.headers.set("x-user-tier", tier.toString());

  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
