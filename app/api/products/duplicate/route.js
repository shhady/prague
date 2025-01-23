import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function POST(request) {
  try {
    await dbConnect();
    const { productId } = await request.json();

    const sourceProduct = await Product.findById(productId);
    if (!sourceProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create the duplicate product
    const duplicateProduct = new Product({
      ...sourceProduct.toObject(),
      _id: undefined,
      name: `${sourceProduct.name} (نسخة)`,
      nameAr: `${sourceProduct.nameAr} (نسخة)`,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicateProduct.save();

    const populatedProduct = await Product.findById(duplicateProduct._id)
      .populate('category', 'name nameAr');

    return NextResponse.json(populatedProduct, { status: 201 });
  } catch (error) {
    console.error('Error duplicating product:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate product' },
      { status: 500 }
    );
  }
} 