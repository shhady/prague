import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Order from '@/app/models/Order';

// GET /api/orders/[id] - Get order details
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const order = await Order.findById(id)
      .select('-paymentInfo.creditCard')
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'حالة الطلب غير صحيحة' },
        { status: 400 }
      );
    }

    const timelineEntry = {
      status: data.status,
      date: new Date(),
      note: data.note || getStatusNote(data.status)
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: data.status,
          updatedAt: new Date()
        },
        $push: {
          timeline: timelineEntry
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}

function getStatusNote(status) {
  switch (status) {
    case 'processing':
      return 'جاري تجهيز الطلب';
    case 'completed':
      return 'تم شحن الطلب';
    // case 'delivered':
    //   return 'تم توصيل الطلب';
    case 'cancelled':
      return 'تم إلغاء الطلب';
    default:
      return 'تم تحديث حالة الطلب';
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(request, { params }) {
  try {
    const conn = await dbConnect();
    const db = conn.connection.db;
    const { id } = await params;

    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          status: 'cancelled',
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إلغاء الطلب' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).select('-paymentInfo.creditCard');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 