'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function Cart({ isOpen, setIsOpen }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleIncrement = (item) => {
    console.log('Incrementing item:', item);
    
    const newQuantity = item.quantity + 1;
    if (typeof item.stock === 'undefined') {
      console.error('Stock is undefined for item:', item);
      return;
    }

    if (newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    } else {
      toast.error(`عذراً، الكمية المتوفرة ${item.stock} فقط`);
    }
  };

  const handleDecrement = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-bold text-black">
                          سلة التسوق
                        </Dialog.Title>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-black hover:text-gray-600"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">إغلاق</span>
                          <FiX className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {!cartItems || cartItems.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-lg text-black">سلة التسوق فارغة</p>
                              <Link
                                href="/shop"
                                className="text-primary hover:text-primary-dark mt-4 inline-block"
                                onClick={() => setIsOpen(false)}
                              >
                                تصفح المنتجات
                              </Link>
                            </div>
                          ) : (
                            <ul role="list" className="divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li key={`cart-item-${item.id}`} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={96}
                                      height={96}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="mr-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-black">
                                        <h3>{item.name}</h3>
                                        <p className="mr-4">{item.price} شيكل</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between ">
                                      <div className="flex items-center border rounded-lg">
                                        <button
                                          onClick={() => handleDecrement(item)}
                                          disabled={item.quantity <= 1}
                                          className="p-2 text-black hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                                          aria-label="تقليل الكمية"
                                        >
                                          <FiMinus className="h-4 w-4" />
                                        </button>
                                        <span className="px-4 py-2 text-black font-medium">
                                          {item.quantity}
                                         
                                        </span>
                                        <button
                                          onClick={() => handleIncrement(item)}
                                          disabled={item.quantity >= item.stock}
                                          className="p-2 text-black hover:bg-gray-100 disabled:opacity-50"
                                          aria-label="زيادة الكمية"
                                        >
                                          <FiPlus className="h-4 w-4" />
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-600"
                                        aria-label="حذف من السلة"
                                      >
                                        <FiTrash2 className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {cartItems && cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-black">
                          <p>المجموع</p>
                          <p>{getCartTotal()} شيكل</p>
                        </div>
                        <p className="mt-0.5 text-sm text-black">
                          الشحن والضرائب تحسب عند الدفع
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center rounded-md border border-transparent bg-gradient-ocean px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900"
                          >
                            إتمام الشراء
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm">
                          <button
                            type="button"
                            className="font-medium text-[#04aae7] hover:text-primary-dark"
                            onClick={() => setIsOpen(false)}
                          >
                            مواصلة التسوق
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 