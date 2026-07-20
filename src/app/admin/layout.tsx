import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | G-MART",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
