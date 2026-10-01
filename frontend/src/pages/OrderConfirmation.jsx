import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";

function OrderConfirmation() {
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
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">Order #{order.id} — Status: {order.status}</p>

        <div className="text-left bg-gray-50 rounded p-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.food_name} × {item.quantity}</span>
              <span>Rs. {item.subtotal}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-3 border-t">
            <span>Total</span>
            <span>Rs. {order.total_amount}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/my-orders" className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
            View My Orders
          </Link>
          <Link to="/menu" className="flex-1 border py-2 rounded hover:bg-gray-100">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;