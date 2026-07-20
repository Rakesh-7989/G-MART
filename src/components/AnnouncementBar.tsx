"use client";

import { PhoneIcon, PencilIcon, TruckIcon, StarIcon } from "./icons";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ?? "+91-93195-74949";
const WHATSAPP_HREF = `tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919319574949"}`;

const ANNOUNCEMENT_ITEMS = [
  {
    icon: PhoneIcon,
    text: `Call Now: ${WHATSAPP_NUMBER}`,
    href: WHATSAPP_HREF,
  },
  {
    icon: PencilIcon,
    text: "Become Franchise Owner",
  },
  {
    icon: TruckIcon,
    text: "Track Order",
    href: "/track-order",
  },
  {
    icon: StarIcon,
    text: "Trusted by 1,00,00,000+ Happy Customers",
  },
];

export default function AnnouncementBar() {
  const items = [...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS];

  return (
    <div
      className="bg-ink text-white overflow-hidden"
      style={{ height: "34px" }}
    >
      <div className="h-full flex items-center overflow-hidden">
        <div
          className="flex whitespace-nowrap animate-scroll"
          style={{ animationDuration: "80s" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-6 h-full"
              style={{ height: "34px" }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                >
                  <item.icon size={14} className="flex-shrink-0" />
                  <span className="text-xs leading-none">{item.text}</span>
                </a>
              ) : (
                <span className="flex items-center gap-2 text-xs leading-none">
                  <item.icon size={14} className="flex-shrink-0" />
                  <span>{item.text}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
