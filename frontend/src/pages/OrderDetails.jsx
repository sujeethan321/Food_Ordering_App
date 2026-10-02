import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";

const statusStyles = {
  Pending: "bg-blush/40 text-tomato-dark",
  Confirmed: "bg-ocean/15 text-ocean",
  Preparing: "bg-amber/20 text-amber",
  "Out for Delivery": "bg-ocean/15 text-ocean",
  Delivered: "bg-basil/15 text-basil-dark",
  Cancelled: "bg-charcoal/10 text-charcoal/50",
};

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { getOrderById(id).then((res) => setOrder(res.data)); }, [id]);

  if (!order) return <div className="min-h-screen bg-cream flex items-center justify-center text-charcoal/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
        <Link to="/my-orders" className="text-tomato text-sm mb-4 inline-block">&larr; Back to my orders</Link>
        <div className="flex justify-between items-start mb-6">
          <h1 className="font-display text-2xl font-semibold">Order #{order.id}</h1>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}>{order.status}</span>
        </div>
        <p className="text-charcoal/40 text-sm mb-6">{new Date(order.created_at).toLocaleString()}</p>
        <div className="border-y border-charcoal/8 py-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.food_name} × {item.quantity}</span><span>Rs. {item.subtotal}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span><span className="text-tomato">Rs. {order.total_amount}</span>
        </div>
      </div>
    </div>
  );
}
export default OrderDetails;