'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiTrash, FiCopy } from 'react-icons/fi';
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

  useEffect(() => {
    fetchProducts();
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <FiPlus />
          منتج جديد
        </Link>
      </div>

      {selectedProducts.size > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600">
            تم تحديد {selectedProducts.size} منتج
          </span>
          <button
            onClick={() => setBulkDeleteModal(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <FiTrash />
            حذف المحدد
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
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
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.nameAr}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/products/${product._id}/edit`}
                      className="text-primary hover:text-primary-dark"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product._id)}
                      className="text-blue-500 hover:text-blue-700"
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