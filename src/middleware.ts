import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sobre",
  "/areas-de-atuacao(.*)",
  "/blog(.*)",
  "/contato",
  "/login(.*)",
  "/cadastro(.*)",
  "/portal(.*)",        // portal do cliente tem auth própria
  "/api/webhook(.*)",  // webhooks externos
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
