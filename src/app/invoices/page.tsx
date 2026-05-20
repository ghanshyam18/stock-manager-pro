'use client';

import { Box, Button, Container, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { InvoiceListing } from '@/features/invoices/components/InvoiceListing';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import { BottomNavigation } from '@/shared/components/BottomNavigation';

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, totalCount, search, setSearch, loadMore, hasMore, isLoadingMore, isStale } =
    useInvoices();

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
          <Text fw={900} size="lg" style={{ letterSpacing: '-0.3px' }}>
            Billing Directory
          </Text>
          <Button
            size="sm"
            radius="md"
            leftSection={<Plus size={16} />}
            onClick={() => router.push('/invoices/new')}
            variant="filled"
            color="brand.6"
            fw={700}
          >
            New Invoice
          </Button>
        </Group>
      </Paper>

      <Box component="main" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <Container
          size="sm"
          px="md"
          py="md"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Stack gap="md" style={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <Box style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 200ms ease' }}>
              <TextInput
                placeholder="Search party or invoice..."
                leftSection={
                  <Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />
                }
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                size="md"
                radius="md"
                variant="filled"
              />
            </Box>

            <Box style={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
              <InvoiceListing
                invoices={invoices}
                isMobile={true} // Unified premium mobile-first look
                loadMore={loadMore}
                hasMore={hasMore}
                totalCount={totalCount}
                isLoadingMore={isLoadingMore}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      <BottomNavigation />
    </Box>
  );
}
