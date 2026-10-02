import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFoods } from "../api/foods";
import { useCart } from "../context/CartContext";

const categoryPills = [
  { label: "All", icon: "🍽️" },
  { label: "Pizza", icon: "🍕" },
  { label: "Burger", icon: "🍔" },
  { label: "Rice", icon: "🍚" },
  { label: "Drinks", icon: "🥤" },
  { label: "Desserts", icon: "🍰" },
];

function Home() {
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getFoods({ limit: 3, is_available: true }).then((res) => setFoods(res.data.items));
  }, []);

  return (
    <div className="bg-cream">
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-basil-dark font-semibold text-xs tracking-widest uppercase mb-4">Sri Lankan Restaurant</p>
          <h1 className="font-display text-6xl font-semibold leading-[1.05] mb-5">
            Good food.<br/>Great mood.
          </h1>
          <p className="text-charcoal/60 text-lg mb-2">Your next favourite meal is a few clicks away.</p>
          <div className="w-16 h-1 bg-basil rounded-full mb-7"></div>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-tomato hover:bg-tomato-dark text-white font-semibold px-7 py-3.5 rounded-full transition-colors">
            Explore menu
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="relative bg-cream-dark rounded-[2.5rem] aspect-square flex items-center justify-center text-[10rem] overflow-hidden">
          🍕
          <span className="absolute top-8 left-10 text-2xl -rotate-12">🍅</span>
          <span className="absolute bottom-10 right-10 text-2xl rotate-10">🌿</span>
          <span className="absolute top-12 right-14 text-xl rotate-8">🌶️</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1">
          {categoryPills.map((c) => (
            <Link
              key={c.label}
              to={c.label === "All" ? "/menu" : `/menu?category=${c.label}`}
              className="shrink-0 flex items-center gap-2 bg-white border border-charcoal/10 hover:border-tomato/40 rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              <span>{c.icon}</span>{c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-semibold mb-5">Popular picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food.id} className="bg-white rounded-3xl p-3 border border-charcoal/8">
              <div className="h-44 rounded-2xl overflow-hidden bg-cream-dark mb-3">
                {food.image ? (
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                )}
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-semibold mb-2">{food.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg font-semibold text-tomato">Rs. {food.price}</span>
                  <button
                    onClick={() => addToCart(food)}
                    className="flex items-center gap-1.5 bg-tomato hover:bg-tomato-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default Home;
