import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { data: post } = await getApiSupabase()
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
