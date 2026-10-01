import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ food_id, name, price, quantity }]

  const addToCart = (food) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food_id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food_id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food_id: food.id, name: food.name, price: Number(food.price), quantity: 1 }];
    });
  };

  const increaseQuantity = (foodId) => {
    setItems((prev) =>
      prev.map((item) => (item.food_id === foodId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (foodId) => {
    setItems((prev) =>
      prev
        .map((item) => (item.food_id === foodId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => prev.filter((item) => item.food_id !== foodId));
  };

  const clearCart = () => setItems([]);

  const subtotal = (item) => item.price * item.quantity;
  const total = items.reduce((sum, item) => sum + subtotal(item), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart,
    subtotal, total, itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}