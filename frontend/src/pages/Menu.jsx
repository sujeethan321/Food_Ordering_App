import { useState, useEffect } from "react";
import { getFoods } from "../api/foods";
import { getCategories } from "../api/categories";
import { useCart } from "../context/CartContext";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total_pages: 1, page: 1 });
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const [filters, setFilters] = useState({ search: "", category_id: "", sort: "", order: "asc", page: 1, limit: 9 });

  useEffect(() => { getCategories().then((res) => setCategories(res.data)); }, []);

  useEffect(() => {
    setLoading(true);
    getFoods(filters).then((res) => {
      setFoods(res.data.items);
      setPagination({ total_pages: res.data.total_pages, page: res.data.page });
    }).finally(() => setLoading(false));
  }, [filters]);

  const cartQty = (foodId) => items.find((i) => i.food_id === foodId)?.quantity || 0;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h1 className="font-display text-3xl font-semibold mb-6">Our Menu</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Search for your favourite food..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full bg-white border border-charcoal/10 rounded-full pl-11 pr-4 py-3 outline-none focus:border-tomato/40 transition-colors"
            />
          </div>
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })} className="border border-charcoal/10 bg-white rounded-full px-4 py-3 text-sm">
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <select value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })} className="border border-charcoal/10 bg-white rounded-full px-4 py-3 text-sm">
            <option value="asc">Low to high / A-Z</option>
            <option value="desc">High to low / Z-A</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto chip-scroll mb-8 pb-1">
          <button
            onClick={() => setFilters({ ...filters, category_id: "", page: 1 })}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${filters.category_id === "" ? "bg-tomato text-white border-tomato" : "bg-white border-charcoal/10 hover:border-tomato/40"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilters({ ...filters, category_id: String(c.id), page: 1 })}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${filters.category_id === String(c.id) ? "bg-tomato text-white border-tomato" : "bg-white border-charcoal/10 hover:border-tomato/40"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-cream-dark rounded-3xl animate-pulse"></div>)}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {foods.map((food) => {
              const qty = cartQty(food.id);
              return (
                <div key={food.id} className="bg-white rounded-3xl p-3 border border-charcoal/8">
                  <div className="h-40 rounded-2xl overflow-hidden bg-cream-dark mb-3">
                    {food.image ? (
                      <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                    )}
                  </div>
                  <div className="px-2 pb-1">
                    <h3 className="font-semibold mb-2">{food.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-lg font-semibold text-tomato">Rs. {food.price}</span>
                      {!food.is_available ? (
                        <span className="text-xs text-charcoal/40 font-medium">Unavailable</span>
                      ) : qty > 0 ? (
                        <div className="flex items-center gap-2 bg-cream-dark rounded-full px-2 py-1">
                          <button onClick={() => decreaseQuantity(food.id)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-tomato">−</button>
                          <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                          <button onClick={() => increaseQuantity(food.id)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-tomato">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(food)} className="flex items-center gap-1.5 bg-tomato hover:bg-tomato-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && foods.length === 0 && <p className="text-center text-charcoal/40 py-10">No food items match your search.</p>}

        {pagination.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setFilters({ ...filters, page: p })}
                className={`w-9 h-9 rounded-full text-sm font-medium ${p === pagination.page ? "bg-tomato text-white" : "bg-white border border-charcoal/10"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Menu;