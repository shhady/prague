'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUpload, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    isPopular: false
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      
      setFormData({
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: product.price,
        stock: product.stock,
        category: product.category._id,
        images: product.images,
        isPopular: product.isPopular
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('فشل في تحميل بيانات المنتج');
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
      toast.error('فشل في تحميل التصنيفات');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.nameAr) newErrors.nameAr = 'Arabic name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.descriptionAr) newErrors.descriptionAr = 'Arabic description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadErrors = [];

    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const url = await uploadToCloudinary(file);
          return url;
        } catch (error) {
          uploadErrors.push(`Failed to upload ${file.name}: ${error.message}`);
          return null;
        }
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));

        if (uploadErrors.length === 0) {
          toast.success('تم رفع الصور بنجاح');
        } else {
          toast.warning('بعض الصور لم يتم رفعها');
          console.error('Upload errors:', uploadErrors);
        }
      } else {
        toast.error('لم يتم رفع أي صور بنجاح');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('فشل في رفع الصور');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast.success('تم تحديث المنتج بنجاح');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('فشل في تحديث المنتج');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">تعديل المنتج</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم بالعربية</label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.nameAr && <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name in English</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الوصف بالعربية</label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-lg"
              />
              {errors.descriptionAr && <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description in English</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-lg"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">السعر والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">السعر (شيكل)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-lg"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المخزون</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border rounded-lg"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">التصنيف</h2>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">اختر التصنيف</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.nameAr}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">الصور</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                <FiUpload />
                <span>اختر الصور</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages}
                />
              </label>
              {uploadingImages && <span className="text-sm text-gray-500">جاري رفع الصور...</span>}
            </div>

            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.filter(url => url && url.trim() !== '').map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative">
                      {url && (
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 25vw, 200px"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Product */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary"
            />
            <label className="mr-2 text-sm font-medium">منتج مميز</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            <FiSave />
            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
} 