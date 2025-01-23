const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'prague_store'; // Make sure this matches your Cloudinary upload preset

const uploadToCloudinary = async (file) => {
  if (!CLOUD_NAME) {
    console.error('Cloudinary cloud name is not defined');
    throw new Error('Cloud name is required');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  try {
    console.log('Uploading to Cloudinary...', {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed: ' + error.message);
  }
};

export { uploadToCloudinary }; 