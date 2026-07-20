import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, authForgotPasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(authForgotPasswordSchema, body);
    if ("error" in validated) return validated.error;
    const { email } = validated.data;

    const origin = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || "http://localhost:3000";

    const { error } = await getApiSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
