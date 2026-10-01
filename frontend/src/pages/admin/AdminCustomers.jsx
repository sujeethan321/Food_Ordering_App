import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadCustomers = (searchTerm = "") => {
    const params = searchTerm ? { search: searchTerm } : {};
    axiosClient
      .get("/users/", { params })
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load customers"));
  };

  useEffect(() => { loadCustomers(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadCustomers(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setError("");
    setUpdatingId(customerId);
    try {
      await axiosClient.put(`/users/${customerId}/status`, { account_status: newStatus });
      loadCustomers(search);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="border rounded px-3 py-2 mb-4 w-full max-w-sm"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3 capitalize">{c.account_status}</td>
                <td className="p-3">
                  <button
                    disabled={updatingId === c.id}
                    onClick={() => handleToggleStatus(c.id, c.account_status)}
                    className={`font-medium hover:underline disabled:opacity-50 ${
                      c.account_status === "active" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {c.account_status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="p-4 text-center text-gray-400">No customers found.</p>}
      </div>
    </div>
  );
}

export default AdminCustomers;