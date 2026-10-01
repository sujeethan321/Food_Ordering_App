import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-orange-600">FoodHub</Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/menu" className="text-gray-700 hover:text-orange-600">Menu</Link>

        {!isAdmin && (
          <Link to="/cart" className="text-gray-700 hover:text-orange-600 relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        )}

        {isAuthenticated && !isAdmin && (
          <Link to="/my-orders" className="text-gray-700 hover:text-orange-600">My Orders</Link>
        )}

        {isAdmin && (
          <>
            <Link to="/admin" className="text-gray-700 hover:text-orange-600">Dashboard</Link>
            <Link to="/admin/foods" className="text-gray-700 hover:text-orange-600">Foods</Link>
            <Link to="/admin/categories" className="text-gray-700 hover:text-orange-600">Categories</Link>
            <Link to="/admin/orders" className="text-gray-700 hover:text-orange-600">Orders</Link>
            <Link to="/admin/customers" className="text-gray-700 hover:text-orange-600">Customers</Link>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-orange-600">Login</Link>
            <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Register</Link>
          </>
        )}

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Hi, {user?.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;