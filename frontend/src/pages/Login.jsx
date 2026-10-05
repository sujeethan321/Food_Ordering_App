import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-sm">
        <p className="eyebrow text-center">Your seat at the table</p>
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">Welcome back</h2>

        {error && <div role="alert" className="bg-blush/40 text-tomato-dark text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <label htmlFor="email" className="block mb-1.5 text-sm font-medium">Email</label>
        <input id="email" name="email" aria-label="Email" autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-4 outline-none focus:border-tomato" required />

        <label htmlFor="password" className="block mb-1.5 text-sm font-medium">Password</label>
        <input id="password" name="password" aria-label="Password" autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-charcoal/15 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-tomato" required />

        <button disabled={submitting} aria-busy={submitting} type="submit" className="w-full bg-tomato hover:bg-tomato-dark text-white font-semibold py-3 rounded-full transition-colors">{submitting ? "Please wait..." : "Login"}</button>
        <p className="text-sm text-center mt-4 text-charcoal/60">No account? <Link to="/register" className="text-tomato font-medium">Register</Link></p>
      </form>
    </div>
  );
}
export default Login;
