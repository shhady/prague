'use client';
import { useState, useEffect, useRef, useCallback, Suspense, forwardRef } from 'react';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import ProductSkeleton from '@/app/components/ProductSkeleton';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { FiLoader, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'next/navigation';

const PRICE_RANGES = [
  { label: 'الكل', value: 'all', min: null, max: null },
  { label: '1 - 200 شيكل', value: 'range1', min: 1, max: 200 },
  { label: '200 - 500 شيكل', value: 'range2', min: 200, max: 500 },
  { label: '500 - 800 شيكل', value: 'range3', min: 500, max: 800 },
  { label: 'أكثر من 800 شيكل', value: 'range4', min: 800, max: null },
];

// Loading component for the product grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => {
    const categoryId = searchParams.get('category');
    return {
      category: categoryId || '',
      priceRange: '',
      inStock: false
    };
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Reference to track if we're currently fetching
  const isFetching = useRef(false);
  // Reference to the observer
  const observer = useRef();
  // Reference to the last product element
  const lastProductRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching.current) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const filtersRef = useRef();

  useEffect(() => {
    fetchCategories();
    // Update filters when URL category parameter changes
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setFilters(prev => ({
        ...prev,
        category: categoryId
      }));
    }
  }, [searchParams]);

  // Single useEffect for all filter changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [filters, sortBy, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (pageNum, isNewSearch = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        sortBy,
      });
      
      // Add search query
      if (searchQuery?.trim()) {
        queryParams.append('search', searchQuery.trim());
      }
      
      // Add filters
      if (filters.category) {
        queryParams.append('category', filters.category);
      }

      if (filters.priceRange && filters.priceRange !== 'all') {
        const selectedRange = PRICE_RANGES.find(range => range.value === filters.priceRange);
        if (selectedRange) {
          if (selectedRange.min) queryParams.append('minPrice', selectedRange.min.toString());
          if (selectedRange.max) queryParams.append('maxPrice', selectedRange.max.toString());
        }
      }

      if (filters.inStock) {
        queryParams.append('inStock', 'true');
      }

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      if (isNewSearch) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      setHasMore(data.products.length === 10);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href={`/shop?category=${searchParams.get('category')}`}
            className="text-primary hover:text-primary-dark"
          >
            عرض كل المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">المنتجات</h1>
      
      <ErrorBoundary>
        <ProductFilters
          ref={filtersRef}
          categories={categories}
          initialCategory={searchParams.get('category')}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
        />

        <Suspense fallback={<ProductGridSkeleton />}>
          {products.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد منتجات تطابق معايير البحث</p>
              <button
                onClick={() => {
                  filtersRef.current?.clearFilters();
                }}
                className="mt-4 text-primary hover:text-primary-dark"
              >
                عرض كل المنتجات
              </button>
            </div>
          ) : (
            <div>
              <ProductGrid 
                products={products} 
                lastProductRef={lastProductRef}
              />
              
              {isLoading && (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
} 