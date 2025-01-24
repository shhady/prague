'use client';
import { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiRefreshCcw, FiTrendingUp, FiSearch, FiDownload, FiDollarSign } from 'react-icons/fi';
import SalesChart from '../components/dashboard/SalesChart';
import StatCard from '../components/dashboard/StatCard';
import TopCategories from '../components/dashboard/TopCategories';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopProducts from '../components/dashboard/TopProducts';
import Link from 'next/link';
import CustomerStats from '../components/dashboard/CustomerStats';
import { exportToExcel, exportToPDF, prepareDataForExport } from '../utils/exportData';
import AdvancedAnalytics from '../components/dashboard/AdvancedAnalytics';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import { useRouter } from 'next/navigation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('Last 14 Days');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type, format) => {
    if (!analytics) return;

    const data = prepareDataForExport(analytics, type);
    const filename = `${type}-report-${new Date().toISOString().split('T')[0]}`;

    if (format === 'excel') {
      exportToExcel(data, filename);
    } else if (format === 'pdf') {
      exportToPDF(data, filename);
    }
  };

  // Sample data - replace with actual data from your backend
  const stats = {
    totalSales: "15,200",
    totalOrders: "124",
    totalCustomers: "89",
    averageOrderValue: "380"
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'المبيعات حسب الفترة',
      },
    },
  };

  const chartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المبيعات',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const handleEditProduct = (product) => {
    router.push(`/dashboard/products/${product._id}/edit`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add LowStockAlert at the top */}
      <LowStockAlert />
      
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">مرحباً بعودتك</h1>
          <p className="text-gray-600">إحصائيات متجرك لهذا اليوم</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث..."
              className="w-64 p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              4
            </span>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FiRefreshCcw className="text-xl" />
            </button>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="year">آخر سنة</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي المبيعات"
          value={`${stats.totalSales} شيكل`}
          icon={FiDollarSign}
        />
        <StatCard
          title="عدد الطلبات"
          value={stats.totalOrders}
          icon={FiShoppingBag}
        />
        <StatCard
          title="عدد العملاء"
          value={stats.totalCustomers}
          icon={FiUsers}
        />
        <StatCard
          title="متوسط قيمة الطلب"
          value={`${stats.averageOrderValue} شيكل`}
          icon={FiTrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar options={chartOptions} data={chartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">أحدث الطلبات</h2>
            <Link href="/dashboard/orders" className="text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <RecentOrders />
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">المنتجات الأكثر مبيعاً</h2>
            <Link href="/dashboard/products" className="text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <TopProducts />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">إحصائيات العملاء</h2>
        <CustomerStats data={analytics.customerStats} />
      </div>

      {/* Advanced Analytics */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">تحليلات متقدمة</h2>
          <button
            onClick={() => handleExport('analytics', 'excel')}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <FiDownload />
            تصدير التقرير
          </button>
        </div>
        <AdvancedAnalytics data={analytics} />
      </div>

      {/* Export Buttons */}
      <div className="mt-8 flex gap-4">
        <div className="dropdown relative">
          <button className="btn bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FiDownload />
            تصدير التقارير
          </button>
          <div className="dropdown-menu absolute hidden group-hover:block">
            <button onClick={() => handleExport('sales', 'excel')}>
              تصدير المبيعات (Excel)
            </button>
            <button onClick={() => handleExport('sales', 'pdf')}>
              تصدير المبيعات (PDF)
            </button>
            {/* Add more export options */}
          </div>
        </div>
      </div>
    </div>
  );
} 