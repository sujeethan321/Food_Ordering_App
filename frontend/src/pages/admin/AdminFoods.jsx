import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { getCategories } from "../../api/categories";

const emptyForm = { name: "", description: "", price: "", image: "", is_available: true, category_id: "" };

function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadFoods = () => axiosClient.get("/foods/?limit=100").then((res) => setFoods(res.data.items));

  useEffect(() => {
    loadFoods();
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const openAddForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setError(""); };
  const openEditForm = (food) => {
    setForm({
      name: food.name, description: food.description || "", price: food.price,
      image: food.image || "", is_available: food.is_available, category_id: food.category_id,
    });
    setEditingId(food.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      category_id: Number(form.category_id),
    };
    try {
      if (editingId) await axiosClient.put(`/foods/${editingId}`, payload);
      else await axiosClient.post("/foods/", payload);
      setShowForm(false);
      loadFoods();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save food");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete or deactivate this food item?")) return;
    try {
      await axiosClient.delete(`/foods/${id}`);
      loadFoods();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete food");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Foods</h1>
        <button onClick={openAddForm} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          + Add Food
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Food" : "Add Food"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} className="border rounded px-3 py-2" required />
            <select name="category_id" value={form.category_id} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border rounded px-3 py-2" />

            <label className="flex items-center gap-2 col-span-2 md:col-span-3">
              <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} />
              Available
            </label>

            <div className="col-span-2 md:col-span-3 flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {editingId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Available</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.name}</td>
                <td className="p-3">Rs. {f.price}</td>
                <td className="p-3">{f.is_available ? "Yes" : "No"}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => openEditForm(f)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFoods;