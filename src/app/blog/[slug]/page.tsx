import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApiSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await getApiSupabase()
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-sm text-terracotta hover:underline mb-8 inline-block">&larr; Back to Blog</Link>
      <p className="text-xs text-terracotta uppercase tracking-wider mb-2">{post.author || "G-MART"}</p>
      <h1 className="text-3xl text-ink font-bold mb-4">{post.title}</h1>
      <p className="text-xs text-muted mb-8">{new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      {post.image && (
        <div className="aspect-[16/9] bg-card-bg rounded-card overflow-hidden mb-8 relative">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
        </div>
      )}
      <div className="prose prose-sm max-w-none text-muted leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data: post } = await getApiSupabase()
      .from("posts")
      .select("title, excerpt, image")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();

    if (!post) return { title: "Post Not Found | G-MART" };

    return {
      title: `${post.title} | G-MART Blog`,
      description: post.excerpt || "Read more on the G-MART blog.",
      openGraph: post.image ? { images: [{ url: post.image }] } : undefined,
    };
  } catch {
    return { title: "G-MART Blog" };
  }
}
