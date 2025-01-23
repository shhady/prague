'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { FiLock } from 'react-icons/fi';

export default function Checkout() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const { cartItems = [], getCartTotal = () => 0 } = useCart() || {};
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client-side code is ready
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Check for empty cart after client-side code is ready
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
        <button
          onClick={() => router.push('/shop')}
          className="text-primary hover:text-primary-dark"
        >
          العودة للتسوق
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Checkout steps */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">إتمام الطلب</h1>
          <div className="flex items-center">
            <div className={`flex-1 text-center ${step === 1 ? 'text-primary' : 'text-gray-400'}`}>
              معلومات الشحن
            </div>
            <div className={`flex-1 text-center ${step === 2 ? 'text-primary' : 'text-gray-400'}`}>
              الدفع
            </div>
          </div>
        </div>

        {/* Checkout form */}
        {step === 1 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Add your shipping form here */}
            <button
              onClick={() => setStep(2)}
              className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark"
            >
              متابعة للدفع
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Add your payment form here */}
            <button
              className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2"
            >
              <FiLock />
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 