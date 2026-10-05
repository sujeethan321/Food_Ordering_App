import { useState } from "react";
import placeholder from "../assets/food-placeholder.svg";
import { useCart } from "../context/CartContext";
const foodFallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";
export function FoodImage({ src, name, className = "" }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = src || foodFallback;
  const failed = failedSource === source;
  return <img src={failed ? placeholder : source} alt={failed || !src ? "Item photo unavailable" : name} loading="lazy" className={className} onError={() => setFailedSource(source)} />;
}
export default function FoodCard({ food }) {
 const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();
 const qty = items.find(i => i.food_id === food.id)?.quantity || 0;
 return <article className="food-card"><div className="food-photo"><FoodImage src={food.image} name={food.name} />{!food.is_available && <span className="availability">Currently unavailable</span>}</div><div className="food-content"><h3>{food.name}</h3><p>{food.description || "A little something to make your day delicious."}</p><div className="food-bottom"><strong>Rs. {Number(food.price).toLocaleString('en-LK', {minimumFractionDigits: 2})}</strong>{food.is_available && (qty ? <div className="quantity"><button aria-label={`Remove one ${food.name}`} onClick={() => decreaseQuantity(food.id)}>-</button><span aria-live="polite">{qty}</span><button aria-label={`Add one ${food.name}`} onClick={() => increaseQuantity(food.id)}>+</button></div> : <button className="add-button" onClick={() => addToCart(food)} aria-label={`Add ${food.name} to cart`}>Add <span aria-hidden="true">+</span></button>)}</div></div></article>;
}
