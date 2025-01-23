'use client';
import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AdvancedAnalytics({ data }) {
  const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [activeMetric, setActiveMetric] = useState('revenue');

  const metrics = {
    revenue: {
      label: 'الإيرادات',
      color: '#40E0D0',
      format: (value) => `${value.toLocaleString()} شيكل`
    },
    orders: {
      label: 'الطلبات',
      color: '#4CAF50',
      format: (value) => value
    },
    avgOrderValue: {
      label: 'متوسط قيمة الطلب',
      color: '#FF9800',
      format: (value) => `${value.toLocaleString()} شيكل`
    }
  };

  const chartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: metrics[activeMetric].label,
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: metrics[activeMetric].color,
        backgroundColor: `${metrics[activeMetric].color}20`,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const conversionData = {
    labels: ['زيارات', 'عربة التسوق', 'الدفع', 'إتمام الطلب'],
    datasets: [{
      label: 'معدل التحويل',
      data: [1000, 400, 200, 150],
      backgroundColor: [
        '#40E0D0',
        '#32B8B8',
        '#248F8F',
        '#166666'
      ]
    }]
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {Object.entries(metrics).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-4 py-2 rounded-lg ${
                activeMetric === key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
          <FiCalendar className="text-gray-400" />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            dateFormat="dd/MM/yyyy"
            className="border-none focus:outline-none"
            placeholderText="اختر نطاق التاريخ"
          />
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-6">تحليل {metrics[activeMetric].label}</h3>
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }} />
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-6">معدل التحويل</h3>
          <Bar data={conversionData} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }} />
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-6">المؤشرات الرئيسية</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>معدل التحويل</span>
              <span className="font-bold text-primary">15%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>متوسط قيمة الطلب</span>
              <span className="font-bold text-primary">750 شيكل</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>معدل التكرار</span>
              <span className="font-bold text-primary">3.2</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>معدل الارتداد</span>
              <span className="font-bold text-red-500">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 