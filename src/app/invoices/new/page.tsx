'use client';

import { ActionIcon, Box, Container, Group, Paper, Text } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { QuickInvoiceForm } from '@/features/invoices/components/QuickInvoiceForm';

export default function NewInvoicePage() {
  const router = useRouter();

  return (
    <Box
      bg="var(--mantine-color-body)"
      h="100dvh"
      className="accelerated"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Paper component="header" radius={0} py="sm" px="md" withBorder style={{ zIndex: 100 }}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              onClick={() => router.push('/invoices')}
              aria-label="Back to Invoices"
            >
              <ArrowLeft size={20} />
            </ActionIcon>
            <Text fw={900} size="lg" style={{ letterSpacing: '-0.3px' }}>
              New Invoice
            </Text>
          </Group>
          <Box w={32} />
        </Group>
      </Paper>

      <Box component="main" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <Container
          size="sm"
          px="md"
          py="md"
          style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
        >
          <QuickInvoiceForm />
        </Container>
      </Box>
    </Box>
  );
}
