import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Icon({ path }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const navItems = [
  { to: "/admin", label: "Overview", icon: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" },
  { to: "/admin/foods", label: "Foods", icon: "M7 3v6M5 3v6M9 3v6M5 9a2 2 0 0 0 4 0M18 3c-2 1-3 3-3 6 0 2 1 3 2 3v9M18 3v18" },
  { to: "/admin/categories", label: "Categories", icon: "M4 6h16M4 12h10M4 18h16" },
  { to: "/admin/orders", label: "Orders", icon: "M6 2h12l1 5H5l1-5Zm-1 5h14v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7Z" },
  { to: "/admin/customers", label: "Customers", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21c0-4 4-6 9-6s9 2 9 6" },
];

function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="flex items-center gap-2 text-tomato mb-10 px-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10.5a3.5 3.5 0 0 1 1-6.7A3.5 3.5 0 0 1 12 2a3.5 3.5 0 0 1 4 1.8 3.5 3.5 0 0 1 1 6.7v2.5H7v-2.5Z" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
        <span className="font-display font-semibold text-white text-base leading-tight">Food<br/>Ordering</span>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-tomato text-white" : "hover:bg-white/5 text-white/70"
              }`}
            >
              <Icon path={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => { logout(); navigate("/"); }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80"
      >
        <Icon path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        Log out
      </button>
    </aside>
  );
}

export default AdminSidebar;