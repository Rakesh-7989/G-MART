import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, addressSchema, addressUpdateSchema } from "@/lib/validation";

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

async function getAuthUser(token: string) {
  const { data: { user }, error } = await getApiSupabase().auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const token = getUserFromToken(request);
    if (!token) return NextResponse.json({ addresses: [] });

    const user = await getAuthUser(token);
    if (!user) return NextResponse.json({ addresses: [] });

    const { data, error } = await getApiSupabase()
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ addresses: data || [] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getUserFromToken(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getAuthUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const validated = validate(addressSchema, body);
    if ("error" in validated) return validated.error;
    const { label, line1, line2, city, state, pincode, is_default } = validated.data;

    if (is_default) {
      await getApiSupabase()
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await getApiSupabase()
      .from("addresses")
      .insert({
        user_id: user.id,
        label,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
        is_default,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ address: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getUserFromToken(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getAuthUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const validated = validate(addressUpdateSchema, body);
    if ("error" in validated) return validated.error;
    const { id, label, line1, line2, city, state, pincode, is_default } = validated.data;

    const updateData: Record<string, any> = {};
    if (label !== undefined) updateData.label = label;
    if (line1 !== undefined) updateData.line1 = line1;
    if (line2 !== undefined) updateData.line2 = line2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (is_default !== undefined) updateData.is_default = is_default;

    if (is_default) {
      await getApiSupabase()
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", id);
    }

    const { data, error } = await getApiSupabase()
      .from("addresses")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ address: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getUserFromToken(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getAuthUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Address id is required" }, { status: 400 });

    const { error } = await getApiSupabase()
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
