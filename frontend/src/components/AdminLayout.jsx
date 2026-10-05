import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-workspace">
        <header className="flex justify-between items-center px-8 py-6">
          <div>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="text-charcoal/50 text-sm mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-tomato/15 flex items-center justify-center text-tomato-dark font-display font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="text-sm font-medium">{user?.name || "Admin"}</span>
          </div>
        </header>
        <main className="px-8 pb-10">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;