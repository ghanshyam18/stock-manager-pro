'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, X } from 'lucide-react';

import { formatDate, formatTime } from '@/shared/utils/date';

import { db, type InventoryItem } from '../services/db';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  opened: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function ItemDetailModal({ item, opened, onClose, isMobile }: ItemDetailModalProps) {
  const history = useLiveQuery(
    () => (item ? db.inventory.where('designNo').equals(item.designNo).sortBy('date') : []),
    [item]
  );

  if (!item) return null;

  const totalStock = history?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={isMobile}
      size="lg"
      padding={0}
      radius="lg"
      withCloseButton={false}
      zIndex={1000}
      styles={{
        body: { height: '100%', backgroundColor: 'var(--mantine-color-gray-0)' },
      }}
    >
      <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Group
          p="md"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--mantine-color-gray-2)',
          }}
          justify="space-between"
          wrap="nowrap"
        >
          <ActionIcon variant="subtle" size="lg" onClick={onClose} radius="xl" color="gray">
            <X size={24} />
          </ActionIcon>
          <Title order={4} fw={800}>
            Item Details
          </Title>
          <Box w={32} />
        </Group>

        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Image
            src={item.image}
            alt={item.designNo}
            w="100%"
            h={isMobile ? 320 : 450}
            style={{ objectFit: 'cover' }}
          />

          <Stack p="md" pb="xl" gap="xl" mt="-32px" style={{ position: 'relative', zIndex: 10 }}>
            <Paper p="lg" radius="24px" shadow="md" withBorder>
              <Stack gap="xl">
                <Box>
                  <Badge variant="dot" size="sm" mb={4}>
                    Active Design
                  </Badge>
                  <Title order={2} fw={900}>
                    {item.designNo}
                  </Title>
                </Box>

                <Group grow gap="md">
                  <Box
                    p="md"
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: '16px',
                      border: '1px solid var(--mantine-color-gray-1)',
                    }}
                  >
                    <Text size="xs" color="dimmed" tt="uppercase" fw={800} lts={1}>
                      Entries
                    </Text>
                    <Text fw={900} size="xl">
                      {history?.length || 0}
                    </Text>
                  </Box>
                  <Box
                    p="md"
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-0)',
                      borderRadius: '16px',
                      border: '1px solid var(--mantine-color-blue-1)',
                    }}
                  >
                    <Text size="xs" color="blue.7" tt="uppercase" fw={800} lts={1}>
                      Total Stock
                    </Text>
                    <Text fw={900} size="xl" color="blue.9">
                      {totalStock}
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>

            <Stack gap="md">
              <Group justify="space-between" px="xs">
                <Title order={4} fw={800}>
                  Transaction History
                </Title>
                <Badge variant="light" color="gray">
                  {history?.length} Records
                </Badge>
              </Group>

              <Stack gap="xs">
                {history?.map((entry) => (
                  <Paper
                    key={entry.id}
                    p="sm"
                    radius="lg"
                    withBorder
                    shadow="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-white)',
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm">
                        <Center
                          w={36}
                          h={36}
                          style={{
                            backgroundColor: 'var(--mantine-color-gray-0)',
                            borderRadius: '10px',
                          }}
                        >
                          <Calendar size={18} color="var(--mantine-color-gray-6)" />
                        </Center>
                        <Stack gap={0}>
                          <Text size="sm" fw={800}>
                            {formatDate(entry.date)}
                          </Text>
                          <Text size="xs" color="dimmed" fw={500}>
                            {formatTime(entry.createdAt)}
                          </Text>
                        </Stack>
                      </Group>
                      <Stack align="flex-end" gap={2}>
                        <Badge size="md" radius="sm" color="blue" variant="light" fw={900}>
                          +{entry.quantity}
                        </Badge>
                        <Text size="xs" fw={800} color="green.8">
                          ₹{entry.price}
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
