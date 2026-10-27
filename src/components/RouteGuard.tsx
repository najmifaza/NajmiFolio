"use client";

import NotFound from "@/app/[locale]/not-found";
import { normalizeLocalePath } from "@/lib/locale-path";
import { protectedRoutes, routes } from "@/resources";
import { Button, Column, Flex, Heading, PasswordInput, Spinner } from "@once-ui-system/core";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
}

function checkRouteEnabled(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/admin")) return true;

  let normalizedPath = normalizeLocalePath(pathname);
  if (normalizedPath === "/en") {
    normalizedPath = "/";
  } else if (normalizedPath.startsWith("/en/")) {
    normalizedPath = normalizedPath.slice(3);
  }

  if (normalizedPath in routes) {
    return Boolean(routes[normalizedPath as keyof typeof routes]);
  }

  const dynamicRoutes = ["/blog", "/project"] as const;
  for (const route of dynamicRoutes) {
    if (normalizedPath.startsWith(route) && routes[route]) {
      return true;
    }
  }

  // Allow 1-segment dynamic routes (e.g. /BasdatShiftC anonymous message room)
  if (/^\/[^/]+$/.test(normalizedPath)) {
    return true;
  }

  return false;
}

function checkRouteProtected(pathname: string): boolean {
  if (!pathname) return false;
  let normalizedPath = normalizeLocalePath(pathname);
  if (normalizedPath === "/en") {
    normalizedPath = "/";
  } else if (normalizedPath.startsWith("/en/")) {
    normalizedPath = normalizedPath.slice(3);
  }

  return Boolean(
    protectedRoutes[pathname as keyof typeof protectedRoutes] ||
      protectedRoutes[normalizedPath as keyof typeof protectedRoutes],
  );
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname() ?? "";

  const enabled = checkRouteEnabled(pathname);
  const requiresPassword = checkRouteProtected(pathname);

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [checkingAuth, setCheckingAuth] = useState(requiresPassword);

  useEffect(() => {
    if (!requiresPassword) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;
    setCheckingAuth(true);

    fetch("/api/check-auth")
      .then((res) => {
        if (isMounted && res.ok) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, [requiresPassword]);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError(undefined);
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Authentication failed");
    }
  };

  if (!enabled) {
    return <NotFound />;
  }

  if (requiresPassword) {
    if (checkingAuth) {
      return (
        <Flex fillWidth paddingY="128" horizontal="center">
          <Spinner />
        </Flex>
      );
    }

    if (!isAuthenticated) {
      return (
        <Column paddingY="128" maxWidth={24} gap="24" center>
          <Heading align="center" wrap="balance">
            This page is password protected
          </Heading>
          <Column fillWidth gap="8" horizontal="center">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errorMessage={error}
            />
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </Column>
        </Column>
      );
    }
  }

  return <>{children}</>;
};

export { RouteGuard };
export default RouteGuard;
