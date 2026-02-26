import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Whisky Vault',
  description: 'Manage your premium whisky collection with AI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Whisky Vault',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="clear-cache" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.location.search.includes('clear=1')) {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              if ('caches' in window) {
                caches.keys().then((keyList) => {
                  return Promise.all(keyList.map((key) => {
                    return caches.delete(key);
                  }));
                }).then(() => {
                  window.location.href = window.location.pathname;
                });
              }
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Header />
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}
