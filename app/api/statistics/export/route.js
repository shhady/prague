import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';
import ExcelJS from 'exceljs';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const orders = await Order.find({
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).populate('items.id', 'nameAr name price');

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    // Add headers
    worksheet.addRow([
      'رقم الطلب',
      'تاريخ الطلب',
      'اسم العميل',
      'المنتجات',
      'الكمية',
      'السعر',
      'المجموع',
      'طريقة الدفع',
      'الحالة'
    ]);

    // Add data
    orders.forEach(order => {
      order.items.forEach(item => {
        worksheet.addRow([
          order._id.toString(),
          new Date(order.createdAt).toLocaleDateString('ar'),
          order.customerInfo.fullName,
          item.nameAr,
          item.quantity,
          item.price,
          item.price * item.quantity,
          order.paymentMethod === 'cash' ? 'نقداً' : 'بطاقة',
          order.status
        ]);
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=sales-report-${start}-to-${end}.xlsx`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
} 