import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-luxury-brown mb-10">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="flex flex-row md:flex-col gap-2 md:space-y-1 overflow-x-auto">
          {[
            { label: "Profile", icon: User, active: true },
            { label: "Orders", icon: Package },
            { label: "Addresses", icon: MapPin },
            { label: "Sign Out", icon: LogOut },
          ].map(({ label, icon: Icon, active }) => (
            <Link
              key={label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${
                active
                  ? "bg-luxury-gold/10 text-luxury-gold border-l-2 border-luxury-gold"
                  : "text-luxury-brown/60 hover:text-luxury-brown hover:bg-luxury-brown/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="md:col-span-3">
          <div className="bg-white border border-luxury-gold/20 p-8">
            <h2 className="font-serif text-xl text-luxury-brown mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">First Name</p>
                <p className="text-luxury-brown">John</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Last Name</p>
                <p className="text-luxury-brown">Doe</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Email</p>
                <p className="text-luxury-brown">john@example.com</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Phone</p>
                <p className="text-luxury-brown">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
