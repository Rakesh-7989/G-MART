import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, authResetPasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(authResetPasswordSchema, body);
    if ("error" in validated) return validated.error;
    const { password } = validated.data;

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getApiSupabase();

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
