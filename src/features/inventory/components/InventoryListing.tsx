'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Center,
  Group,
  Image,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, Hash, IndianRupee, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { db, type InventoryItem } from '../services/db';

export function InventoryListing() {
  const items = useLiveQuery(() => db.inventory.orderBy('date').reverse().toArray());
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      await db.inventory.delete(Number(id));
      notifications.show({
        title: 'Deleted',
        message: 'Item removed from inventory',
        color: 'red',
      });
    }
  };

  if (!items) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (items.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center">
          <Text color="dimmed">No inventory items found.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" p="md">
        {items.map((item) => (
          <Card key={item.id} padding="md" radius="lg" withBorder shadow="sm">
            <Card.Section>
              <Image
                src={item.image}
                h={180}
                alt={item.designNo}
                fallbackSrc="https://placehold.co/600x400?text=No+Image"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedItem(item);
                  open();
                }}
              />
            </Card.Section>

            <Stack mt="md" gap="xs">
              <Group justify="space-between" align="flex-start">
                <Stack gap={0}>
                  <Text fw={700} size="lg">
                    {item.designNo}
                  </Text>
                  <Group gap={4} color="dimmed">
                    <Calendar size={14} />
                    <Text size="xs" color="dimmed">
                      {item.date}
                    </Text>
                  </Group>
                </Stack>
                <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={18} />
                </ActionIcon>
              </Group>

              <Group grow mt="sm">
                <Box
                  p="xs"
                  style={{
                    backgroundColor: 'var(--mantine-color-blue-0)',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Text size="xs" color="blue" fw={700} tt="uppercase">
                    Qty
                  </Text>
                  <Text fw={800} size="md">
                    {item.quantity}
                  </Text>
                </Box>
                <Box
                  p="xs"
                  style={{
                    backgroundColor: 'var(--mantine-color-green-0)',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Text size="xs" color="green" fw={700} tt="uppercase">
                    Price
                  </Text>
                  <Text fw={800} size="md">
                    ₹{item.price}
                  </Text>
                </Box>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Modal opened={opened} onClose={close} centered padding={0} radius="lg" size="lg">
        {selectedItem && (
          <Box>
            <Image src={selectedItem.image} alt={selectedItem.designNo} w="100%" />
            <Box p="md">
              <Title order={3}>{selectedItem.designNo}</Title>
              <Text color="dimmed" size="sm">
                Added on {selectedItem.date}
              </Text>
              <Group mt="md">
                <Badge size="xl" variant="light" leftSection={<Hash size={14} />}>
                  {selectedItem.quantity} Pcs
                </Badge>
                <Badge
                  size="xl"
                  variant="light"
                  color="green"
                  leftSection={<IndianRupee size={14} />}
                >
                  ₹{selectedItem.price} / Pc
                </Badge>
              </Group>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
}
