import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-orange-100 text-orange-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found"));
  }, [id]);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!order) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <Link to="/my-orders" className="text-orange-600 text-sm mb-4 inline-block">&larr; Back to my orders</Link>

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <span className={`text-sm px-3 py-1 rounded ${statusColors[order.status] || "bg-gray-100"}`}>
            {order.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Placed on {new Date(order.created_at).toLocaleString()}
        </p>

        <div className="border-t border-b py-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.food_name} × {item.quantity}</span>
              <span>Rs. {item.subtotal}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-orange-600">Rs. {order.total_amount}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;