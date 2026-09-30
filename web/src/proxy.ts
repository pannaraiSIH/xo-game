import { NextRequest, NextResponse } from "next/server";
import { getPayloadFromToken } from "./lib/token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  if (pathname.startsWith("/scores")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await getPayloadFromToken(token);

    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/scores/:path*"],
};
