import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => navigate(isAuthenticated ? "/checkout" : "/login");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-6">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-charcoal/50 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="bg-tomato hover:bg-tomato-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold">Your cart</h1>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.food_id} className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-tomato font-medium text-sm">Rs. {item.price}</p>
                <div className="flex items-center gap-2 bg-cream-dark rounded-full px-2 py-1 mt-2 w-fit">
                  <button onClick={() => decreaseQuantity(item.food_id)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-tomato">−</button>
                  <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.food_id)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-tomato">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-tomato">Rs. {subtotal(item).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.food_id)} className="text-charcoal/30 hover:text-clay text-xs mt-2">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-charcoal/60">Total</span>
            <span className="font-display text-2xl font-semibold text-tomato">Rs. {total.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-tomato-dark text-white font-semibold py-3.5 rounded-full transition-colors">
            Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Cart;