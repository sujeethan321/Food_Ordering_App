import { useState, useEffect } from "react";
import { getFoods } from "../api/foods";
import { getCategories } from "../api/categories";
import { useCart } from "../context/CartContext";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 8, total_pages: 1 });
  const { addToCart } = useCart();

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    sort: "",
    order: "asc",
    page: 1,
    limit: 8,
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    getFoods(filters)
      .then((res) => {
        setFoods(res.data.items);
        setPagination({
          total: res.data.total,
          page: res.data.page,
          limit: res.data.limit,
          total_pages: res.data.total_pages,
        });
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const goToPage = (page) => setFilters({ ...filters, page });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          name="search"
          placeholder="Search food..."
          value={filters.search}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        <select name="category_id" value={filters.category_id} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select name="sort" value={filters.sort} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>

        <select name="order" value={filters.order} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="bg-white rounded-lg shadow p-4">
            {food.image ? (
              <img src={food.image} alt={food.name} className="w-full h-32 object-cover rounded mb-3" />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <h3 className="font-semibold">{food.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{food.description}</p>
            <p className="text-orange-600 font-bold mb-3">Rs. {food.price}</p>
            <button
              onClick={() => addToCart(food)}
              disabled={!food.is_available}
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {food.is_available ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>

      {!loading && foods.length === 0 && <p className="text-gray-500 mt-6">No food items match your search.</p>}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded ${p === pagination.page ? "bg-orange-600 text-white" : "bg-white border"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;