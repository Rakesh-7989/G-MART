import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getFeaturedProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { StarIcon } from "@/components/icons";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import TrustBadges from "@/components/TrustBadges";
import PincodeChecker from "@/components/PincodeChecker";
import RecentlyViewed, { trackRecentlyViewed } from "@/components/RecentlyViewed";
import ProductInfo from "@/components/ProductInfo";
import dynamic from "next/dynamic";
import Script from "next/script";

export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found | G-MART" };
  }
  return {
    title: `${product.name} | G-MART`,
    description: product.description?.slice(0, 160) || `Shop ${product.name} at G-MART.`,
    openGraph: {
      title: `${product.name} | G-MART`,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

// JSON-LD Product structured data
function ProductJsonLd({ product }: { product: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hrms-saas-rakesh-site-tracker-pro-s-projects.vercel.app";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const image = product.images?.[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=630&fit=crop";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: productUrl,
    image: [image],
    brand: {
      "@type": "Brand",
      name: "G-MART",
    },
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price / 100, // price is stored in paise
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "G-MART",
      },
    },
    aggregateRating: product.review_count && product.review_count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating?.toFixed(1) || "0",
      reviewCount: product.review_count,
    } : undefined,
  };

  return (
    <Script
      id="product-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl text-ink mb-4 font-bold">Product Not Found</h1>
        <Link href="/products" className="btn-primary">Back to Collection</Link>
      </div>
    );
  }

  const related = (await getFeaturedProducts())
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <ImageGallery images={product.images} name={product.name} />

          {/* Product Info - Client Component */}
          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-10">
              <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">
                You May Also Like
              </p>
              <h2 className="section-title">Complete the Look</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ProductReviews productId={product.id} />

        {/* Recently Viewed */}
        <RecentlyViewed />

        {/* Track Recently Viewed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=${JSON.stringify({slug:product.slug,name:product.name,price:product.price,images:product.images})};var r=JSON.parse(localStorage.getItem("recentlyViewed")||"[]").filter(function(x){return x.slug!==p.slug});r.unshift(p);localStorage.setItem("recentlyViewed",JSON.stringify(r.slice(0,8)))}catch(e){}`,
          }}
        />
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line p-3 flex items-center gap-3 lg:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted truncate">{product.name}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-ink text-sm">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <AddToCartButton product={product} />
        </div>
      </div>
    </>
  );
}

// Import ImageGallery dynamically to avoid SSR issues
const ImageGallery = dynamic(() => import("@/components/ImageGallery"), { ssr: false });
const AddToCartButton = dynamic(() => import("@/components/AddToCartButton"), { ssr: false });