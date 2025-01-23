import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const exclude = searchParams.get('exclude');
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    let query = {};
    
    if (category) {
      try {
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = category;
        } else {
          const categoryDoc = await Category.findOne({ _id: category });
          
          if (categoryDoc) {
            query.category = categoryDoc._id;
          }
        }
      } catch (error) {
        console.error('Error processing category:', error);
        throw new Error('Invalid category');
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (exclude) {
      query._id = { $ne: exclude };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { descriptionAr: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (searchParams.get('inStock') === 'true') {
      query.stock = { $gt: 0 };
    }
    
    let sort = {};
    switch (sortBy) {
      case 'priceAsc':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      case 'nameAsc':
        sort = { nameAr: 1 };
        break;
      case 'nameDesc':
        sort = { nameAr: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    const total = await Product.countDocuments(query);
    
    if (total === 0) {
      return NextResponse.json({
        products: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 0,
        },
      });
    }

    const products = await Product.find(query)
      .populate('category', 'name nameAr')
      .select('_id name nameAr price images category isActive stock')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    console.log('API response products:', products); // Debug log
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    let errorMessage = 'حدث خطأ أثناء تحميل المنتجات';
    
    if (error instanceof mongoose.Error.CastError) {
      errorMessage = 'تصنيف غير صالح';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        products: [],
        pagination: { total: 0, page: 1, pages: 0 }
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'nameAr', 'description', 'descriptionAr', 'price', 'category', 'stock', 'images'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create product with validated data
    const productData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      isActive: data.isActive ?? true,
    };

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name nameAr');

    return NextResponse.json(populatedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 