import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Admin pages provide their own sidebar; public pages still need navigation.
  if (isAdmin && (pathname === "/admin" || pathname.startsWith("/admin/"))) return null;

  return (
    <nav aria-label="Main navigation" className="site-nav page-width">
      <Link to="/" className="flex items-center gap-2 text-tomato">
        <span className="brand">Food<span>Ordering.</span></span>
      </Link>

      <div className="flex order-last w-full md:order-0 md:w-auto items-center gap-8 text-sm font-medium text-charcoal/70">
        <Link to="/" aria-current={pathname === "/" ? "page" : undefined} className="hover:text-tomato">Home</Link>
        <Link to="/menu" aria-current={pathname === "/menu" ? "page" : undefined} className="hover:text-tomato">Menu</Link>
        {isAdmin && <Link to="/admin" className="hover:text-tomato">Dashboard</Link>}
        {isAuthenticated && <Link to="/my-orders" className="hover:text-tomato">My Orders</Link>}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative cart-link" aria-label={`Cart, ${itemCount} items`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-charcoal">
            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="20" r="1.3" fill="currentColor"/>
            <circle cx="17" cy="20" r="1.3" fill="currentColor"/>
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-tomato text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" aria-label="Your profile" className="w-9 h-9 rounded-full bg-tomato/15 border border-tomato/30 flex items-center justify-center text-tomato-dark font-display font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </Link>
            <button onClick={handleLogout} className="text-sm font-medium text-charcoal/50 hover:text-charcoal">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-charcoal/70 hover:text-charcoal">Login</Link>
            <Link to="/register" className="bg-tomato hover:bg-tomato-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
