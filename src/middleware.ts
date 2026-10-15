import { verifyAuthToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip Next.js internals, API routes, and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Admin Route Protection
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const authToken = request.cookies.get("authToken")?.value;
    const isValid = await verifyAuthToken(authToken);

    if (!isLoginPage && !isValid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isLoginPage && isValid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // 2. Normalize /id/* routes to root (since id is default without prefix)
  if (pathname === "/id") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("NEXT_LOCALE", "id", { path: "/", maxAge: 31536000 });
    return response;
  }
  if (pathname.startsWith("/id/")) {
    const stripped = pathname.replace(/^\/id/, "");
    const response = NextResponse.redirect(new URL(stripped || "/", request.url));
    response.cookies.set("NEXT_LOCALE", "id", { path: "/", maxAge: 31536000 });
    return response;
  }

  // 3. For root path '/', handle smart Geo IP detection for first-time visitors
  if (pathname === "/") {
    // If visitor already chose a locale before, respect it
    if (cookieLocale === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
    if (cookieLocale === "id") {
      return NextResponse.next();
    }

    // First-time visitor without cookie: check Vercel Geo IP header
    const country =
      request.headers.get("x-vercel-ip-country") ||
      (request as unknown as { geo?: { country?: string } }).geo?.country;

    // Foreign visitor (IP outside Indonesia) -> redirect to /en
    if (country && country.toUpperCase() !== "ID") {
      const response = NextResponse.redirect(new URL("/en", request.url));
      response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 31536000 });
      return response;
    }

    // Local visitor (ID) or local dev -> stay on Indonesian default '/'
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", "id", { path: "/", maxAge: 31536000 });
    return response;
  }

  // 4. If visiting /en or /en/*, ensure cookie is kept in sync
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const response = NextResponse.next();
    if (cookieLocale !== "en") {
      response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 31536000 });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
