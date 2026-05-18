import {
  ActionIcon,
  Autocomplete,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { SafeImage } from '@/shared/components/SafeImage';

import { db } from '../../inventory/services/db';
import { invoiceService } from '../services/invoiceService';
import { QuickInvoiceFormValues } from './QuickInvoiceForm';

interface InvoiceItemsTableProps {
  form: UseFormReturnType<QuickInvoiceFormValues>;
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ form }) => {
  const [designNos, setDesignNos] = useState<string[]>([]);

  useEffect(() => {
    db.designs
      .orderBy('designNo')
      .keys()
      .then((keys) => {
        setDesignNos(keys.map(String));
      })
      .catch((err) => {
        console.error('Failed to fetch design keys:', err);
      });
  }, []);

  const handleOptionSubmit = async (index: number, val: string) => {
    const design = await invoiceService.getDesign(val);
    if (design && design.image) {
      form.setFieldValue(`items.${index}.thumbnailUrl`, design.image);
    }
  };

  const handleRemove = (index: number) => {
    if (form.values.items.length > 1) {
      form.removeListItem('items', index);
    }
  };

  const desktopTable = (
    <Table.ScrollContainer minWidth={600} visibleFrom="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={60}>Image</Table.Th>
            <Table.Th>Design No</Table.Th>
            <Table.Th w={120}>Quantity</Table.Th>
            <Table.Th w={150}>Unit Price</Table.Th>
            <Table.Th w={150}>Total</Table.Th>
            <Table.Th w={50}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {form.values.items.map((item, index: number) => {
            const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            return (
              <Table.Tr key={index}>
                <Table.Td>
                  {item.thumbnailUrl ? (
                    <SafeImage
                      src={item.thumbnailUrl}
                      w={40}
                      h={40}
                      radius="sm"
                      alt="Thumb"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <Text size="xs" c="dimmed">
                      No Image
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Autocomplete
                    placeholder="Design No"
                    data={designNos}
                    {...form.getInputProps(`items.${index}.designNo`)}
                    onOptionSubmit={(val) => handleOptionSubmit(index, val)}
                    required
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    placeholder="Qty"
                    min={1}
                    {...form.getInputProps(`items.${index}.quantity`)}
                    required
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    placeholder="Price"
                    min={0}
                    decimalScale={2}
                    {...form.getInputProps(`items.${index}.unitPrice`)}
                    required
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{rowTotal.toFixed(2)}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    onClick={() => handleRemove(index)}
                    disabled={form.values.items.length === 1}
                  >
                    <Trash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );

  const mobileCards = (
    <Stack hiddenFrom="md" gap="md">
      {form.values.items.map((item, index: number) => {
        const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
        return (
          <Card key={index} withBorder shadow="sm" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Item #{index + 1}</Text>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => handleRemove(index)}
                disabled={form.values.items.length === 1}
              >
                <Trash size={18} />
              </ActionIcon>
            </Group>

            <Grid>
              <Grid.Col span={12}>
                <Autocomplete
                  label="Design No"
                  placeholder="Design No"
                  data={designNos}
                  {...form.getInputProps(`items.${index}.designNo`)}
                  onOptionSubmit={(val) => handleOptionSubmit(index, val)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Qty"
                  min={1}
                  {...form.getInputProps(`items.${index}.quantity`)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Price"
                  min={0}
                  decimalScale={2}
                  {...form.getInputProps(`items.${index}.unitPrice`)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Group
                  justify="space-between"
                  mt="xs"
                  p="xs"
                  bg="gray.0"
                  style={{ borderRadius: 6 }}
                >
                  <Text size="sm" fw={600} c="dimmed">
                    Item Total
                  </Text>
                  <Text fw={700} c="blue.7" size="lg">
                    ₹{rowTotal.toFixed(2)}
                  </Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>
        );
      })}
    </Stack>
  );

  return (
    <Paper p="md" radius="md" withBorder shadow="xs" mb="lg">
      <Title order={5} mb="md" c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        Products / Designs
      </Title>
      {desktopTable}
      {mobileCards}

      <Group justify="center" mt="md">
        <Button
          variant="light"
          leftSection={<Plus size={16} />}
          onClick={() =>
            form.insertListItem('items', {
              designNo: '',
              quantity: 1,
              unitPrice: 0,
              thumbnailUrl: '',
            })
          }
          fullWidth
        >
          Add Another Item
        </Button>
      </Group>
    </Paper>
  );
};
