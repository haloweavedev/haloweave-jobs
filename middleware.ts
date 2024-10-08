import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/pricing',
  '/contact',
  '/terms',
  '/privacy'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (isPublicRoute(req)) {
    return;
  }

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    return Response.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/(api|trpc)(.*)'
  ],
};
