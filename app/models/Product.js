import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  nameAr: {
    type: String,
    required: [true, 'Please provide an Arabic product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  descriptionAr: {
    type: String,
    required: [true, 'Please provide an Arabic product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one product image'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  features: [{
    type: String,
  }],
  featuresAr: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  reviews: [{
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  sales: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema); 