import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/account", "/account/orders", "/account/addresses"];
const guestRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("gmart_token")?.value;
  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isGuest = guestRoutes.some((r) => path.startsWith(r));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isGuest && token) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/auth/login", "/auth/register"],
};
