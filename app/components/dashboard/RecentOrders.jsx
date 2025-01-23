'use client';
import { FiPackage, FiClock } from 'react-icons/fi';
import Link from 'next/link';

const recentOrders = [
  {
    id: 'ORD123456',
    customer: 'أحمد محمد',
    amount: 1200,
    status: 'processing',
    date: '2024-03-20T10:30:00',
    items: 2
  },
  {
    id: 'ORD123455',
    customer: 'سارة أحمد',
    amount: 850,
    status: 'delivered',
    date: '2024-03-20T09:15:00',
    items: 1
  },
  {
    id: 'ORD123454',
    customer: 'محمد علي',
    amount: 2400,
    status: 'shipped',
    date: '2024-03-20T08:45:00',
    items: 3
  }
];

export default function RecentOrders() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'تم التوصيل';
      case 'processing':
        return 'قيد التجهيز';
      case 'shipped':
        return 'تم الشحن';
      default:
        return 'قيد المعالجة';
    }
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">#{order.id}</h3>
              <p className="text-gray-600">{order.customer}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <FiPackage />
                <span>{order.items} منتجات</span>
                <span className="mx-2">•</span>
                <FiClock />
                <span>{getTimeAgo(order.date)}</span>
              </div>
            </div>
            <div className="text-left">
              <div className="font-bold text-primary mb-2">
                {order.amount.toLocaleString()} شيكل
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 