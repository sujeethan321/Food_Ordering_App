import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone || ""); setAddress(user.address || ""); }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axiosClient.put("/auth/me", { name, phone, address });
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-tomato/15 flex items-center justify-center text-tomato-dark font-display font-semibold text-xl">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{user.name}</h1>
            <p className="text-charcoal/50 text-sm">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6">
          {message && <p className="text-sm text-basil-dark mb-4">{message}</p>}
          <label className="block mb-1.5 text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" />
          <label className="block mb-1.5 text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" />
          <label className="block mb-1.5 text-sm font-medium">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-tomato" />
          <button type="submit" className="w-full bg-tomato hover:bg-tomato-dark text-white font-semibold py-3 rounded-full">Save changes</button>
        </form>
      </div>
    </div>
  );
}
export default Profile;