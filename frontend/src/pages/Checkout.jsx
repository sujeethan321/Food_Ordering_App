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
      const orderItems = items.map((item) => ({
        food_id: item.food_id,
        quantity: item.quantity,
      }));
      const response = await placeOrder(orderItems);
      clearCart();
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <p className="text-gray-500">Your cart is empty — nothing to check out.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="mb-6 pb-6 border-b">
          <h2 className="font-semibold mb-2">Delivery Details</h2>
          <p className="text-gray-600 text-sm">{user?.name}</p>
          <p className="text-gray-600 text-sm">{user?.phone}</p>
          <p className="text-gray-600 text-sm">{user?.address || "No address on file — update your profile"}</p>
        </div>

        <div className="mb-6 pb-6 border-b">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          {items.map((item) => (
            <div key={item.food_id} className="flex justify-between text-sm mb-1">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {subtotal(item).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-orange-600">Rs. {total.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full bg-orange-600 text-white py-3 rounded font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Final total is confirmed by the server at checkout
        </p>
      </div>
    </div>
  );
}

export default Checkout;