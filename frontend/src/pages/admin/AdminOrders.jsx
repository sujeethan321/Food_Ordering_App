import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

const statuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const statusStyles = {
  Pending: "bg-transparent text-orange-950",
  Confirmed: "bg-transparent text-sky-950",
  Preparing: "bg-transparent text-amber-950",
  "Out for Delivery": "bg-transparent text-cyan-950",
  Delivered: "bg-transparent text-green-950",
  Cancelled: "bg-transparent text-red-950",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = () => axiosClient.get("/orders/").then((res) => setOrders(res.data));
  useEffect(() => {
    loadOrders().catch(() => setError("Could not load orders. Please refresh and try again."));
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      const res = await axiosClient.put(`/orders/${id}/status`, { status });
      setOrders((previous) => previous.map((order) => order.id === id ? res.data : order));
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not update order status. Please try again.");
    }
    finally { setUpdatingId(null); }
  };

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <AdminLayout title="Orders" subtitle="Track and update order status.">
      {error && <p role="alert" className="bg-blush/40 text-tomato-dark rounded-xl px-4 py-3 mb-4">{error}</p>}
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
                <td className="p-4"><span className={`text-xs font-semibold px-2.5 py-1 ${statusStyles[o.status]}`}>{o.status}</span></td>
                <td className="p-4">
                  <div className={`group relative inline-flex items-center ${statusStyles[o.status]}`}>
                    <span aria-hidden="true" className="pointer-events-none absolute left-3 size-1.5 rounded-full bg-current" />
                    <select
                      aria-label={`Update status for order ${o.id}`}
                      aria-busy={updatingId === o.id}
                      value={o.status}
                      disabled={updatingId !== null}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="order-status-select appearance-none min-w-44 border-0 bg-transparent rounded-xl pl-7 pr-10 py-2.5 text-sm font-semibold tracking-wide cursor-pointer transition-[box-shadow,opacity] duration-200 ease-out hover:shadow-sm focus-visible:ring-2 focus-visible:ring-tomato focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
                    >
                      {statuses.map((s) => <option key={s} value={s} className="bg-white text-charcoal">{s}</option>)}
                    </select>
                    {updatingId === o.id ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute right-3 size-4 animate-spin motion-reduce:animate-none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute right-3 size-4 opacity-50 transition-[transform,opacity] duration-200 group-hover:translate-y-0.5 group-hover:opacity-100 group-focus-within:rotate-180 group-focus-within:opacity-100 motion-reduce:transition-none">
                        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
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
