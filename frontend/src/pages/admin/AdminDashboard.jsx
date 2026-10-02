import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

const statusStyles = {
  Pending: "bg-blush/40 text-tomato-dark",
  Confirmed: "bg-ocean/15 text-ocean",
  Preparing: "bg-amber/20 text-amber",
  "Out for Delivery": "bg-ocean/15 text-ocean",
  Delivered: "bg-basil/15 text-basil-dark",
  Cancelled: "bg-charcoal/10 text-charcoal/50",
};

function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${iconBg}`}>{icon}</div>
      <p className="text-charcoal/50 text-sm">{label}</p>
      <p className="font-display text-2xl font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    axiosClient.get("/admin/stats").then((res) => setStats(res.data));
    axiosClient.get("/orders/").then((res) => setRecent(res.data.slice(0, 5)));
    axiosClient.get("/admin/popular-foods?limit=4").then((res) => setPopular(res.data));
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Manage your restaurant, foods, orders and customers.">
      {!stats ? <p className="text-charcoal/40">Loading...</p> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🍴" iconBg="bg-basil/15" label="Foods" value={stats.total_foods} />
            <StatCard icon="🛒" iconBg="bg-tomato/15" label="Orders" value={stats.total_orders} />
            <StatCard icon="⏱️" iconBg="bg-amber/20" label="Pending" value={stats.pending_orders} />
            <StatCard icon="📈" iconBg="bg-ocean/15" label="Delivered revenue" value={`Rs. ${stats.total_revenue}`} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-4">Recent Orders</h2>
              <table className="w-full text-sm">
                <thead className="text-charcoal/40 text-left">
                  <tr><th className="pb-2">#</th><th className="pb-2">Total</th><th className="pb-2">Status</th></tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id} className="border-t border-charcoal/5">
                      <td className="py-2">{String(o.id).padStart(4, "0")}</td>
                      <td className="py-2">Rs. {o.total_amount}</td>
                      <td className="py-2"><span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-4">Popular Foods</h2>
              <div className="space-y-3">
                {popular.map((f) => (
                  <div key={f.food_id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-lg">🍽️</div>
                    <div>
                      <p className="text-sm font-medium">{f.food_name}</p>
                      <p className="text-xs text-charcoal/40">{f.total_quantity_ordered} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
export default AdminDashboard;