'use client';
import { useState, useEffect } from 'react';
import { useUserDetails } from '../context/UserContext';
import { toast } from 'react-hot-toast';

export default function CheckoutForm({ onSubmit, isSubmitting }) {
  const { userDetails, isSignedIn } = useUserDetails();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (userDetails?.lastOrderDetails) {
      setFormData({
        fullName: userDetails.lastOrderDetails.fullName || '',
        email: userDetails.email || '',
        phone: userDetails.lastOrderDetails.phone || '',
        address: userDetails.lastOrderDetails.address || '',
        city: userDetails.lastOrderDetails.city || ''
      });
    } else if (userDetails?.email) {
      setFormData(prev => ({
        ...prev,
        email: userDetails.email
      }));
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    try {
      await onSubmit({
        customerInfo: {
          ...formData,
          email: formData.email.toLowerCase().trim()
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('حدث خطأ أثناء إتمام الطلب');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          الاسم الكامل *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          البريد الإلكتروني *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSignedIn}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500 ${
            isSignedIn ? 'bg-gray-100' : ''
          }`}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          رقم الهاتف *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          العنوان *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          المدينة *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-ocean hover:bg-gradient-ocean-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'جارٍ إتمام الطلب...' : 'إتمام الطلب'}
      </button>
    </form>
  );
} 