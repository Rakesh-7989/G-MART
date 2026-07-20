import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, newsletterSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(newsletterSchema, body);
    if ("error" in validated) return validated.error;
    const { email } = validated.data;

    const { error } = await getApiSupabase()
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
