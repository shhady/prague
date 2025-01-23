import { Cairo } from "next/font/google";
import "./globals.css";
import RootLayoutClient from './RootLayoutClient';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata = {
  title: "متجر الكريستال | Crystal Shop",
  description: "متجر للكريستال والأحجار الكريمة المستوردة من براغ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <CartProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </CartProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
} 