import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

function StatCard({ label, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient.get("/admin/stats").then((res) => setStats(res.data)).catch(() => setError("Failed to load stats"));
    axiosClient.get("/admin/popular-foods?limit=5").then((res) => setPopularFoods(res.data)).catch(() => {});
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Foods" value={stats.total_foods} />
        <StatCard label="Total Categories" value={stats.total_categories} />
        <StatCard label="Total Customers" value={stats.total_customers} />
        <StatCard label="Total Orders" value={stats.total_orders} />
        <StatCard label="Total Revenue" value={`Rs. ${stats.total_revenue}`} color="text-green-600" />
        <StatCard label="Pending Orders" value={stats.pending_orders} color="text-yellow-600" />
        <StatCard label="Delivered Orders" value={stats.delivered_orders} color="text-blue-600" />
      </div>

      <h2 className="text-xl font-bold mb-4">Popular Foods</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr><th className="p-3">Rank</th><th className="p-3">Food</th><th className="p-3">Total Ordered</th></tr>
          </thead>
          <tbody>
            {popularFoods.map((food, i) => (
              <tr key={food.food_id} className="border-t">
                <td className="p-3">#{i + 1}</td>
                <td className="p-3">{food.food_name}</td>
                <td className="p-3">{food.total_quantity_ordered}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {popularFoods.length === 0 && <p className="p-4 text-gray-400 text-center">No orders yet.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;