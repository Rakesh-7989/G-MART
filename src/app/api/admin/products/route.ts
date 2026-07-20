import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";
import { validate, productSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const body = await request.json();
    const validated = validate(productSchema, body);
    if ("error" in validated) return validated.error;
    const { data, error } = await getApiSupabase().from("products").insert(validated.data).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
