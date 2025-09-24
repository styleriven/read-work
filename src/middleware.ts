import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With, Accept, Origin, ngrok-skip-browser-warning",
          "Access-Control-Max-Age": "86400",
          "ngrok-skip-browser-warning": "true",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin, ngrok-skip-browser-warning"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "index, follow");
    return response;
  }

  if (pathname.startsWith("/admin")) {
    const response = await authMiddleware(request);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const response = await authMiddleware(request);

  response.headers.set("X-Robots-Tag", "index, follow");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - icons (public icons)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
