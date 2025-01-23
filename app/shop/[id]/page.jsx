'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import ProductImageGallery from '@/app/components/ProductImageGallery';
import RelatedProducts from '@/app/components/RelatedProducts';
import ProductReviews from '@/app/components/ProductReviews';
import { toast } from 'react-hot-toast';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const [isClient, setIsClient] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError('Failed to load product');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        جاري التحميل...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        جاري التحميل...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="flex gap-4">
          {/* Thumbnails Column */}
          <div className="flex flex-col mt-1 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.nameAr || product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-[400px] h-[400px]">
            <Image
              src={product.images[selectedImage]}
              alt={product.nameAr || product.name}
              fill
              className="object-contain rounded-lg border-2 border-gray-200"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
            <div className='flex justify-between items-center pl-4 py-2'>
            <h1 className="text-3xl font-bold mb-4">{product.nameAr}</h1>
          {/* <p className="text-gray-600 mb-4">{product.name}</p> */}
          <p className="text-2xl font-bold  mb-6">
            {product.price} شيكل
          </p>
            </div>
          
           {/* Category */}
           {product.category && (
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                {product.category.nameAr}
              </p>
            </div>
          )} 
          <div className="prose max-w-none my-8">
            <h3 className="text-lg font-semibold mb-2">الوصف</h3>
            <p className="text-gray-600">{product.descriptionAr}</p>
            {/* <p className="text-gray-500 mt-2">{product.description}</p> */}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `متوفر: ${product.stock} قطعة` : 'غير متوفر حالياً'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                addToCart({
                  id: product._id,
                  name: product.name,
                  nameAr: product.nameAr,
                  price: product.price,
                  image: product.images[0],
                  quantity: 1
                });
                toast.success('تمت الإضافة إلى السلة');
              }}
              disabled={product.stock <= 0}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                product.stock > 0 
                  ? 'bg-gradient-ocean text-white hover:bg-primary-dark' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart />
              {product.stock > 0 ? 'أضف للسلة' : 'نفذت الكمية'}
            </button>
            <button
              onClick={() => {
                if (isInWishlist(product._id)) {
                  removeFromWishlist(product._id);
                  toast.success('تمت الإزالة من المفضلة');
                } else {
                  addToWishlist(product);
                  toast.success('تمت الإضافة إلى المفضلة');
                }
              }}
              className={`p-3 rounded-lg border ${
                isInWishlist(product._id)
                  ? 'text-black border-black bg-black'
                  : 'text-gray-400 border-gray-300'
              } hover:text-black hover:border-black transition-colors`}
            >
              <FiHeart className={`text-xl ${isInWishlist(product._id) ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>

         
        </div>
      </div>
      <RelatedProducts 
        categoryId={product.category?._id?.toString()}
        currentProductId={product._id} 
      />
      {/* <ProductReviews productId={product._id} /> */}
    </div>
  );
} 