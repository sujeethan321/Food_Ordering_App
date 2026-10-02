import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadCustomers = (s = "") => axiosClient.get("/users/", { params: s ? { search: s } : {} }).then((res) => setCustomers(res.data));
  useEffect(() => { loadCustomers(); }, []);
  useEffect(() => { const t = setTimeout(() => loadCustomers(search), 400); return () => clearTimeout(t); }, [search]);

  const handleToggle = async (id, status) => {
    setUpdatingId(id);
    try { await axiosClient.put(`/users/${id}/status`, { account_status: status === "active" ? "inactive" : "active" }); loadCustomers(search); }
    finally { setUpdatingId(null); }
  };

  return (
    <AdminLayout title="Customers" subtitle="View and manage customer accounts.">
      <input
        value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="border border-charcoal/15 rounded-full px-4 py-2.5 mb-5 w-full max-w-sm outline-none focus:border-tomato bg-white text-sm"
      />
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-charcoal/40 border-b border-charcoal/8">
            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-charcoal/5">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-charcoal/60">{c.email}</td>
                <td className="p-4 text-charcoal/60">{c.phone}</td>
                <td className="p-4 capitalize">{c.account_status}</td>
                <td className="p-4">
                  <button disabled={updatingId === c.id} onClick={() => handleToggle(c.id, c.account_status)}
                    className={`font-medium hover:underline ${c.account_status === "active" ? "text-tomato-dark" : "text-basil-dark"}`}>
                    {c.account_status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default AdminCustomers;