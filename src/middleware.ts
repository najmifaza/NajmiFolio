import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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

    if (!isLoginPage && authToken !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isLoginPage && authToken === "authenticated") {
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

  // 3. For root path '/', check for foreign visitor auto-detection
  if (pathname === "/") {
    // If user explicitly chose English before, redirect to /en
    if (cookieLocale === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }

    // If no cookie set, inspect Accept-Language header for auto-detection
    if (!cookieLocale) {
      const acceptLanguage = request.headers.get("accept-language") || "";
      const isIndonesian = acceptLanguage.toLowerCase().includes("id");

      // Foreign visitor without ID preference -> redirect to /en
      if (!isIndonesian && acceptLanguage.trim().length > 0) {
        const response = NextResponse.redirect(new URL("/en", request.url));
        response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 31536000 });
        return response;
      }
    }
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
