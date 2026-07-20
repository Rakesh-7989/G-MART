import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { data, error } = await getApiSupabase().auth.getUser(token);
    if (error || !data.user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        phone: data.user.user_metadata?.phone || "",
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
