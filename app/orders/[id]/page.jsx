import { use } from 'react';
import OrderDetails from '@/app/components/OrderDetails';

export default function OrderPage({ params }) {
  const unwrappedParams = use(params);
  
  return <OrderDetails orderId={unwrappedParams.id} />;
} 