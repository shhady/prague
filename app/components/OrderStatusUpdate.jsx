'use client';
import { useState } from 'react';
import { FiPackage, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function OrderStatusUpdate({ order, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedOrder = await response.json();
      onStatusChange(updatedOrder); // Callback to update parent state
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('فشل في تحديث حالة الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2">
      {order.status === 'pending' && (
        <>
          <button
            onClick={() => handleStatusChange('processing')}
            disabled={isUpdating}
            className="flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            <FiPackage className="mr-1" />
            بدء المعالجة
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            disabled={isUpdating}
            className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
          >
            <FiX className="mr-1" />
            إلغاء
          </button>
        </>
      )}
      {order.status === 'processing' && (
        <button
          onClick={() => handleStatusChange('completed')}
          disabled={isUpdating}
          className="flex items-center justify-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          <FiCheckCircle className="mr-1" />
          اكتمال
        </button>
      )}
    </div>
  );
} 