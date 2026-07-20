import type { Metadata } from "next";
import Link from "next/link";
import { getApiSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | G-MART | Furniture Ideas & Inspiration",
  description: "Discover furniture buying guides, design tips, and home decor inspiration from the G-MART blog.",
};

export default async function BlogPage() {
  const { data: posts } = await getApiSupabase()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Ideas & Inspiration</p>
        <h1 className="text-3xl text-ink font-bold">G-MART Blog</h1>
        <p className="text-muted text-sm mt-3">Tips, guides, and inspiration for your dream home.</p>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="text-center py-16">
          <p className="text-muted">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="aspect-[16/9] bg-card-bg rounded-card overflow-hidden mb-4">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${post.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=338&fit=crop"})` }}
                />
              </div>
              <p className="text-xs text-terracotta uppercase tracking-wider mb-1">{post.author || "G-MART"}</p>
              <h2 className="font-bold text-ink group-hover:text-terracotta transition-colors mb-2">{post.title}</h2>
              <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>
              <p className="text-xs text-muted mt-3">{new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
