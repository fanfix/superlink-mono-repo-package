import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'react-phone-number-input/style.css';
import 'react-phone-input-2/lib/style.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ClientThemeProvider } from '../components/ClientThemeProvider';
import ConsoleSilencer from '../components/ConsoleSilencer';
import { AuthProvider } from '../contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SuperLink - Get started with your phone',
  description: 'Enter your phone number to sign up or log in',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Roboto+Slab:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AppRouterCacheProvider>
          <ClientThemeProvider>
            <AuthProvider autoFetch={true}>
              <ConsoleSilencer />
              {children}
            </AuthProvider>
          </ClientThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
