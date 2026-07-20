import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await getServiceRoleSupabase()
      .storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = getServiceRoleSupabase()
      .storage
      .from("products")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
