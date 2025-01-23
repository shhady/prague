'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingBag, 
  FiMail, 
  FiSettings,
  FiMenu,
  FiX,
  FiBell
} from 'react-icons/fi';

const menuItems = [
  { 
    title: 'لوحة التحكم', 
    icon: FiHome, 
    path: '/dashboard',
    badge: null
  },
  { 
    title: 'المنتجات', 
    icon: FiBox, 
    path: '/dashboard/products',
    badge: null
  },
  { 
    title: 'العملاء', 
    icon: FiUsers, 
    path: '/dashboard/customers',
    badge: null
  },
  { 
    title: 'الطلبات', 
    icon: FiShoppingBag, 
    path: '/dashboard/orders',
    badge: '12' // Example badge for new orders
  },
  { 
    title: 'الرسائل', 
    icon: FiMail, 
    path: '/dashboard/messages',
    badge: '3' // Example badge for unread messages
  },
  { 
    title: 'الإعدادات', 
    icon: FiSettings, 
    path: '/dashboard/settings',
    badge: null
  },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-l">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    pathname === item.path 
                      ? 'bg-primary text-white' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-6 h-6 ml-2" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'lg:mr-64' : ''}`}>
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">مدير النظام</span>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 