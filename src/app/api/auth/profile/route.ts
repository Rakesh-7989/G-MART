import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await getApiSupabase().auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const { data: existing } = await getApiSupabase()
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existing) {
      await getApiSupabase()
        .from("users")
        .update({ name, phone })
        .eq("id", user.id);
    } else {
      await getApiSupabase()
        .from("users")
        .insert({ id: user.id, name, phone });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
