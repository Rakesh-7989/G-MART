import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST() {
  const { error } = await getApiSupabase().auth.signOut();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("gmart_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
