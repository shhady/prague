'use client';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartButton({ setIsCartOpen }) {
  const { getCartCount } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="text-gray-700 hover:text-primary relative"
    >
      <FiShoppingBag className="w-6 h-6" />
      {getCartCount() > 0 && (
        <span className="absolute -top-3 -right-2 bg-gradient-ocean text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {getCartCount()}
        </span>
      )}
    </button>
  );
} 