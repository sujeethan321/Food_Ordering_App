import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await register(name, email, phone, address, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center bg-cream px-6 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-sm">
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">Create an account</h2>
        {error && <div role="alert" className="bg-blush/40 text-tomato-dark text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <label htmlFor="full-name" className="block mb-1.5 text-sm font-medium">Full Name</label>
        <input id="full-name" name="full-name" aria-label="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" required />
        <label htmlFor="email" className="block mb-1.5 text-sm font-medium">Email</label>
        <input id="email" name="email" aria-label="Email" autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" required />
        <label htmlFor="phone" className="block mb-1.5 text-sm font-medium">Phone</label>
        <input id="phone" name="phone" aria-label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" required />
        <label htmlFor="address" className="block mb-1.5 text-sm font-medium">Address</label>
        <input id="address" name="address" aria-label="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-tomato" />
        <label htmlFor="password" className="block mb-1.5 text-sm font-medium">Password</label>
        <input id="password" name="password" aria-label="Password" autoComplete="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-tomato" required />

        <button disabled={submitting} aria-busy={submitting} type="submit" className="w-full bg-tomato hover:bg-tomato-dark text-white font-semibold py-3 rounded-full transition-colors">{submitting ? "Please wait..." : "Register"}</button>
        <p className="text-sm text-center mt-4 text-charcoal/60">Already have an account? <Link to="/login" className="text-tomato font-medium">Login</Link></p>
      </form>
    </div>
  );
}
export default Register;