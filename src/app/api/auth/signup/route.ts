import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, authSignupSchema } from "@/lib/validation";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(authSignupSchema, body);
    if ("error" in validated) return validated.error;
    const { email, password, name, phone } = validated.data;

    const { data, error } = await getApiSupabase().auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const response = NextResponse.json({ user: data.user, session: data.session }, { status: 201 });

    if (data.session?.access_token) {
      response.cookies.set("gmart_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    sendWelcomeEmail(email, name || "there").catch(() => {});

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
