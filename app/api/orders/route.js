import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';

// GET /api/orders - Get all orders with pagination and filtering
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name nameAr price images')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Check stock availability and update stock
    for (const item of data.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.nameAr}` },
          { status: 400 }
        );
      }
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    const order = await Order.create(data);
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name nameAr price images');
    
    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 