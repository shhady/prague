// 'use client';
// import Image from 'next/image';
// import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// const topProducts = [
//   {
//     id: 1,
//     name: 'طقم كريستال فاخر',
//     image: '/images/product1.jpg',
//     sales: 124,
//     revenue: 148800,
//     trend: 12.5
//   },
//   {
//     id: 2,
//     name: 'حجر جارنت أحمر ملكي',
//     image: '/images/product2.jpg',
//     sales: 98,
//     revenue: 83300,
//     trend: -5.2
//   },
//   {
//     id: 3,
//     name: 'ثريا كريستال كلاسيك',
//     image: '/images/product3.jpg',
//     sales: 86,
//     revenue: 206400,
//     trend: 8.7
//   }
// ];

// export default function TopProducts() {
//   return (
//     <div className="space-y-4">
//       {topProducts.map((product) => (
//         <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//           <div className="relative w-16 h-16 rounded-lg overflow-hidden">
//             <Image
//               src={product.image}
//               alt={product.name}
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-bold">{product.name}</h3>
//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <span>{product.sales} مبيعات</span>
//               <span>{product.revenue.toLocaleString()} شيكل</span>
//             </div>
//           </div>
//           <div className={`flex items-center gap-1 ${
//             product.trend > 0 ? 'text-green-500' : 'text-red-500'
//           }`}>
//             {product.trend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
//             <span>{Math.abs(product.trend)}%</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// } 