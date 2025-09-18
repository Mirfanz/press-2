import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { decodeAccessToken } from "./lib/utils/auth";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const protectedPaths = ["/", "/information", "/account", "/cash"];
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const accessToken = req.cookies.get("access_token")?.value;

  if (isProtected) {
    if (!accessToken) {
      const redirect = `/auth/login?redirect_url=${encodeURIComponent(pathname)}`;

      return NextResponse.redirect(new URL(redirect, req.url));
    }

    try {
      await decodeAccessToken(accessToken);
    } catch (err) {
      const redirect = `/auth/login?redirect_url=${encodeURIComponent(pathname)}`;

      return NextResponse.redirect(new URL(redirect, req.url));
    }
  }

  const redirectUrl = searchParams.get("redirect_url");

  if (redirectUrl) {
    const decoded = decodeURIComponent(redirectUrl);

    if (decoded.startsWith("/")) {
      return NextResponse.redirect(new URL(decoded, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/information/:path*",
    "/account/:path*",
    "/cash/:path*",
    "/logout",
  ],
};
