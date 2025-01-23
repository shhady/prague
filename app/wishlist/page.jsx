'use client';
import { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images?.[0],
    });
    toast.success('تمت الإضافة إلى السلة');
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">المفضلة</h1>
        <div className="text-center py-8">جاري التحميل...</div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">المفضلة</h1>
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد منتجات في المفضلة</p>
          <Link 
            href="/shop" 
            className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 mx-4">المفضلة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col items-center justify-center"
          >
            <Link href={`/shop/${product._id}`} className=" aspect-square">
              {product.images?.[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.nameAr || product.name}
                  width={200}
                  height={200}
                  className="object-contain w-[250px] h-[200px]"
                //   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              )}
            </Link>
            
            <div className="py-2 px-6 w-full">
              <Link href={`/shop/${product._id}`} className='flex justify-between items-center'>
                <h3 className="font-medium text-lg mb-2 hover:text-primary">
                  {product.nameAr || product.name}
                </h3>
                <p className="text-black font-bold text-lg">{product.price} ₪</p>
              </Link>
              
              <div className="flex justify-between items-center mt-4 w-full">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center gap-2 bg-gradient-ocean text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                >
                  <FiShoppingCart />
                  <span className='text-white'>أضف للسلة</span>
                </button>
                
                <button
                  onClick={() => {
                    removeFromWishlist(product._id);
                    toast.success('تمت الإزالة من المفضلة');
                  }}
                  className=" text-gray-300 hover:text-black transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 