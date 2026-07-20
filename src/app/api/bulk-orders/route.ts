import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleSupabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      industry,
      projectType,
      quantity,
      timeline,
      budget,
      message,
      products,
    } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    // Store in Supabase
    const supabase = getServiceRoleSupabase();
    const { data, error } = await supabase
      .from("bulk_orders")
      .insert({
        name,
        email,
        phone,
        company,
        industry,
        project_type: projectType,
        quantity,
        timeline,
        budget,
        message,
        products,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Bulk order insert error:", error);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: "G-MART B2B <b2b@gmart.com>",
        to: ["b2b@gmart.com"],
        subject: `New Bulk Order Inquiry from ${company}`,
        html: `
          <h2>New Bulk Order Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Industry:</strong> ${industry || "N/A"}</p>
          <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
          <p><strong>Quantity:</strong> ${quantity || "N/A"}</p>
          <p><strong>Timeline:</strong> ${timeline || "N/A"}</p>
          <p><strong>Budget:</strong> ${budget || "N/A"}</p>
          <p><strong>Products of Interest:</strong> ${products || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${message || "N/A"}</p>
        `,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Bulk order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}