import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage("");
    try {
      await axiosClient.put("/auth/me", { name, phone, address });
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Update failed");
    } finally { setSubmitting(false); }
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
          {message && <p role="status" className="text-sm text-basil-dark mb-4">{message}</p>}
          <label htmlFor="name" className="block mb-1.5 text-sm font-medium">Name</label>
          <input id="name" name="name" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" />
          <label htmlFor="phone" className="block mb-1.5 text-sm font-medium">Phone</label>
          <input id="phone" name="phone" aria-label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" />
          <label htmlFor="address" className="block mb-1.5 text-sm font-medium">Address</label>
          <input id="address" name="address" aria-label="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-tomato" />
          <button disabled={submitting} aria-busy={submitting} type="submit" className="w-full bg-tomato hover:bg-tomato-dark text-white font-semibold py-3 rounded-full">{submitting ? "Please wait..." : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
}
export default Profile;