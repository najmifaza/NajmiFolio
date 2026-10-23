import { verifyAuthToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only real static assets skip the middleware. A bare `pathname.includes(".")`
// test let paths like /admin/x.y bypass the admin guard entirely.
const STATIC_FILE = /\.[a-z0-9]+$/i;

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Rewrite (not redirect) to the default-locale tree so the public URL stays
// unprefixed while only src/app/[locale] has to be maintained.
function rewriteToDefaultLocale(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/id" : `/id${pathname}`;
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip Next.js internals and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Admin Route Protection — checked before the static-asset skip so no path
  // shape (e.g. /admin/x.y) can slip past it.
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

  // 3. Skip static assets
  if (pathname.startsWith("/images") || STATIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // 3. Normalize /id/* to the unprefixed default locale
  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const stripped = pathname.replace(/^\/id/, "") || "/";
    const response = NextResponse.redirect(new URL(stripped, request.url));
    response.cookies.set("NEXT_LOCALE", "id", { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
    return response;
  }

  // 4. Explicit /en/* keeps its prefix and stays on the same [locale] tree
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const response = NextResponse.next();
    if (request.cookies.get("NEXT_LOCALE")?.value !== "en") {
      response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
    }
    return response;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // 5. Root: respect a previous choice, else Geo-IP detect for first-time visitors
  if (pathname === "/") {
    if (cookieLocale === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }

    if (cookieLocale !== "id") {
      const country =
        request.headers.get("x-vercel-ip-country") ||
        (request as unknown as { geo?: { country?: string } }).geo?.country;

      if (country && country.toUpperCase() !== "ID") {
        const response = NextResponse.redirect(new URL("/en", request.url));
        response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
        return response;
      }

      const response = rewriteToDefaultLocale(request, pathname);
      response.cookies.set("NEXT_LOCALE", "id", { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
      return response;
    }

    return rewriteToDefaultLocale(request, pathname);
  }

  // 6. Any other path is the default locale
  return rewriteToDefaultLocale(request, pathname);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
