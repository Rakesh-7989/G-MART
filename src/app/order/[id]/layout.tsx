import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | G-MART",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
