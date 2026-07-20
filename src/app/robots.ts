import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://hrms-saas-rakesh-site-tracker-pro-s-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/cart", "/checkout", "/profile/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}