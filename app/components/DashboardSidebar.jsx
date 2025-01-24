'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/app/context/OrderContext';
import { 
  FiHome, 
  FiBox, 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiBarChart2 
} from 'react-icons/fi';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { pendingOrdersCount } = useOrders();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      href: '/dashboard',
      label: 'لوحة التحكم',
      icon: FiHome,
    },
    {
      href: '/dashboard/products',
      label: 'المنتجات',
      icon: FiBox,
    },
    {
      href: '/dashboard/categories',
      label: 'الأقسام',
      icon: FiGrid,
    },
    {
      href: '/dashboard/orders',
      label: 'الطلبات',
      icon: FiShoppingBag,
      notification: pendingOrdersCount
    },
    {
      href: '/dashboard/sales',
      label: 'المبيعات',
      icon: FiBarChart2,
    },
    {
      href: '/dashboard/customers',
      label: 'العملاء',
      icon: FiUsers,
    },
    {
      href: '/dashboard/settings',
      label: 'الإعدادات',
      icon: FiSettings,
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">لوحة التحكم</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-gradient-ocean text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {mounted && item.notification > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.notification}
                  </span>
                )}
              </div>
              <span className="mr-2">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
} 