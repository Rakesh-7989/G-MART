import { ShieldIcon, TruckIcon, CreditCardIcon, StarIcon, PencilIcon } from "./icons";

const ITEMS = [
  { icon: TruckIcon, label: "Factory Direct Pricing" },
  { icon: PencilIcon, label: "Custom Made Options" },
  { icon: ShieldIcon, label: "Pan-India Delivery" },
  { icon: StarIcon, label: "Quality Craftsmanship" },
  { icon: CreditCardIcon, label: "Bulk & Corporate Orders" },
];

export default function USPSection() {
  return (
    <section className="border-y border-line bg-[#efefef]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-2.5">
              <item.icon size={22} className="text-terracotta flex-shrink-0" />
              <span className="text-xs font-medium text-ink leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
