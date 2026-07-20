import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: users } = await getApiSupabase()
      .from("users")
      .select("id")
      .eq("id", email);

    const { data: { users: authUsers } } = await getApiSupabase().auth.admin.listUsers();

    const matchedUser = authUsers?.find((u) => u.email === email);
    if (!matchedUser) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    const { data: existing } = await getApiSupabase()
      .from("admins")
      .select("id")
      .eq("user_id", matchedUser.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 409 });
    }

    const { error } = await getApiSupabase()
      .from("admins")
      .insert({ user_id: matchedUser.id });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, userId: matchedUser.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { data, error } = await getApiSupabase()
      .from("admins")
      .select("*, users(name, email)")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
