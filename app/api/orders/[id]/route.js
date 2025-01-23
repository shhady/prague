import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET /api/orders/[id] - Get order details
export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    const order = await db.collection('orders').findOne({ id });

    if (!order) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تفاصيل الطلب' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const data = await request.json();

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'حالة الطلب غير صحيحة' },
        { status: 400 }
      );
    }

    // Update order
    const timelineEntry = {
      status: data.status,
      date: new Date(),
      note: data.note || getStatusNote(data.status)
    };

    const result = await db.collection('orders').findOneAndUpdate(
      { id },
      {
        $set: {
          status: data.status,
          updatedAt: new Date()
        },
        $push: {
          timeline: timelineEntry
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
    case 'shipped':
      return 'تم شحن الطلب';
    case 'delivered':
      return 'تم توصيل الطلب';
    case 'cancelled':
      return 'تم إلغاء الطلب';
    default:
      return 'تم تحديث حالة الطلب';
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Mock cancellation - Replace with actual database update
    const order = {
      id,
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إلغاء الطلب' },
      { status: 500 }
    );
  }
} 