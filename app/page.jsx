'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CategoryCard from './components/CategoryCard';
import ProductCard from './components/ProductCard';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchPopularProducts();
    fetchCategories();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('/api/products?sortBy=popular&limit=6');
      if (!response.ok) throw new Error('Failed to fetch popular products');
      const data = await response.json();
      setPopularProducts(data.products);
    } catch (error) {
      console.error('Error fetching popular products:', error);
      setPopularProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if fetch fails
      setCategories([
        {
          _id: "crystal",
          name: "Crystal",
          nameAr: "الكريستال",
          description: "Pure crystal pieces embodying elegance and luxury",
          descriptionAr: "قطع كريستال نقية تجسد الأناقة والفخامة",
          image: "/crystal.png"
        },
        // ... other default categories
      ]);
    }
  };

  if (!isClient) {
    return <InitialLoadingState />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-page.jpeg"
            alt="Crystal Hero"
            fill
            priority
            className="object-cover opacity-70"
          />
        </div>
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              اكتشف جمال الكريستال التشيكي
            </h1>
            <p className="text-xl mb-8 text-white">
              مجموعة فريدة من الكريستال والأحجار الكريمة المستوردة مباشرة من براغ
            </p>
            <button
              key="explore-collection"
              className="bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:opacity-90 hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => router.push('/shop')}
            >
              استكشف مجموعتنا
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-brand-bg">
        <div className="container mx-auto px-4">
          {/* <h2 className="text-4xl font-bold text-center mb-16">فئات منتجاتنا</h2> */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div 
                key={category._id} 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className={`w-full flex justify-center ${
                  index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                }`}>
                  <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                {/* Content Section */}
                <div className={`w-full text-center md:text-center flex flex-col justify-center items-center ${
                  index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                }`}>
                  <h3 className="text-2xl font-bold mb-4">{category.nameAr}</h3>
                  <p className="text-gray-600 mb-6">{category.descriptionAr}</p>
                  <button
                    onClick={() => router.push(`/shop?category=${category._id}`)}
                    className="bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:opacity-90 hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    تسوق {category.nameAr}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto">
          <div className="border-b-2 border-gray-200 pb-24">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 px-8">
                  <h2 className="text-4xl font-bold mb-8 text-center">من نحن</h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    نحن متخصصون في استيراد أجود أنواع الكريستال والأحجار الكريمة من براغ،
                    ونفخر بتقديم منتجات فاخرة تجمع بين الجودة العالية والتصميم الفريد.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      منتجات مستوردة من براغ
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      جودة عالية وحرفية متميزة
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      تصاميم فريدة وحصرية
                    </li>
                  </ul>
                  <button
                    key="explore-1"
                    className="bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:opacity-90 hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => router.push('/about')}
                  >
                    اقرأ المزيد
                  </button>
                </div>
                <div className="md:w-1/2 flex justify-center items-center px-8">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                    width={500}
                    height={500}
                    priority 
                      src="/about-us.webp" 
                      alt="عن متجرنا" 
                      className=" object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Ordered Section */}
      <section className="py-6 bg-brand-bg">
        <div className="container mx-auto border-b-2">
          <div className="pb-24">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-16">الأكثر مبيعاً</h2>
              {isLoading ? (
                <div className="text-center">جاري التحميل...</div>
              ) : popularProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                  {popularProducts.map((product) => (
                    <Link 
                      key={product._id}
                      href={`/shop/${product._id}`}
                      className="block cursor-pointer h-full"
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">لا توجد منتجات متوفرة حالياً</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 ">اتصل بنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">الاسم</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand transition-all duration-300 hover:border-brand-light"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand transition-all duration-300 hover:border-brand-light"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">الرسالة</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand transition-all duration-300 hover:border-brand-light"
                  placeholder="اكتب رسالتك هنا"
                ></textarea>
              </div>
              <button className="bg-gradient-ocean text-white px-8 py-3 rounded-lg hover:opacity-90 hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg w-full">
                إرسال الرسالة
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  <p className="flex items-center gap-3">
                    <span className="text-brand-dark">📍</span>
                    سولم
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-brand-dark">📞</span>
                    <span dir='ltr'>+972 50 000 0000</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-brand-dark">✉️</span>
                    info@crystalshop.com
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
                <div className="space-y-2">
                  <p>الأحد - الخميس: 9:00 صباحاً - 11:00 مساءً</p>
                  <p>الجمعة - السبت: 2:00 مساءً - 11:00 مساءً</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.facebook.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.instagram.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.tiktok.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InitialLoadingState() {
  return (
    <div className="animate-pulse">
      {/* Add loading skeleton for home page */}
      <div className="h-[80vh] bg-gray-200" />
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
} 