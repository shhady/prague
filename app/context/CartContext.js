'use client';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Ensure product has stock information
    if (!product || typeof product.stock === 'undefined') {
      console.error('Invalid product data:', product);
      return;
    }

    const stock = Number(product.stock);
    if (isNaN(stock) || stock < 0) {
      console.error('Invalid stock value:', stock);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity >= stock) {
          toast.error(`عذراً، الكمية المتوفرة ${stock} فقط`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item with all necessary data
      return [...prevItems, {
        id: product._id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        stock: stock
      }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (!item) return prevItems;

      const stock = Number(item.stock);
      if (isNaN(stock)) {
        console.error('Invalid stock value:', item);
        return prevItems;
      }

      if (newQuantity > stock) {
        toast.error(`عذراً، الكمية المتوفرة ${stock} فقط`);
        return prevItems;
      }

      return prevItems.map(cartItem =>
        cartItem.id === productId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 