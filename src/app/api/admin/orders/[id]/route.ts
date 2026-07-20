import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";
import { validate, orderStatusSchema } from "@/lib/validation";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const body = await request.json();
    const { status, tracking_number, tracking_url } = body;

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
    if (tracking_url !== undefined) updateData.tracking_url = tracking_url;
    if (status === "shipped") updateData.shipped_at = new Date().toISOString();
    if (status === "delivered") updateData.delivered_at = new Date().toISOString();

    const { data, error } = await getApiSupabase()
      .from("orders")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (status) {
      sendOrderStatusUpdate({
        id: params.id,
        customer_name: data.customer_name || "Customer",
        customer_email: data.customer_email,
        status,
        tracking_url,
      }).catch(() => {});
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
