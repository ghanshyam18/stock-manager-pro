'use client';

import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { ItemDetailModal } from '@/features/inventory/components/ItemDetailModal';

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
  fontFamily: 'var(--font-jakarta), sans-serif',
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <ModalsProvider
        modals={{
          'item-details': ItemDetailModal,
        }}
      >
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
