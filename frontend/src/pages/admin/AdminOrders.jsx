import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

const statuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const statusStyles = {
  Pending: "bg-blush/40 text-tomato-dark",
  Confirmed: "bg-ocean/15 text-ocean",
  Preparing: "bg-amber/20 text-amber",
  "Out for Delivery": "bg-ocean/15 text-ocean",
  Delivered: "bg-basil/15 text-basil-dark",
  Cancelled: "bg-charcoal/10 text-charcoal/50",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => axiosClient.get("/orders/").then((res) => setOrders(res.data));
  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try { await axiosClient.put(`/orders/${id}/status`, { status }); loadOrders(); }
    finally { setUpdatingId(null); }
  };

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <AdminLayout title="Orders" subtitle="Track and update order status.">
      <div className="flex gap-2 mb-5 overflow-x-auto chip-scroll">
        <button onClick={() => setFilterStatus("")} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${filterStatus === "" ? "bg-charcoal text-white" : "bg-white border border-charcoal/10"}`}>All</button>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${filterStatus === s ? "bg-charcoal text-white" : "bg-white border border-charcoal/10"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-charcoal/40 border-b border-charcoal/8">
            <tr><th className="p-4">#</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Update</th></tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-charcoal/5">
                <td className="p-4">#{o.id}</td>
                <td className="p-4">#{o.customer_id}</td>
                <td className="p-4">{o.items.length}</td>
                <td className="p-4">Rs. {o.total_amount}</td>
                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>{o.status}</span></td>
                <td className="p-4">
                  <select value={o.status} disabled={updatingId === o.id} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="border border-charcoal/15 rounded-lg px-2 py-1">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default AdminOrders;