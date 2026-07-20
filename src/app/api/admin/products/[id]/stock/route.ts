import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const body = await request.json();
    const { in_stock } = body;

    if (typeof in_stock !== "boolean") {
      return NextResponse.json({ error: "in_stock must be a boolean" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("products")
      .update({ in_stock })
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
