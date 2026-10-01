import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-orange-100 text-orange-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">
          You haven't placed any orders yet. <Link to="/menu" className="text-orange-600">Browse the menu</Link>
        </p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            to={`/my-orders/${order.id}`}
            key={order.id}
            className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} &middot; {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-orange-600 font-bold mt-1">Rs. {order.total_amount}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status] || "bg-gray-100"}`}>
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;