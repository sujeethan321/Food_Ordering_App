import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const emptyForm = { name: "", description: "" };

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadCategories = () => axiosClient.get("/categories/").then((res) => setCategories(res.data));

  useEffect(() => { loadCategories(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setError(""); };
  const openEditForm = (cat) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await axiosClient.put(`/categories/${editingId}`, form);
      else await axiosClient.post("/categories/", form);
      setShowForm(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button onClick={openAddForm} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          + Add Category
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Category" : "Add Category"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2" />
            <div className="col-span-2 flex gap-3">
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
            <tr><th className="p-3">Name</th><th className="p-3">Description</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.description}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => openEditForm(c)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;