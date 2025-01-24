'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const statusMap = {
  pending: { text: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800' },
  completed: { text: 'مكتمل', color: 'bg-green-100 text-green-800' },
  cancelled: { text: 'ملغي', color: 'bg-red-100 text-red-800' }
};

export default function OrderConfirmationPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('حدث خطأ أثناء تحميل الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري التحميل...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">لم يتم العثور على الطلب</p>
        <Link href="/" className="text-primary hover:underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const status = statusMap[order.status] || statusMap.pending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">تأكيد الطلب</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
              {status.text}
            </span>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <h2 className="font-semibold mb-2">معلومات العميل</h2>
            <p>الاسم: {order.customerInfo.fullName}</p>
            <p>الهاتف: {order.customerInfo.phone}</p>
            <p>العنوان: {order.customerInfo.address}</p>
            <p>المدينة: {order.customerInfo.city}</p>
            <p>طريقة الدفع: {order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-4">المنتجات</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.nameAr || item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.nameAr || item.name}</h3>
                    <p className="text-gray-600">
                      {item.price} شيكل × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{item.price * item.quantity} شيكل</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>المجموع</span>
              <span>{order.total} شيكل</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-gradient-ocean text-white px-6 py-2 rounded-md hover:opacity-90"
            >
              العودة للتسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 