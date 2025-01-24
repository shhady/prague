'use client';
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/app/components/ConfirmationModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: ''
  });

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
      console.error('Error:', error);
      toast.error('فشل في تحميل الفئات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast.success(editingCategory ? 'تم تحديث الفئة بنجاح' : 'تم إضافة الفئة بنجاح');
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في حفظ الفئة');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameAr: category.nameAr,
      description: category.description,
      descriptionAr: category.descriptionAr,
      image: category.image
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    setDeleteModal({ isOpen: true, categoryId });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/categories/${deleteModal.categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast.success('تم حذف الفئة بنجاح');
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في حذف الفئة');
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      image: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الفئات</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-ocean text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <FiPlus />
          إضافة فئة جديدة
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم بالعربية</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name in English</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف بالعربية</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description in English</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رابط الصورة</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                {editingCategory ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image
                src={category.image}
                alt={category.nameAr}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{category.nameAr}</h3>
              <p className="text-gray-600 mb-4">{category.descriptionAr}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-black hover:text-primary-dark"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={confirmDelete}
        title="حذف الفئة"
        message="هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
} 