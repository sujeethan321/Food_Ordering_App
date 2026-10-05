import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { getCategories } from "../../api/categories";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = { name: "", description: "", price: "", image: "", is_available: true, category_id: "" };
const inputClass = "border border-charcoal/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-tomato bg-white";

function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFoods = () => axiosClient.get("/foods/?limit=100").then((res) => setFoods(res.data.items)).catch(() => setError("Could not load foods. Please try again.")).finally(() => setLoading(false));
  useEffect(() => { loadFoods(); getCategories().then((res) => setCategories(res.data)).catch(() => setError("Category options could not load.")); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const openAddForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setError(""); };
  const openEditForm = (f) => {
    setForm({ name: f.name, description: f.description || "", price: f.price, image: f.image || "", is_available: f.is_available, category_id: f.category_id });
    setEditingId(f.id); setShowForm(true); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), category_id: Number(form.category_id) };
    try {
      if (editingId) await axiosClient.put(`/foods/${editingId}`, payload);
      else await axiosClient.post("/foods/", payload);
      setShowForm(false); loadFoods();
    } catch (err) { setError(err.response?.data?.detail || "Failed to save food"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete or deactivate this food?")) return;
    try { await axiosClient.delete(`/foods/${id}`); loadFoods(); }
    catch (err) { setError(err.response?.data?.detail || "Failed to delete"); }
  };

  return (
    <AdminLayout title="Foods" subtitle="Add, edit and manage menu items.">
      <div className="flex justify-end mb-5">
        <button onClick={openAddForm} className="bg-tomato hover:bg-tomato-dark text-white font-semibold px-5 py-2.5 rounded-full">+ Add Food</button>
      </div>
      {error && <p role="alert" className="text-tomato-dark mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="name" aria-label="Name" placeholder="Name" value={form.name} onChange={handleChange} className={inputClass} required />
            <input name="price" type="number" step="0.01" aria-label="Price" placeholder="Price" value={form.price} onChange={handleChange} className={inputClass} required />
            <div className="group relative flex items-center min-w-0 text-tomato-dark">
              <span aria-hidden="true" className="pointer-events-none absolute left-3 size-1.5 rounded-full bg-current" />
              <select
                aria-label="Food category"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="order-status-select appearance-none w-full min-w-0 border border-charcoal/15 hover:border-tomato/50 bg-transparent rounded-xl pl-7 pr-10 py-2.5 text-sm font-semibold tracking-wide cursor-pointer transition-[border-color,box-shadow,opacity] duration-200 ease-out hover:shadow-sm focus-visible:ring-2 focus-visible:ring-tomato focus-visible:ring-offset-2 motion-reduce:transition-none"
                required
              >
                <option value="" disabled className="bg-white text-charcoal">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-white text-charcoal">{c.name}</option>)}
              </select>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute right-3 size-4 opacity-50 transition-[transform,opacity] duration-200 group-hover:translate-y-0.5 group-hover:opacity-100 group-focus-within:rotate-180 group-focus-within:opacity-100 motion-reduce:transition-none">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input name="description" aria-label="Description" placeholder="Description" value={form.description} onChange={handleChange} className={`${inputClass} col-span-2`} />
            <input name="image" aria-label="Image URL" placeholder="Image URL" value={form.image} onChange={handleChange} className={inputClass} />
            <label className="flex items-center gap-2 col-span-2 md:col-span-3 text-sm">
              <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} /> Available
            </label>
            <div className="col-span-2 md:col-span-3 flex gap-3">
              <button type="submit" className="bg-basil hover:bg-basil-dark text-white px-5 py-2.5 rounded-full font-semibold">{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-charcoal/15 px-5 py-2.5 rounded-full font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p role="status" className="mb-4">Loading foods...</p>}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-charcoal/40 border-b border-charcoal/8">
            <tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Available</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id} className="border-t border-charcoal/5">
                <td className="p-4 font-medium">{f.name}</td>
                <td className="p-4">Rs. {f.price}</td>
                <td className="p-4">{f.is_available ? "Yes" : "No"}</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => openEditForm(f)} className="text-ocean font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="text-tomato-dark font-medium hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default AdminFoods;
