'use client';
import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheck } from 'react-icons/fi';
import Map from '../components/Map';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">اتصل بنا</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">معلومات التواصل</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-primary text-xl" />
              <span>سولم</span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-primary text-xl" />
              <span dir='ltr'>+972 50 000 0000</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-primary text-xl" />
              <span>info@crystal-shop.com</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">أرسل لنا رسالة</h2>
          <ContactForm />
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
            <Map />
          </div>
        </div>
      </section>
    </div>
  );
} 