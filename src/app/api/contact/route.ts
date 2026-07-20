import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, contactSchema } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(contactSchema, body);
    if ("error" in validated) return validated.error;
    const { name, email, phone, message } = validated.data;

    const { error } = await getApiSupabase().from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    sendContactNotification({ name, email, phone: phone || null, message }).catch(() => {});

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
