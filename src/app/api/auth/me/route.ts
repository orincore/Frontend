import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.set(COOKIE_NAME, "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      email: payload.email,
      full_name: payload.full_name,
      role: payload.role,
    },
  });
}
