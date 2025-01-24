'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

export default function CustomersPage() {
  const { user } = useUser();
  const [customers, setCustomers] = useState({ users: [], visitors: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'registered', 'visitors'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, visitorsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/visitors')
      ]);

      const [usersData, visitorsData] = await Promise.all([
        usersRes.json(),
        visitorsRes.json()
      ]);

      setCustomers({
        users: usersData,
        visitors: visitorsData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCustomers = () => {
    switch (activeTab) {
      case 'registered':
        return customers.users;
      case 'visitors':
        return customers.visitors;
      default:
        return [...customers.users, ...customers.visitors];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">العملاء</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-4 ${
            activeTab === 'all'
              ? 'border-b-2 border-ocean-500 text-ocean-600'
              : 'text-gray-500'
          }`}
        >
          جميع العملاء
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`pb-2 px-4 ${
            activeTab === 'registered'
              ? 'border-b-2 border-ocean-500 text-ocean-600'
              : 'text-gray-500'
          }`}
        >
          المستخدمون المسجلون
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`pb-2 px-4 ${
            activeTab === 'visitors'
              ? 'border-b-2 border-ocean-500 text-ocean-600'
              : 'text-gray-500'
          }`}
        >
          الزوار
        </button>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الهاتف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العنوان
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المدينة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عدد الطلبات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getFilteredCustomers().map((customer, index) => (
              <tr key={customer._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.fullName || customer.lastOrderDetails?.fullName || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.phone || customer.lastOrderDetails?.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.address || customer.lastOrderDetails?.address || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.city || customer.lastOrderDetails?.city || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer?.orders?.length || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {getFilteredCustomers().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا يوجد عملاء في هذه الفئة
        </div>
      )}
    </div>
  );
} 