'use client';
import { FiUsers, FiRepeat, FiDollarSign, FiPercent } from 'react-icons/fi';

export default function CustomerStats({ data }) {
  const stats = [
    {
      title: 'عملاء جدد',
      value: data.newCustomers,
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'عملاء عائدون',
      value: data.returningCustomers,
      icon: FiRepeat,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: `${data.averageOrderValue} شيكل`,
      icon: FiDollarSign,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'معدل الاحتفاظ',
      value: `${data.customerRetentionRate}%`,
      icon: FiPercent,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 