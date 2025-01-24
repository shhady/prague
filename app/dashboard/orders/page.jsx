'use client';
import { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useOrders } from '@/app/context/OrderContext';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusText = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  completed: 'مكتمل',
  cancelled: 'ملغي'
};

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { orders, fetchOrders, updatePendingOrdersCount } = useOrders();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order');

      await fetchOrders(); // Refresh orders list
      await updatePendingOrdersCount(); // Update pending count
      
      toast.success('تم تحديث حالة الطلب');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الطلب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العميل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المجموع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerInfo.fullName}</div>
                  <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{order.total} ₪</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                    {statusText[order.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('ar')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'processing')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiTruck className="w-5 h-5" />
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">تفاصيل الطلب</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">معلومات العميل</h3>
                <p>الاسم: {selectedOrder.customerInfo.fullName}</p>
                <p>الهاتف: {selectedOrder.customerInfo.phone}</p>
                <p>العنوان: {selectedOrder.customerInfo.address}</p>
                <p>المدينة: {selectedOrder.customerInfo.city}</p>
                <p>طريقة الدفع: {selectedOrder.paymentMethod === 'cash' ? 'نقداً' : 'بطاقة'}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">المنتجات</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.nameAr || item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.nameAr || item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-600">
                            {item.quantity} × {item.price} ₪
                          </span>
                          <span className="font-medium">
                            {item.quantity * item.price} ₪
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>المجموع</span>
                  <span>{selectedOrder.total} ₪</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">حالة الطلب</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[selectedOrder.status]}`}>
                  {statusText[selectedOrder.status]}
                </span>
              </div>

              {/* Order Actions */}
              <div className="flex justify-end gap-2 mt-6">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'processing');
                        setIsModalOpen(false);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      قبول الطلب
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'cancelled');
                        setIsModalOpen(false);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      إلغاء الطلب
                    </button>
                  </>
                )}
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, 'completed');
                      setIsModalOpen(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    إتمام الطلب
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 