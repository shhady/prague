'use client';
import { FiX, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
export default function MenuOverlay({ isOpen, onClose }) {
  const { user } = useUser();
  const menuItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/shop', label: 'المتجر' },
    { href: '/shop/crystal', label: 'الكريستال' },
    { href: '/shop/colored-crystal', label: 'الكريستال الملون' },
    { href: '/shop/garnet', label: 'حجر الجارنت' },
    { href: '/shop/glassluk', label: 'جلاسلوك' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'اتصل بنا' }
  ];
 
  if (!isOpen) return null;

  return (
    <div onClick={onClose} className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* User and Contact Links */}
          

          {/* Navigation Links */}
          <nav className="space-y-4 mt-8">
            <Link
              href="/"
              className="block text-lg hover:bg-gray-300 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              الرئيسية
            </Link>
            <Link
              href="/shop"
              className="block text-lg  hover:bg-gray-300 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              المتجر
            </Link>
            <Link
              href="/about"
              className="block text-lg  hover:bg-gray-300 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              من نحن
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center gap-3 py-2 text-gray-700  hover:bg-gray-300 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              <span>اتصل بنا</span>
            </Link>
            <div className="mb-8 pt-8">
            <Link 
              href="/account" 
              className="flex items-center gap-3 py-2 text-gray-700  hover:bg-gray-300 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              <FiUser className="w-6 h-6" />
              <span>حسابي</span>
            </Link>
            </div>
            {user?.publicMetadata?.role == 'admin' && <Link href={'/dashboard'}
                 className="flex items-center gap-3  text-gray-700  hover:bg-gray-300 px-3 py-3 rounded-lg mt-4"
            >
            لوحة التحكم
           </Link>}
         
          </nav>
        </div>
      </div>
    </div>
  );
} 