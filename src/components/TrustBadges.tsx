import { ShieldIcon, TruckIcon, CreditCardIcon, StarIcon, PencilIcon, BoxIcon } from "./icons";

const BADGES = [
  { icon: BoxIcon, label: "Return & Replacement" },
  { icon: TruckIcon, label: "Pan-India Delivery" },
  { icon: PencilIcon, label: "Customization Available" },
  { icon: StarIcon, label: "10 Year Warranty" },
  { icon: ShieldIcon, label: "Premium Materials" },
  { icon: CreditCardIcon, label: "Easy EMI Options" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 py-6 border-y border-line my-6">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center text-center gap-1.5">
          <badge.icon size={20} className="text-terracotta" />
          <span className="text-[11px] text-muted leading-tight">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
