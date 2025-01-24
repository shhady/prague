'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Dynamically import SalesChart
const DynamicSalesChart = dynamic(() => import('@/app/components/SalesChart'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">جاري تحميل الرسم البياني...</div>
});

export default function SalesReportPage() {
  const [mounted, setMounted] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchStatistics();
    }
  }, [mounted, dateRange]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/statistics?start=${dateRange.start}&end=${dateRange.end}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatistics(data);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الإحصائيات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch(`/api/statistics/export?start=${dateRange.start}&end=${dateRange.end}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${dateRange.start}-to-${dateRange.end}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('حدث خطأ أثناء تصدير البيانات');
      console.error(error);
    }
  };

  if (!mounted || loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  if (!statistics) {
    return <div className="p-8 text-center">لا توجد بيانات متاحة</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">تقرير المبيعات</h1>
        <button
          type="button"
          key="export-button"
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FiDownload />
          تصدير إلى Excel
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="mb-8 flex gap-4 items-center">
        <div>
          <label className="block text-sm mb-1">من</label>
          <input
            type="date"
            key="start-date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">إلى</label>
          <input
            type="date"
            key="end-date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">إجمالي المبيعات</h3>
          <p className="text-3xl font-bold">{statistics?.totalRevenue || 0} ₪</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">عدد الطلبات</h3>
          <p className="text-3xl font-bold">
            {statistics?.last7Days?.reduce((acc, day) => acc + day.count, 0) || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">متوسط قيمة الطلب</h3>
          <p className="text-3xl font-bold">
            {statistics?.totalRevenue && statistics?.last7Days?.length > 0
              ? Math.round(
                  statistics.totalRevenue /
                    statistics.last7Days.reduce((acc, day) => acc + day.count, 0)
                )
              : 0}{' '}
            ₪
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      {statistics?.last7Days && <DynamicSalesChart data={statistics.last7Days} />}

      {/* Top Products */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">أفضل المنتجات مبيعاً</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المنتج</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المبيعات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإيرادات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statistics?.topProducts?.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.nameAr}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sales * product.price} ₪</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
