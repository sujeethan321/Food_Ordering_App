import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";

const statusStyles = {
  Pending: "bg-blush/40 text-tomato-dark",
  Confirmed: "bg-ocean/15 text-ocean",
  Preparing: "bg-amber/20 text-amber",
  "Out for Delivery": "bg-ocean/15 text-ocean",
  Delivered: "bg-basil/15 text-basil-dark",
  Cancelled: "bg-charcoal/10 text-charcoal/50",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { getMyOrders().then((res) => setOrders(res.data)).catch(() => setError(true)).finally(() => setLoading(false)); }, []);

  return (
    <div className="min-h-screen bg-cream px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="font-display text-3xl font-semibold mb-6">My Orders</h1>

        {loading && <p role="status">Loading your orders...</p>}{error && <p role="alert">Your orders could not load. <button className="text-tomato underline" onClick={() => window.location.reload()}>Try again</button></p>}
        {!loading && !error && orders.length === 0 && <p className="text-charcoal/50">You haven't placed any orders yet. <Link to="/menu" className="text-tomato">Browse the menu</Link></p>}

        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/my-orders/${order.id}`} className="block bg-white rounded-2xl p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-charcoal/50">{order.items.length} item(s) &middot; {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-tomato font-display font-semibold mt-1">Rs. {order.total_amount}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}>{order.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default MyOrders;