'use client';

import { Box, Button, Container, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { InvoiceListing } from '@/features/invoices/components/InvoiceListing';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';

export default function InvoicesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { invoices, totalCount, search, setSearch, loadMore, hasMore, isLoadingMore, isStale } =
    useInvoices();

  return (
    <Box
      bg="var(--background)"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Container size="xl" py="md" style={{ width: '100%' }}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Box>
              <Title order={1} fw={900} style={{ letterSpacing: '-1px' }}>
                Invoices
              </Title>
              <Text c="dimmed" fw={600} size="sm">
                {totalCount} total invoices recorded
              </Text>
            </Box>
            <Button
              size="md"
              radius="md"
              leftSection={<Plus size={20} />}
              onClick={() => router.push('/invoices/new')}
              variant="filled"
              color="blue.6"
            >
              Create Quick Invoice
            </Button>
          </Group>

          <TextInput
            placeholder="Search by party name or invoice number..."
            leftSection={<Search size={18} style={{ opacity: 0.5 }} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="md"
            radius="md"
            styles={{
              input: {
                borderWidth: '1px',
                '&:focus': {
                  borderColor: 'var(--mantine-color-blue-5)',
                },
              },
            }}
          />
        </Stack>
      </Container>

      <Box style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <Container size="xl" px="md" style={{ height: '100%' }}>
          <Box
            style={{
              height: '100%',
              opacity: isStale ? 0.6 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <InvoiceListing
              invoices={invoices}
              isMobile={!!isMobile}
              loadMore={loadMore}
              hasMore={hasMore}
              totalCount={totalCount}
              isLoadingMore={isLoadingMore}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
