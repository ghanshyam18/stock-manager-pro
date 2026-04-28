import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Stockly | Inventory Management',
  description: 'Fast, offline-first stock management for clothing inventory',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Stockly',
  },
};

export const viewport: Viewport = {
  themeColor: '#228be6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Premium Theme Configuration
const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#eef3ff',
      '#dce4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7',
    ],
  },
  fontFamily: plusJakartaSans.style.fontFamily,
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        fw: 600,
        loaderProps: { type: 'dots' },
      },
      styles: {
        root: { transition: 'transform 100ms ease' },
      },
    },
    Card: {
      defaultProps: {
        padding: 'md',
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-body)',
          boxShadow: 'var(--mantine-shadow-xs)',
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        overlayProps: {
          blur: 3,
          opacity: 0.55,
        },
      },
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body className={plusJakartaSans.className} suppressHydrationWarning>
        <MantineProvider theme={theme} forceColorScheme="light">
          <Notifications position="top-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
