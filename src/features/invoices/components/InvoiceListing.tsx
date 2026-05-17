import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Download, Search } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { type Invoice } from '../../inventory/services/db';
import { downloadInvoicePdf } from '../utils/downloadInvoicePdf';

interface InvoiceListingProps {
  invoices: Invoice[];
  isMobile: boolean;
  loadMore: () => void;
  hasMore: boolean;
  totalCount: number;
  isLoadingMore: boolean;
}

export function InvoiceListing({
  invoices,
  isMobile,
  loadMore,
  hasMore,
  totalCount,
  isLoadingMore,
}: InvoiceListingProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: invoices.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? 132 : 72),
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Infinite loader trigger
  useEffect(() => {
    if (virtualItems.length > 0) {
      const lastItem = virtualItems[virtualItems.length - 1];
      if (lastItem.index >= invoices.length - 5 && hasMore && !isLoadingMore) {
        loadMore();
      }
    }
  }, [virtualItems, invoices.length, hasMore, loadMore, isLoadingMore]);

  if (invoices.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Search size={48} strokeWidth={1.5} style={{ opacity: 0.2 }} />
          <Text c="dimmed" fw={500}>
            No invoices found
          </Text>
        </Stack>
      </Center>
    );
  }

  const handleDownloadPdf = async (id: number) => {
    try {
      await downloadInvoicePdf(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        position: 'relative',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {isMobile ? (
          // Mobile Cards View
          virtualItems.map((virtualRow) => {
            const invoice = invoices[virtualRow.index];
            if (!invoice) return null;
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '4px 0',
                }}
              >
                <Paper
                  shadow="xs"
                  radius="lg"
                  p="md"
                  withBorder
                  style={{
                    backgroundColor: 'var(--mantine-color-body)',
                  }}
                >
                  <Group justify="space-between" mb="xs">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={800} size="lg" truncate style={{ letterSpacing: '-0.3px' }}>
                        {invoice.partyName}
                      </Text>
                      <Text size="xs" c="dimmed" fw={700}>
                        #{invoice.invoiceNo}
                      </Text>
                    </Box>
                    <Text fw={900} size="xl" c="blue.7">
                      ₹{invoice.grandTotal.toLocaleString('en-IN')}
                    </Text>
                  </Group>
                  <Group justify="space-between" mt="md">
                    <Text size="sm" c="dimmed" fw={600}>
                      {new Date(invoice.date).toLocaleDateString('en-IN')}
                    </Text>
                    <Button
                      variant="light"
                      size="xs"
                      radius="md"
                      leftSection={<Download size={14} />}
                      onClick={() => handleDownloadPdf(invoice.id!)}
                    >
                      PDF
                    </Button>
                  </Group>
                </Paper>
              </div>
            );
          })
        ) : (
          // Desktop Table View
          <Box>
            <Box
              p="md"
              style={{
                display: 'flex',
                fontWeight: 800,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--mantine-color-dimmed)',
                background: 'var(--mantine-color-gray-0)',
                position: 'sticky',
                top: 0,
                zIndex: 20,
                borderBottom: '1px solid var(--mantine-color-gray-2)',
              }}
            >
              <Box w="15%">Invoice No</Box>
              <Box w="15%">Date</Box>
              <Box style={{ flexGrow: 1 }}>Party Name</Box>
              <Box w="15%">Amount</Box>
              <Box w="10%" style={{ textAlign: 'right' }}>
                Actions
              </Box>
            </Box>

            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const invoice = invoices[virtualRow.index];
                if (!invoice) return null;
                return (
                  <UnstyledButton
                    key={virtualRow.key}
                    component="div"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 16px',
                      borderBottom: '1px solid var(--mantine-color-gray-1)',
                      transition: 'background-color 0.15s ease',
                    }}
                    // Using Mantine's built-in styles for hover if possible,
                    // otherwise inline style with a class is okay if it's in a global css.
                    // But here I'll use a simpler approach that avoids <style>
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Text w="15%" fw={600} c="dimmed" size="sm">
                      {invoice.invoiceNo}
                    </Text>
                    <Text w="15%" size="sm">
                      {new Date(invoice.date).toLocaleDateString('en-IN')}
                    </Text>
                    <Text style={{ flexGrow: 1 }} fw={700} size="md" truncate>
                      {invoice.partyName}
                    </Text>
                    <Text w="15%" fw={800} size="lg" c="blue.8">
                      ₹{invoice.grandTotal.toLocaleString('en-IN')}
                    </Text>
                    <Box w="10%" style={{ textAlign: 'right' }}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="lg"
                        radius="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPdf(invoice.id!);
                        }}
                      >
                        <Download size={18} />
                      </ActionIcon>
                    </Box>
                  </UnstyledButton>
                );
              })}
            </div>
          </Box>
        )}
      </div>

      {/* Infinite Loader Footer */}
      <Center py={50} pb={120}>
        {isLoadingMore ? (
          <Group gap="sm">
            <Loader size="sm" color="blue" />
            <Text size="sm" c="dimmed" fw={600}>
              Loading more invoices...
            </Text>
          </Group>
        ) : hasMore ? (
          <Text size="xs" c="dimmed" fw={500}>
            Scroll for more ({totalCount})
          </Text>
        ) : invoices.length > 0 ? (
          <Text size="sm" c="dimmed" fw={600}>
            End of list • {totalCount} invoices
          </Text>
        ) : null}
      </Center>
    </div>
  );
}
