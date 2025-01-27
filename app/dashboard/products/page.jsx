'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiTrash, FiCopy, FiImage, FiBox } from 'react-icons/fi';
import Image from 'next/image';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null
  });
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      setError('Failed to load products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const categories = await response.json();
      console.log('Categories response:', categories); // Debug log
      
      // API returns array directly, so we can use it as is
      setCategories(categories || []);

    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setDeleteModal({ 
      isOpen: true, 
      productId
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/products/${deleteModal.productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(p => p._id !== deleteModal.productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  const toggleProductSelection = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p._id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedProducts).map(id => 
        fetch(`/api/products/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      
      setProducts(products.filter(p => !selectedProducts.has(p._id)));
      setSelectedProducts(new Set());
      toast.success('Products deleted successfully');
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete some products');
    } finally {
      setBulkDeleteModal(false);
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      const response = await fetch('/api/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Failed to duplicate product');
      
      const duplicatedProduct = await response.json();
      setProducts([duplicatedProduct, ...products]);
      toast.success('Product duplicated successfully');
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      (product.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = categoryFilter === 'all' || product.category?._id === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <FiAlertCircle />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Link
          href="/dashboard/products/new"
          className="w-full sm:w-auto bg-gradient-ocean text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2"
        >
          <FiPlus />
          منتج جديد
        </Link>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="بحث بإسم المنتج..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select 
          className="w-full sm:w-auto p-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          disabled={isCategoriesLoading}
        >
          <option value="all">كل الأقسام</option>
          {categories && categories.length > 0 && categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.nameAr || category.name || 'قسم بدون اسم'}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Delete Banner */}
      {selectedProducts.size > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            تم تحديد {selectedProducts.size} منتج
          </span>
          <button
            onClick={() => setBulkDeleteModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-600 hover:text-red-700 border border-red-200 rounded-md px-4 py-2"
          >
            <FiTrash />
            حذف المحدد
          </button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === products.length}
                  onChange={toggleAllSelection}
                  className="rounded text-primary focus:ring-primary"
                />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المنتج
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المخزون
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التصنيف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                    className="rounded text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 relative">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.nameAr || product.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <FiImage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.nameAr || product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price} شيكل</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock} قطعة
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category?.nameAr || 'غير محدد'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/dashboard/products/${product._id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product._id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="نسخ المنتج"
                    >
                      <FiCopy className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4">
            {/* Checkbox for bulk selection */}
            <div className="flex justify-end mb-2">
              <input
                type="checkbox"
                checked={selectedProducts.has(product._id)}
                onChange={() => toggleProductSelection(product._id)}
                className="rounded text-primary focus:ring-primary"
              />
            </div>

            {/* Product Image */}
            <div className="relative aspect-square mb-4">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.nameAr || product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiImage className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900">{product.nameAr || product.name}</h3>
              <p className="text-gray-500 text-sm">{product.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-medium">{product.price} شيكل</p>
                <span className={`text-sm ${product.stock <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
                  {product.stock} قطعة
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {product.category?.nameAr || 'غير محدد'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Link 
                href={`/dashboard/products/${product._id}/edit`}
                className="flex-1 bg-blue-50 text-blue-600 p-2 rounded text-center hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
              >
                <FiEdit2 className="w-4 h-4" />
                تعديل
              </Link>
              <button 
                onClick={() => handleDelete(product._id)}
                className="flex-1 bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" />
                حذف
              </button>
              <button
                onClick={() => handleDuplicate(product._id)}
                className="bg-gray-50 text-gray-600 p-2 rounded hover:bg-gray-100 transition-colors"
                title="نسخ المنتج"
              >
                <FiCopy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiBox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {products.length === 0 ? 'لا توجد منتجات' : 'لا توجد نتائج تطابق البحث'}
          </h3>
          <p className="text-gray-500">
            {products.length === 0 
              ? 'قم بإضافة منتجات جديدة لعرضها هنا'
              : 'جرب تغيير معايير البحث'
            }
          </p>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={confirmDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
      />

      <ConfirmationModal
        isOpen={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="حذف المنتجات المحددة"
        message={`هل أنت متأكد من حذف ${selectedProducts.size} منتج؟ لا يمكن التراجع عن هذا الإجراء.`}
      />
    </div>
  );
} 