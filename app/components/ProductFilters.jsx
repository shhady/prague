'use client';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const PRICE_RANGES = [
  { label: 'الكل', value: 'all', min: null, max: null },
  { label: '1 - 200 شيكل', value: 'range1', min: 1, max: 200 },
  { label: '200 - 500 شيكل', value: 'range2', min: 200, max: 500 },
  { label: '500 - 800 شيكل', value: 'range3', min: 500, max: 800 },
  { label: 'أكثر من 800 شيكل', value: 'range4', min: 800, max: null },
];

export default forwardRef(function ProductFilters({ 
  onFilterChange, 
  onSortChange, 
  onSearch,
  categories,
  initialCategory
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialCategory || '',
    priceRange: '',
    inStock: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchInput, setSearchInput] = useState('');

  // Expose clearFilters function to parent
  useImperativeHandle(ref, () => ({
    clearFilters: handleClearFilters
  }));

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Convert price range to min/max values
    if (name === 'priceRange') {
      const selectedRange = PRICE_RANGES.find(range => range.value === value);
      if (selectedRange && selectedRange.value !== 'all') {
        onFilterChange({
          ...filters,
          minPrice: selectedRange.min,
          maxPrice: selectedRange.max,
          priceRange: value
        });
      } else {
        // If 'all' is selected, remove price filters
        const { minPrice, maxPrice, priceRange, ...restFilters } = filters;
        onFilterChange(restFilters);
      }
    } else {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleClearFilters = () => {
    // Reset all filters to initial state
    setFilters({
      category: '', // Reset category to empty string
      priceRange: '',
      inStock: false
    });
    setSortBy('newest');
    setSearchInput('');
    
    // Notify parent components of complete reset
    onFilterChange({
      category: '', // Pass empty category to show all products
      priceRange: '',
      inStock: false
    });
    onSortChange('newest');
    onSearch('');
  };

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={!searchInput.trim()}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            searchInput.trim() 
              ? 'bg-gradient-ocean text-white hover:bg-primary-dark' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiSearch />
          بحث
        </button>
      </form>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary"
        >
          <FiFilter />
          <span>الفلترة والترتيب</span>
        </button>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={handleClearFilters}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <FiX />
            <span>مسح الفلترة</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">التصنيف</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">الكل</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">نطاق السعر</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {PRICE_RANGES.map((range, index) => (
                  <option key={index} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">ترتيب حسب</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="newest">الأحدث</option>
                <option value="priceAsc">السعر: من الأقل إلى الأعلى</option>
                <option value="priceDesc">السعر: من الأعلى إلى الأقل</option>
                <option value="nameAsc">الاسم: أ-ي</option>
                <option value="nameDesc">الاسم: ي-أ</option>
              </select>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="h-4 w-4 text-primary rounded border-gray-300"
            />
            <label htmlFor="inStock" className="mr-2 text-sm text-gray-600">
              المتوفر في المخزون فقط
            </label>
          </div>
        </div>
      )}
    </div>
  );
}); 