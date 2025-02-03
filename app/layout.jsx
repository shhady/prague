import { Cairo } from "next/font/google";
import "./globals.css";
import RootLayoutClient from './RootLayoutClient';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { OrderProvider } from './context/OrderContext';
import { ClerkProvider } from '@clerk/nextjs';
import { arSA } from '@clerk/localizations';
import { UserProvider } from './context/UserContext';
import Footer from './components/Footer'
const cairo = Cairo({ subsets: ["arabic"] });

export const metadata = {
  title: "متجر الكريستال | Crystal Shop",
  description: "متجر للكريستال والأحجار الكريمة المستوردة من براغ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <ClerkProvider localization={arSA}>
        <UserProvider>
          <body className={cairo.className}>
            <OrderProvider>
              <CartProvider>
                <RootLayoutClient>
                  {children}
                </RootLayoutClient>
              </CartProvider>
            </OrderProvider>
            <Toaster position="top-center" />
            <Footer />
          </body>
        </UserProvider>
      </ClerkProvider>
    </html>
  );
} 