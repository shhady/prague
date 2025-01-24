const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'prague_store'; // Make sure this matches your Cloudinary upload preset

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'crystal-products');

  try {
    // Add size validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error(`File ${file.name} is too large (max 5MB)`);
    }

    // Add type validation
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} is not an image`);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export { uploadToCloudinary }; 