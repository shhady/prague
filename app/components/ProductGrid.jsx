import ProductCard from "./ProductCard";
import Link from "next/link";

export default function ProductGrid({ products, lastProductRef }) {
  const getShade = (index) => {
    // Calculate position in row (0, 1, 2, 3)
    const position = index % 4;
    switch(position) {
      case 0: return 'light';
      case 1: return 'medium';
      case 2: return 'medium';
      case 3: return 'dark';
      default: return 'light';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div
          key={product._id}
          ref={index === products.length - 1 ? lastProductRef : null}
        >
          <Link 
            href={`/shop/${product._id}`}
            className="block cursor-pointer h-full"
          >
            <ProductCard 
              product={product} 
              shade="light"
            />
          </Link>
        </div>
      ))}
    </div>
  );
} 