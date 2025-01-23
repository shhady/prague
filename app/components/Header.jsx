'use client';
import { useState } from 'react';
import { FiSearch, FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import CartButton from './CartButton';
import { useWishlist } from '../context/WishlistContext';
import SearchOverlay from './SearchOverlay';
import MenuOverlay from './MenuOverlay';
import Image from 'next/image';

export default function Header({ setIsCartOpen }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getWishlistCount, wishlist, isLoaded } = useWishlist();

  const WishlistButton = () => {
    return (
      <Link href="/wishlist" className="relative py-2">
        <FiHeart className="w-6 h-6" />
        {isLoaded && wishlist.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-gradient-ocean text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="bg-white border-b flex justify-center items-center px-2" dir="ltr">
        <div className="container">
          <div className="flex justify-between items-center h-24">
            {/* Left Section */}
            <div className="flex items-center gap-4 space-x-reverse">
              <CartButton setIsCartOpen={setIsCartOpen} />
              <WishlistButton />
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <Image
              width={200}
              height={200} 
                src="/logo-prague.png" 
                alt="Crystal Shop" 
                className="h-16"
              />
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4 space-x-reverse">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-primary"
              >
                <FiSearch className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-700 hover:text-primary"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
} 