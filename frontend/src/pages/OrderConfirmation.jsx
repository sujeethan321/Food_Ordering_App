import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { getOrderById(id).then((res) => setOrder(res.data)); }, [id]);

  if (!order) return <div className="min-h-screen bg-cream flex items-center justify-center text-charcoal/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="font-display text-2xl font-semibold mb-1">Order placed!</h1>
        <p className="text-charcoal/50 mb-6">Order #{order.id} — {order.status}</p>

        <div className="text-left bg-cream-dark rounded-2xl p-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.food_name} × {item.quantity}</span><span>Rs. {item.subtotal}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-3 mt-3 border-t border-charcoal/10">
            <span>Total</span><span className="text-tomato">Rs. {order.total_amount}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/my-orders" className="flex-1 bg-tomato hover:bg-tomato-dark text-white font-semibold py-3 rounded-full">My orders</Link>
          <Link to="/menu" className="flex-1 border border-charcoal/15 font-semibold py-3 rounded-full hover:bg-cream-dark">Order more</Link>
        </div>
      </div>
    </div>
  );
}
export default OrderConfirmation;