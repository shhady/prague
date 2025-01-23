'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiLock } from 'react-icons/fi';

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
        <p className="text-gray-600 mb-8">لا توجد منتجات في سلة التسوق</p>
        <a href="/shop" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          تصفح المنتجات
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
          }`}>1</div>
          <div className="w-16 h-1 mx-2 bg-gray-200"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
          }`}>2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {step === 1 ? (
            <ShippingForm 
              data={shippingData} 
              onChange={setShippingData} 
              onNext={() => setStep(2)} 
            />
          ) : (
            <PaymentForm 
              onBack={() => setStep(1)}
              shippingData={shippingData}
            />
          )}
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary cart={cart} total={cartTotal} />
        </div>
      </div>
    </div>
  );
}

function ShippingForm({ data, onChange, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation here
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">معلومات الشحن</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={data.fullName}
              onChange={e => onChange({ ...data, fullName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رقم الجوال</label>
            <input
              type="tel"
              value={data.phone}
              onChange={e => onChange({ ...data, phone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange({ ...data, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">العنوان</label>
          <textarea
            value={data.address}
            onChange={e => onChange({ ...data, address: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">المدينة</label>
            <input
              type="text"
              value={data.city}
              onChange={e => onChange({ ...data, city: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">الرمز البريدي</label>
            <input
              type="text"
              value={data.postalCode}
              onChange={e => onChange({ ...data, postalCode: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">ملاحظات إضافية</label>
          <textarea
            value={data.notes}
            onChange={e => onChange({ ...data, notes: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          متابعة للدفع
        </button>
      </form>
    </div>
  );
}

function PaymentForm({ onBack, shippingData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">معلومات الدفع</h2>
      {/* Add payment form here */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors"
        >
          رجوع
        </button>
        <button
          className="flex-1 bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <FiLock />
          إتمام الطلب
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ cart, total }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">الكمية: {item.quantity}</p>
              <p className="text-primary font-bold">{item.price} شيكل</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between items-center font-bold">
          <span>المجموع:</span>
          <span>{total.toLocaleString()} شيكل</span>
        </div>
      </div>
    </div>
  );
} 