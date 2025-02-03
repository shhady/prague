'use client';
import { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useOrders } from '@/app/context/OrderContext';
import Link from 'next/link';
import OrderStatusUpdate from '@/app/components/OrderStatusUpdate';

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
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updatePendingOrdersCount } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    if (selectedOrder && selectedOrder._id === updatedOrder._id) {
      setSelectedOrder(updatedOrder);
    }
    // Refresh pending orders count
    updatePendingOrdersCount();
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.includes(searchTerm) ||
      order._id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  if (isLoading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="بحث بإسم العميل أو رقم الطلب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select 
          className="p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="processing">قيد المعالجة</option>
          <option value="completed">مكتمل</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      {/* Orders Table/Cards */}
      <div className="hidden lg:block"> {/* Desktop Table */}
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
              {filteredOrders.map((order) => (
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
                    <OrderStatusUpdate 
                      order={order} 
                      onStatusChange={handleOrderUpdate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden"> {/* Mobile Cards */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold">#{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ar')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                  {statusText[order.status]}
                </span>
              </div>
              
              <div className="space-y-2">
                <p>العميل: {order.customerInfo.fullName}</p>
                <p>المجموع: {order.total} شيكل</p>
              </div>

              {/* Status Control Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <OrderStatusUpdate 
                  order={order} 
                  onStatusChange={handleOrderUpdate}
                />
              </div>

              <Link 
                href={`/dashboard/orders/${order._id}`}
                className="mt-4 text-primary block text-center text-sm"
              >
                عرض التفاصيل
              </Link>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">لا توجد طلبات تطابق البحث</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {/* ... pagination ... */}
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
                <OrderStatusUpdate 
                  order={selectedOrder} 
                  onStatusChange={handleOrderUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 