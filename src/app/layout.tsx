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

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: plusJakartaSans.style.fontFamily,
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        fw: 600, // Slightly bolder for Jakarta
      },
    },
    Card: {
      defaultProps: {
        padding: 'md',
        radius: 'lg',
        withBorder: true,
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
