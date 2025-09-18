import UserRoles, { UserRole } from "@/enums/Role";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";
import userAction from "@/lib/server/action/user-action";

const protectedRoutes: (string | RegExp)[] = [
  /^\/comic\/create$/,
  /^\/comic\/[^/]+\/edit$/,
  /^\/dashboard/,
];

const adminRoutes: (string | RegExp)[] = [/^\/admin/];

function matchRoute(pathname: string, routes: (string | RegExp)[]): boolean {
  return routes.some((route) =>
    typeof route === "string"
      ? pathname.startsWith(route)
      : route.test(pathname)
  );
}

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ignoredPaths = [
    "/.well-known/appspecific/",
    "/.well-known/assetlinks.json",
    "/favicon.ico",
  ];
  if (ignoredPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole: number =
    typeof token?.role === "number" ? token.role : UserRoles.User;
  const isAdmin = userRole === UserRoles.Admin;
  const isSystemAdmin = userRole === UserRoles.SystemAdmin || isAdmin;

  const accountAge = token?.accountCreatedAt
    ? Math.floor(
        (Date.now() - new Date(token.accountCreatedAt as string).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (!isLoggedIn && matchRoute(pathname, protectedRoutes)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdmin && !isSystemAdmin && matchRoute(pathname, adminRoutes)) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  const response = NextResponse.next();

  if (isLoggedIn && token) {
    response.headers.set("x-user-id", token.sub || "");
    response.headers.set("x-user-email", token.email || "");
    response.headers.set("x-user-role", userRole.toString());
    response.headers.set(
      "x-user-verified",
      token.isVerified ? "true" : "false"
    );
    response.headers.set("x-account-age", accountAge.toString());
  }
  return response;
}

export function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      role: number;
    };

    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { error: "expired" };
    }
    return null;
  }
}

export const withAuth = (allowedRoles: UserRole[]) => {
  return async (request: NextRequest) => {
    const token = verifyToken(request);
    if (!token || "error" in token)
      return {
        status: HttpStatusCode.Unauthorized,
        error: token?.error || "Unauthorized",
      };

    const userId = token.sub;
    const user = await userAction.getUserById(userId);
    if (!user)
      return { status: HttpStatusCode.Unauthorized, error: "Unauthorized" };
    (request as any).user = user;

    const hasRequiredRights =
      allowedRoles.length === 0 || allowedRoles.includes(user.role);
    if (!hasRequiredRights)
      return { status: HttpStatusCode.Forbidden, error: "Permission denied" };

    return { user };
  };
};
