'use client';

import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { ItemDetailModal } from '@/features/inventory/components/ItemDetailModal';

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
    ],
  },
  fontFamily: 'var(--font-inter), sans-serif',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'var(--font-inter), sans-serif',
    sizes: {
      h1: { fontSize: 'calc(1.8rem + 0.5vw)', fontWeight: '900', lineHeight: '1.2' },
      h2: { fontSize: 'calc(1.4rem + 0.3vw)', fontWeight: '900', lineHeight: '1.3' },
      h3: { fontSize: 'calc(1.15rem + 0.2vw)', fontWeight: '800', lineHeight: '1.3' },
      h4: { fontSize: '1rem', fontWeight: '800', lineHeight: '1.4' },
      h5: { fontSize: '0.875rem', fontWeight: '800', lineHeight: '1.4' },
      h6: { fontSize: '0.75rem', fontWeight: '800', lineHeight: '1.5' },
    },
  },
  components: {
    Button: {
      defaultProps: {
        fw: 700,
        radius: 'md',
        loaderProps: { type: 'dots' },
      },
      styles: {
        root: {
          transition: 'transform 100ms ease, background-color 150ms ease, box-shadow 150ms ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'xl',
        variant: 'subtle',
        color: 'gray',
      },
      styles: {
        root: {
          transition: 'transform 100ms ease, background-color 150ms ease',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
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
          borderColor: 'var(--mantine-color-default-border)',
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        overlayProps: {
          blur: 4,
          opacity: 0.3,
          backgroundOpacity: 0.3,
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    Autocomplete: {
      defaultProps: {
        size: 'md',
        radius: 'md',
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
