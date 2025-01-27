'use client';
import { useState, useEffect } from 'react';
import { FiDownload, FiFilter } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesPage() {
  const [salesData, setSalesData] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [chartType, setChartType] = useState('line'); // line, bar

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const processOrdersData = (orders = [], range) => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 12
    };

    let dateFormat;
    let groupingFunction;

    switch (range) {
      case 'week':
        dateFormat = (date) => date.toLocaleDateString('ar-EG', { weekday: 'long' });
        groupingFunction = (date) => {
          // Get ISO string for consistent date comparison
          return date.toISOString().split('T')[0];
        };
        break;
      case 'month':
        dateFormat = (date) => date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
        groupingFunction = (date) => {
          return date.toISOString().split('T')[0];
        };
        break;
      case 'year':
        dateFormat = (date) => date.toLocaleDateString('ar-EG', { month: 'long' });
        groupingFunction = (date) => {
          return date.getMonth() + '-' + date.getFullYear();
        };
        break;
    }

    // Initialize data structure with dates in correct order
    const salesByPeriod = new Map();
    const labels = [];

    // Set up periods with correct date order
    for (let i = periods[range] - 1; i >= 0; i--) {
      const date = new Date(now);
      if (range === 'year') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      const key = groupingFunction(date);
      const label = dateFormat(date);
      salesByPeriod.set(key, { label, orders: 0, sales: 0 });
      labels.push(label);
    }

    // Process orders
    const completedOrders = orders.filter(order => order.status !== 'cancelled');
    completedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const key = groupingFunction(orderDate);
      if (salesByPeriod.has(key)) {
        const data = salesByPeriod.get(key);
        data.orders++;
        data.sales += order.total;
        salesByPeriod.set(key, data);
      }
    });

    // Convert to arrays for chart
    const salesData = [];
    const ordersData = [];
    salesByPeriod.forEach(({ orders, sales }) => {
      ordersData.push(orders);
      salesData.push(sales);
    });

    return {
      labels,
      datasets: [
        {
          label: 'المبيعات (شيكل)',
          data: salesData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'عدد الطلبات',
          data: ordersData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders?getAllOrders=true');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      const orders = data.orders || [];
      const completedOrders = orders.filter(order => order.status !== 'cancelled');
      
      // Calculate basic stats
      const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email));
      
      setStats({
        totalSales: totalSales.toFixed(0),
        totalOrders: completedOrders.length,
        totalCustomers: uniqueCustomers.size,
        averageOrderValue: completedOrders.length ? (totalSales / completedOrders.length).toFixed(0) : 0
      });

      // Process top products
      const productSales = {};
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              sales: 0,
              revenue: 0,
              price: item.price
            };
          }
          productSales[item.id].sales += item.quantity;
          productSales[item.id].revenue += item.quantity * item.price;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      setTopProducts(topProducts);

      // Process chart data
      const chartData = processOrdersData(orders, timeRange);
      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'تحليل المبيعات',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-base lg:text-lg font-semibold mb-2">إجمالي المبيعات</h3>
          <p className="text-2xl lg:text-3xl font-bold">{Number(stats.totalSales).toLocaleString()} ₪</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-base lg:text-lg font-semibold mb-2">عدد الطلبات</h3>
          <p className="text-2xl lg:text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1">
          <h3 className="text-base lg:text-lg font-semibold mb-2">متوسط قيمة الطلب</h3>
          <p className="text-2xl lg:text-3xl font-bold">{Number(stats.averageOrderValue).toLocaleString()} ₪</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
          >
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="year">آخر سنة</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
          >
            <option value="line">رسم بياني خطي</option>
            <option value="bar">رسم بياني شريطي</option>
          </select>
        </div>
        <button
          onClick={() => {
            // Prepare data for export
            const exportData = {
              stats: {
                totalSales: stats.totalSales,
                totalOrders: stats.totalOrders,
                averageOrderValue: stats.averageOrderValue
              },
              topProducts: topProducts.map(product => ({
                name: product.name,
                sales: product.sales,
                revenue: product.revenue
              }))
            };

            // Create CSV content
            const csvContent = [
              // Headers
              ['Statistics'],
              ['Total Sales', `₪${stats.totalSales}`],
              ['Total Orders', stats.totalOrders],
              ['Average Order Value', `₪${stats.averageOrderValue}`],
              [''], // Empty row for spacing
              ['Top Products'],
              ['Product', 'Sales', 'Revenue'],
              ...topProducts.map(p => [p.name, p.sales, `₪${p.revenue}`])
            ].map(row => row.join(',')).join('\n');

            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-ocean text-white rounded-md hover:bg-primary-dark"
        >
          <FiDownload />
          تصدير التقرير
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 lg:mb-8 overflow-x-auto">
        <div className="min-w-[300px]">
          {salesData && (
            chartType === 'line' ? (
              <Line options={chartOptions} data={salesData} />
            ) : (
              <Bar options={chartOptions} data={salesData} />
            )
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-semibold mb-4">أفضل المنتجات مبيعاً</h2>
        
        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">المنتج</th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">المبيعات</th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">الإيرادات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{product.sales}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{product.revenue.toLocaleString()} ₪</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-600">المبيعات</p>
                  <p className="font-medium">{product.sales}</p>
                </div>
                <div>
                  <p className="text-gray-600">الإيرادات</p>
                  <p className="font-medium">{product.revenue.toLocaleString()} ₪</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
