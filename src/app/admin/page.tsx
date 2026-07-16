import { ShoppingBag, DollarSign, Package, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Orders", value: "156", icon: ShoppingBag, change: "+12%", positive: true },
  { label: "Revenue", value: "₹24.8L", icon: DollarSign, change: "+18%", positive: true },
  { label: "Products", value: "48", icon: Package, change: "+4", positive: true },
  { label: "Customers", value: "1,024", icon: Users, change: "+8%", positive: true },
];

const recentOrders = [
  { id: "#G1001", customer: "Priya Sharma", items: 3, total: "₹1,24,999", status: "Delivered" },
  { id: "#G1002", customer: "Amit Patel", items: 1, total: "₹45,999", status: "Processing" },
  { id: "#G1003", customer: "Sneha Reddy", items: 2, total: "₹89,500", status: "Shipped" },
  { id: "#G1004", customer: "Rahul Verma", items: 1, total: "₹54,999", status: "Pending" },
  { id: "#G1005", customer: "Ananya Gupta", items: 4, total: "₹2,35,000", status: "Delivered" },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl text-luxury-brown">Admin Dashboard</h1>
        <button className="btn-primary text-sm">Add Product</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map(({ label, value, icon: Icon, change, positive }) => (
          <div key={label} className="bg-white border border-luxury-gold/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon className="text-luxury-gold/60" size={24} />
              <span className={`text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
                {change}
              </span>
            </div>
            <p className="text-2xl font-serif text-luxury-brown">{value}</p>
            <p className="text-sm text-luxury-brown/60 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-luxury-gold/20">
        <div className="px-6 py-4 border-b border-luxury-gold/20">
          <h2 className="font-serif text-xl text-luxury-brown">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-luxury-gold/10 text-luxury-brown/60 uppercase tracking-wider text-xs">
                <th className="text-left px-6 py-4 font-medium">Order</th>
                <th className="text-left px-6 py-4 font-medium">Customer</th>
                <th className="text-left px-6 py-4 font-medium">Items</th>
                <th className="text-left px-6 py-4 font-medium">Total</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-luxury-gold/5 hover:bg-luxury-gold/5">
                  <td className="px-6 py-4 font-medium text-luxury-brown">{order.id}</td>
                  <td className="px-6 py-4 text-luxury-brown/70">{order.customer}</td>
                  <td className="px-6 py-4 text-luxury-brown/70">{order.items}</td>
                  <td className="px-6 py-4 text-luxury-brown">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                      order.status === "Shipped" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
