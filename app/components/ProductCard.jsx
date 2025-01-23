'use client';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product, shade = 'light' }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoaded } = useWishlist();

  if (!product) {
    console.error('No product data provided to ProductCard');
    return null;
  }

  const { _id, name, nameAr, price, images } = product;
  const image = images?.[0] || null;
  
  if (!image) {
    return null;
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(_id)) {
      removeFromWishlist(_id);
      toast.success('تمت الإزالة من المفضلة');
    } else {
      addToWishlist(product);
      toast.success('تمت الإضافة إلى المفضلة');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      name,
      nameAr,
      price,
      image,
    });
    toast.success('تمت الإضافة إلى السلة');
  };

  return (
    <div className={`relative group ${
      shade === 'light' ? 'bg-white' : 
      shade === 'medium' ? 'bg-white' : 
      shade === 'dark' ? 'bg-white' : 
      'bg-white'
    } border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`} role="button" tabIndex={0}>
      {/* Wishlist button */}
      {isLoaded && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleWishlistToggle}
            className="p-2 rounded-full bg-white shadow-md hover:scale-110 hover:shadow-lg transition-all"
          >
            {isInWishlist(_id) ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FiHeart className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      )}
      
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={handleAddToCart}
          className="p-2 rounded-full bg-white shadow-md hover:scale-110 hover:shadow-lg transition-all"
        >
          <FiShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 p-4">
        <Image
          src={image}
          alt={nameAr || name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
          sizes="(max-width: 768px) 25vw, 200px"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-2 flex justify-between items-center">
        <h3 className="font-medium text-sm ">
          {nameAr || name}
        </h3>
        <p className="text-black font-bold text-lg">
          {price} ₪
        </p>
      </div>
    </div>
  );
} 