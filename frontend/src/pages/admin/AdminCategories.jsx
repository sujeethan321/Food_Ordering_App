import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = { name: "", description: "" };
const inputClass = "border border-charcoal/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-tomato bg-white";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = () => axiosClient.get("/categories/").then((res) => setCategories(res.data)).catch(() => setError("Could not load categories. Please try again.")).finally(() => setLoading(false));
  useEffect(() => { loadCategories(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAddForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setError(""); };
  const openEditForm = (c) => { setForm({ name: c.name, description: c.description || "" }); setEditingId(c.id); setShowForm(true); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await axiosClient.put(`/categories/${editingId}`, form);
      else await axiosClient.post("/categories/", form);
      setShowForm(false); loadCategories();
    } catch (err) { setError(err.response?.data?.detail || "Failed to save category"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try { await axiosClient.delete(`/categories/${id}`); loadCategories(); }
    catch (err) { setError(err.response?.data?.detail || "Failed to delete"); }
  };

  return (
    <AdminLayout title="Categories" subtitle="Organise your menu into categories.">
      <div className="flex justify-end mb-5">
        <button onClick={openAddForm} className="bg-tomato hover:bg-tomato-dark text-white font-semibold px-5 py-2.5 rounded-full">+ Add Category</button>
      </div>
      {error && <p role="alert" className="text-tomato-dark mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input name="name" aria-label="Name" placeholder="Name" value={form.name} onChange={handleChange} className={inputClass} required />
            <input name="description" aria-label="Description" placeholder="Description" value={form.description} onChange={handleChange} className={inputClass} />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-basil hover:bg-basil-dark text-white px-5 py-2.5 rounded-full font-semibold">{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-charcoal/15 px-5 py-2.5 rounded-full font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p role="status" className="mb-4">Loading categories...</p>}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-charcoal/40 border-b border-charcoal/8">
            <tr><th className="p-4">Name</th><th className="p-4">Description</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-charcoal/5">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-charcoal/60">{c.description}</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => openEditForm(c)} className="text-ocean font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-tomato-dark font-medium hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default AdminCategories;