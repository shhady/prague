'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  FiPackage, 
  FiClock, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiCheck,
  FiX,
  FiTruck,
  FiCheckCircle
} from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import OrderStatusUpdate from '@/app/components/OrderStatusUpdate';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تحميل تفاصيل الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Get the updated order data
      const updatedOrder = await response.json();
      setOrder(updatedOrder); // Update local state with new order data
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('فشل في تحديث حالة الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
        case 'delivered':
            return 'تم التوصيل';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'قيد المعالجة';
    }
  };

  const getTimelineSteps = () => {
    const defaultSteps = [
      { status: 'pending', label: 'تم استلام الطلب', icon: FiPackage },
      { status: 'processing', label: 'قيد المعالجة', icon: FiClock },
      { status: 'completed', label: 'تم اكتمال الطلب', icon: FiCheckCircle },
    ];

    if (order.status === 'cancelled') {
      return [
        { status: 'pending', label: 'تم استلام الطلب', icon: FiPackage },
        { status: 'cancelled', label: 'تم إلغاء الطلب', icon: FiX },
      ];
    }

    return defaultSteps;
  };

  // First, let's define the order of statuses
  const statusOrder = ['pending', 'processing', 'completed'];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-500">لم يتم العثور على الطلب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">تفاصيل الطلب #{order._id.slice(-6)}</h1>
            <p className="text-gray-600">
              <FiClock className="inline-block mr-1" />
              {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-2" />
              <span>{order.customerInfo.fullName}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-gray-400 mr-2" />
              <span>{order.customerInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-400 mr-2" />
              <span>{order.customerInfo.email}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="text-gray-400 mr-2" />
              <span>{order.customerInfo.address}, {order.customerInfo.city}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">حالة الطلب</h2>
          <div className="relative">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200"></div>
            <div className=" relative lg:flex lg:flex-row lg:justify-between lg:items-center flex flex-col gap-2 justify-start items-start">
              {getTimelineSteps().map((step, index) => {
                // Check if this step should be active based on current order status
                const currentStatusIndex = statusOrder.indexOf(order.status);
                const stepIndex = statusOrder.indexOf(step.status);
                const isActive = stepIndex <= currentStatusIndex && order.status !== 'cancelled';
                
                const timelineEntry = order.timeline?.find(t => t.status === step.status);
                
                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <step.icon className="text-2xl" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isActive ? '' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      {timelineEntry && (
                        <p className="text-sm text-gray-500">
                          {new Date(timelineEntry.date).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price} شيكل
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold">{(item.quantity * item.price).toLocaleString()} شيكل</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2> */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* <div className="flex justify-between mb-2">
              <span>المجموع الفرعي</span>
              <span>{order.total.toLocaleString()} شيكل</span>
            </div> */}
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي</span>
              <span>{order.total.toLocaleString()} شيكل</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4">
          <OrderStatusUpdate 
            order={order} 
            onStatusChange={(updatedOrder) => {
              setOrder(updatedOrder);
            }} 
          />
        </div>
      </div>
    </div>
  );
} 