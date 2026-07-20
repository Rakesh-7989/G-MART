import type { MetadataRoute } from "next";

const BASE_URL = "https://hrms-saas-rakesh-site-tracker-pro-s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/blog",
    "/contact",
    "/track-order",
    "/bulk-orders",
    "/privacy-policy",
    "/return-policy",
    "/shipping-policy",
    "/terms",
    "/login",
    "/register",
    "/profile",
    "/cart",
    "/checkout",
  ];

  const today = new Date();

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: today,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/products" ? 0.9 : 0.7,
  }));
}