'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiLoader } from 'react-icons/fi';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import DraggableImageList from '@/app/components/DraggableImageList';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  // ... rest of the component remains the same, just update API calls to use id ...

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      // ... rest of the function remains the same ...
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    }
  };
} 