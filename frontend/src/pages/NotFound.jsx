import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col items-center justify-center bg-cream text-center px-6">
      <p className="text-6xl mb-4">🍽️</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Nothing on the menu here</h1>
      <p className="text-charcoal/50 mb-6">This page doesn't exist.</p>
      <Link to="/" className="bg-tomato hover:bg-tomato-dark text-white font-semibold px-6 py-3 rounded-full">Back to home</Link>
    </div>
  );
}
export default NotFound;