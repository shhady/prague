'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiPlus, FiX, FiLoader } from 'react-icons/fi';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    // isActive: true
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

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
          // Add size validation
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error(`File ${file.name} is too large (max 5MB)`);
          }

          // Add type validation
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`);
          }

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
          toast.success('Images uploaded successfully');
        } else {
          toast.warning('Some images failed to upload');
          console.error('Upload errors:', uploadErrors);
        }
      } else {
        toast.error('No images were uploaded');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) throw new Error('Failed to add category');
      
      const addedCategory = await response.json();
      setCategories(prev => [...prev, addedCategory]);
      setShowCategoryForm(false);
      setNewCategory({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        image: ''
      });
      toast.success('تم إضافة الفئة بنجاح');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('فشل في إضافة الفئة');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      console.log('Submitting product data:', productData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details?.join(', ') || 'Failed to add product');
      }

      toast.success('Product added successfully');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>

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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الاسم بالإنجليزية</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">التصنيف</h2>
            <button
              type="button"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="text-blue-700 hover:text-primary-dark flex items-center gap-2"
            >
              <FiPlus /> إضافة فئة جديدة
            </button>
          </div>

          {showCategoryForm ? (
            <div className="mb-4 p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">فئة جديدة</h3>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              </div>

              {/* Category Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الفئة بالعربية</label>
                  <input
                    type="text"
                    placeholder="مثال: الكريستال"
                    value={newCategory.nameAr}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name in English</label>
                  <input
                    type="text"
                    placeholder="Example: Crystal"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Category Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">وصف الفئة بالعربية</label>
                  <textarea
                    placeholder="وصف مختصر للفئة..."
                    value={newCategory.descriptionAr}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category Description in English</label>
                  <textarea
                    placeholder="Brief description of the category..."
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                <input
                  type="text"
                  placeholder="رابط الصورة..."
                  value={newCategory.image}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleAddCategory}
                className="w-full bg-gradient-ocean text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                إضافة الفئة
              </button>
            </div>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">اختر التصنيف</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.nameAr}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">الوصف</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الوصف بالعربية</label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف بالإنجليزية</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Price and Stock */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">السعر والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">السعر</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المخزون</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">الصور</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {uploadingImages ? (
                  <div className="flex items-center space-x-2">
                    <FiLoader className="w-5 h-5 animate-spin" />
                    <span>جاري رفع الصور...</span>
                  </div>
                ) : (
                  <>
                    <FiPlus className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">اضغط لإضافة صور</span>
                  </>
                )}
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 25vw, 200px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary"
            />
            <label className="mr-2 text-sm font-medium">نشط</label>
          </div>
        </div> */}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            <FiSave />
            {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
          </button>
        </div>
      </form>
    </div>
  );
} 