import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orders";

function Checkout() {
  const { items, subtotal, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    setError("");
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ food_id: i.food_id, quantity: i.quantity }));
      const res = await placeOrder(orderItems);
      clearCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-charcoal/50">Your cart is empty — nothing to check out.</div>;
  }

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
        <h1 className="font-display text-2xl font-semibold mb-6">Checkout</h1>

        <div className="bg-cream-dark rounded-2xl p-4 mb-6">
          <h2 className="font-semibold text-sm mb-2">Delivery details</h2>
          <p className="text-sm text-charcoal/60">{user?.name}</p>
          <p className="text-sm text-charcoal/60">{user?.phone}</p>
          <p className="text-sm text-charcoal/60">{user?.address || "No address on file"}</p>
        </div>

        <div className="mb-6">
          {items.map((item) => (
            <div key={item.food_id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">Rs. {subtotal(item).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {error && <div className="bg-blush/30 text-tomato-dark text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <div className="flex justify-between items-center border-t pt-4 mb-6">
          <span className="font-semibold">Total</span>
          <span className="font-display text-xl font-semibold text-tomato">Rs. {total.toFixed(2)}</span>
        </div>

        <button onClick={handlePlaceOrder} disabled={submitting} className="w-full bg-tomato hover:bg-tomato-dark text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-50">
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </div>
    </div>
  );
}
export default Checkout;