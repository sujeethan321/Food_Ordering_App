import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link to="/menu" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((item) => (
          <div key={item.food_id} className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500 text-sm">Rs. {item.price} each</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => decreaseQuantity(item.food_id)} className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300">−</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.food_id)} className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300">+</button>
            </div>

            <p className="font-semibold w-24 text-right">Rs. {subtotal(item).toFixed(2)}</p>

            <button onClick={() => removeFromCart(item.food_id)} className="text-red-500 hover:underline ml-4">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-6 flex justify-between items-center">
        <span className="text-xl font-bold">Total: Rs. {total.toFixed(2)}</span>
        <button onClick={handleCheckout} className="bg-orange-600 text-white px-6 py-3 rounded font-semibold hover:bg-orange-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;