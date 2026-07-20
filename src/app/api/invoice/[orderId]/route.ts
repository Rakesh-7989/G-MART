import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleSupabase } from "@/lib/supabase";
import { generateInvoiceBuffer } from "@/lib/invoice";

export async function GET(
  _request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    // Fetch order
    const { data: order, error } = await getServiceRoleSupabase()
      .from("orders")
      .select("*")
      .eq("id", params.orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch order items separately
    const { data: orderItems } = await getServiceRoleSupabase()
      .from("order_items")
      .select("*")
      .eq("order_id", params.orderId);

    order.order_items = orderItems || [];

    const buffer = await generateInvoiceBuffer(order);

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Invoice generation error:", err);
    return NextResponse.json({ error: "Failed to generate invoice", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
