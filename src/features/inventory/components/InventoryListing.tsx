'use client';

import {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Drawer,
  Group,
  Image,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, Filter, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useOverlayHistory } from '@/shared/hooks/useOverlayHistory';
import { formatDate } from '@/shared/utils/date';

import { db, type InventoryItem } from '../services/db';
import { ItemDetailModal } from './ItemDetailModal';

export function InventoryListing() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [search, setSearch] = useState('');
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const allItems = useLiveQuery(() => db.inventory.orderBy('date').reverse().toArray());
  const designSuggestions = useLiveQuery(async () => {
    const keys = await db.inventory.orderBy('designNo').uniqueKeys();
    return keys.map((k) => String(k));
  }, []);

  const filteredItems = useMemo(() => {
    if (!allItems) return [];
    return allItems.filter((item) => {
      const matchesSearch = item.designNo.toLowerCase().includes(search.toLowerCase());
      const matchesDate =
        (!dateFilter.start || item.date >= dateFilter.start) &&
        (!dateFilter.end || item.date <= dateFilter.end);
      return matchesSearch && matchesDate;
    });
  }, [allItems, search, dateFilter]);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Back button handling
  useOverlayHistory(opened, close, 'inventory-item-details');
  useOverlayHistory(filterOpened, closeFilter, 'inventory-filters');

  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setScrollMargin(parentRef.current.offsetTop);
    }
  }, [allItems]);

  const rowVirtualizer = useWindowVirtualizer({
    count: filteredItems.length,
    estimateSize: () => (isMobile ? 130 : 140),
    overscan: 10,
    scrollMargin,
  });

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this item?')) return;

    await db.inventory.delete(Number(id));
    notifications.show({
      title: 'Deleted',
      message: 'Item removed from inventory',
      color: 'red',
    });
  };

  const isFilterActive = !!(dateFilter.start || dateFilter.end);

  if (!allItems) {
    return (
      <Center h={300}>
        <Loader size="lg" variant="dots" color="blue" />
      </Center>
    );
  }

  return (
    <Stack p="xs" gap="xl">
      {/* Search and Filter Header */}
      <Paper
        p="sm"
        radius="xl"
        withBorder
        shadow="md"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <Autocomplete
            placeholder="Search designs..."
            leftSection={<Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />}
            value={search}
            onChange={setSearch}
            data={designSuggestions || []}
            style={{ flex: 1 }}
            size="md"
            radius="xl"
            variant="filled"
            maxDropdownHeight={250}
          />
          <Indicator disabled={!isFilterActive} color="blue" size={12} offset={4} processing>
            <ActionIcon
              size="44px"
              variant={isFilterActive ? 'filled' : 'light'}
              radius="xl"
              onClick={openFilter}
              color="blue"
            >
              <Filter size={20} strokeWidth={2} />
            </ActionIcon>
          </Indicator>
        </Group>
      </Paper>

      {filteredItems.length === 0 ? (
        <Center h={300}>
          <Stack align="center" gap="sm">
            <Search size={48} strokeWidth={1} style={{ opacity: 0.5 }} />
            <Text color="dimmed" fw={500}>
              No items found
            </Text>
          </Stack>
        </Center>
      ) : (
        <Box
          ref={parentRef}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = filteredItems[virtualRow.index];
            if (!item) return null;

            return (
              <Box
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                  padding: '6px 0',
                }}
              >
                <Card
                  padding="xs"
                  radius="lg"
                  withBorder
                  shadow="xs"
                  style={{ backgroundColor: 'var(--mantine-color-white)', height: '100%' }}
                >
                  <Group wrap="nowrap" gap="sm" align="center" style={{ height: '100%' }}>
                    <Image
                      src={item.image}
                      w={100}
                      h={100}
                      radius="md"
                      alt={item.designNo}
                      style={{ cursor: 'pointer', objectFit: 'cover' }}
                      onClick={() => {
                        setSelectedItem(item);
                        open();
                      }}
                    />

                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Group justify="space-between" wrap="nowrap">
                        <Title
                          order={3}
                          size="h5"
                          fw={800}
                          style={{
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          onClick={() => {
                            setSelectedItem(item);
                            open();
                          }}
                        >
                          {item.designNo}
                        </Title>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          radius="md"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                      </Group>

                      <Group gap={4}>
                        <Calendar size={12} color="var(--mantine-color-gray-5)" />
                        <Text size="xs" color="dimmed" fw={500}>
                          {formatDate(item.date)}
                        </Text>
                      </Group>

                      <Group gap="xs" mt={4}>
                        <Badge size="sm" variant="light" color="blue" radius="sm">
                          {item.quantity} Pcs
                        </Badge>
                        <Badge size="sm" variant="light" color="green" radius="sm">
                          ₹{item.price}
                        </Badge>
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Date Filter Drawer */}
      <Drawer
        opened={filterOpened}
        onClose={closeFilter}
        title={<Text fw={800}>Filter History</Text>}
        position="bottom"
        size="auto"
        radius="24px 24px 0 0"
        padding="xl"
      >
        <Stack gap="md">
          <TextInput
            label="From Date"
            type="date"
            size="md"
            radius="md"
            value={dateFilter.start}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.currentTarget.value;
              setDateFilter((prev) => ({ ...prev, start: val }));
            }}
          />
          <TextInput
            label="To Date"
            type="date"
            size="md"
            radius="md"
            value={dateFilter.end}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.currentTarget.value;
              setDateFilter((prev) => ({ ...prev, end: val }));
            }}
          />
          <Group grow mt="xl">
            <Button
              variant="subtle"
              radius="xl"
              onClick={() => {
                setDateFilter({ start: '', end: '' });
                closeFilter();
              }}
            >
              Reset
            </Button>
            <Button radius="xl" onClick={closeFilter} color="blue">
              Apply
            </Button>
          </Group>
        </Stack>
      </Drawer>

      <ItemDetailModal item={selectedItem} opened={opened} onClose={close} isMobile={isMobile} />
    </Stack>
  );
}
