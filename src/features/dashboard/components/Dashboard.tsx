'use client';

import {
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { IndianRupee, Package, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { db } from '@/features/inventory/services/db';

export function Dashboard() {
  const [search, setSearch] = useState('');

  const items = useLiveQuery(() => {
    if (!search) return db.inventory.toArray();
    return db.inventory
      .filter((item) => item.designNo.toLowerCase().includes(search.toLowerCase()))
      .toArray();
  }, [search]);

  const stats = items
    ? {
        totalQty: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
        uniqueDesigns: new Set(items.map((i) => i.designNo)).size,
      }
    : { totalQty: 0, totalValue: 0, uniqueDesigns: 0 };

  // Group by Design No
  const groupedItems = items
    ? items.reduce(
        (acc, item) => {
          if (!acc[item.designNo]) {
            acc[item.designNo] = {
              qty: 0,
              value: 0,
              entries: 0,
              latestDate: item.date,
            };
          }
          acc[item.designNo].qty += item.quantity;
          acc[item.designNo].value += item.quantity * item.price;
          acc[item.designNo].entries += 1;
          if (new Date(item.date) > new Date(acc[item.designNo].latestDate)) {
            acc[item.designNo].latestDate = item.date;
          }
          return acc;
        },
        {} as Record<string, { qty: number; value: number; entries: number; latestDate: string }>
      )
    : {};

  return (
    <Stack p="md" gap="lg">
      <Title order={2} fw={800}>
        Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Paper
          p="md"
          radius="lg"
          withBorder
          shadow="xs"
          style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}
        >
          <Group justify="space-between">
            <Text size="sm" color="dimmed" fw={700}>
              TOTAL QUANTITY
            </Text>
            <Package size={20} color="var(--mantine-color-blue-6)" />
          </Group>
          <Text size="xl" fw={800} mt={5}>
            {stats.totalQty}
          </Text>
        </Paper>

        <Paper
          p="md"
          radius="lg"
          withBorder
          shadow="xs"
          style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}
        >
          <Group justify="space-between">
            <Text size="sm" color="dimmed" fw={700}>
              TOTAL VALUE
            </Text>
            <IndianRupee size={20} color="var(--mantine-color-green-6)" />
          </Group>
          <Text size="xl" fw={800} mt={5}>
            ₹{stats.totalValue.toLocaleString()}
          </Text>
        </Paper>

        <Paper
          p="md"
          radius="lg"
          withBorder
          shadow="xs"
          style={{ borderLeft: '4px solid var(--mantine-color-violet-6)' }}
        >
          <Group justify="space-between">
            <Text size="sm" color="dimmed" fw={700}>
              UNIQUE DESIGNS
            </Text>
            <TrendingUp size={20} color="var(--mantine-color-violet-6)" />
          </Group>
          <Text size="xl" fw={800} mt={5}>
            {stats.uniqueDesigns}
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper p="md" radius="lg" withBorder shadow="sm">
        <TextInput
          placeholder="Search by Design No..."
          leftSection={<Search size={18} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          size="md"
          radius="md"
        />
      </Paper>

      <Stack gap="md">
        <Title order={4}>Design Summary</Title>
        {Object.entries(groupedItems).length === 0 ? (
          <Text color="dimmed" ta="center" py="xl">
            No designs matching your search.
          </Text>
        ) : (
          Object.entries(groupedItems).map(([designNo, data]) => (
            <Paper key={designNo} p="md" radius="md" withBorder shadow="xs">
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={700} size="lg">
                    {designNo}
                  </Text>
                  <Text size="xs" color="dimmed">
                    Latest: {data.latestDate}
                  </Text>
                </Stack>
                <Badge variant="light" size="lg">
                  {data.entries} Entries
                </Badge>
              </Group>
              <Divider my="sm" variant="dotted" />
              <Group grow>
                <Box>
                  <Text size="xs" color="dimmed">
                    Total Qty
                  </Text>
                  <Text fw={700}>{data.qty}</Text>
                </Box>
                <Box>
                  <Text size="xs" color="dimmed">
                    Total Value
                  </Text>
                  <Text fw={700}>₹{data.value.toLocaleString()}</Text>
                </Box>
              </Group>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
}
