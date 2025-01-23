export default function Footer() {
  return (
    <footer className="bg-secondary-dark text-white bg-gradient-ocean">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">متجر الكريستال</h3>
            <p className="text-gray-600">
              نقدم أجود أنواع الكريستال والأحجار الكريمة المستوردة من براغ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-primary">الرئيسية</a></li>
              <li><a href="/shop" className="text-gray-600 hover:text-primary">المتجر</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-primary">من نحن</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-primary">اتصل بنا</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">الفئات</h3>
            <ul className="space-y-2">
              <li><a href="/shop?category=crystal" className="text-gray-600 hover:text-primary">الكريستال</a></li>
              <li><a href="/shop?category=colored" className="text-gray-600 hover:text-primary">الكريستال الملون</a></li>
              <li><a href="/shop?category=garnet" className="text-gray-600 hover:text-primary">حجر الجارنت</a></li>
              <li><a href="/shop?category=glassluk" className="text-gray-600 hover:text-primary">جلاسلوك</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">النشرة البريدية</h3>
            <p className="text-gray-600 mb-4">اشترك للحصول على آخر العروض والمنتجات</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 p-2 rounded-lg bg-gray-100 text-white border border-gray-600 focus:outline-none focus:border-primary"
              />
              <button className="bg-gradient-ocean text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                اشتراك
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>© {new Date().getFullYear()} متجر الكريستال. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
} 