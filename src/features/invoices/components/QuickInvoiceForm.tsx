import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Calendar, Save } from 'lucide-react';
import React, { useState } from 'react';

import { invoiceService } from '../services/invoiceService';
import { downloadInvoicePdf } from '../utils/downloadInvoicePdf';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoicePartySection } from './InvoicePartySection';

export interface QuickInvoiceFormValues {
  partyId?: number;
  partyName: string;
  partyAddress: string;
  partyContact: string;
  dispatchedThrough: string;
  date: string;
  discountPercentage: number;
  taxPercentage: number;
  items: {
    designNo: string;
    quantity: number;
    unitPrice: number;
    thumbnailUrl?: Blob | string;
  }[];
}

export const QuickInvoiceForm: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<QuickInvoiceFormValues>({
    initialValues: {
      partyId: undefined,
      partyName: '',
      partyAddress: '',
      partyContact: '',
      dispatchedThrough: '',
      date: new Date().toISOString().split('T')[0],
      discountPercentage: 3,
      taxPercentage: 0,
      items: [{ designNo: '', quantity: 1, unitPrice: 0, thumbnailUrl: '' }],
    },
    validate: {
      partyName: (val) => (val.trim().length > 0 ? null : 'Required'),
      items: {
        designNo: (val) => (val.trim().length > 0 ? null : 'Required'),
        quantity: (val) => (val > 0 ? null : '> 0'),
      },
    },
  });

  const totals = React.useMemo(() => {
    const { items, discountPercentage, taxPercentage } = form.values;
    const subtotal = items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );
    const discountAmount = Math.round((subtotal * (Number(discountPercentage) || 0)) / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = Math.round((afterDiscount * (Number(taxPercentage) || 0)) / 100);
    const grandTotal = Math.round(afterDiscount + taxAmount);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
    };
  }, [form.values.items, form.values.discountPercentage, form.values.taxPercentage]);

  const handleSubmit = async (values: typeof form.values) => {
    setIsSaving(true);
    try {
      const { items, partyName, partyAddress, partyContact, partyId, ...invoiceData } = values;

      const invoice = await invoiceService.saveInvoice(
        {
          ...invoiceData,
          ...totals,
          partyId,
          partyName,
          partyAddress,
          partyContact,
        },
        items.map((i) => ({
          designNo: i.designNo,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
        })),
        { name: partyName, address: partyAddress, contact: partyContact }
      );

      // Instant Download
      await downloadInvoicePdf(invoice.id!);

      notifications.show({
        title: 'Success',
        message: 'Invoice generated and downloaded successfully!',
        color: 'green',
      });

      // Seamless reset
      form.reset();
      form.setFieldValue('items', [{ designNo: '', quantity: 1, unitPrice: 0, thumbnailUrl: '' }]);
    } catch (error) {
      console.error('Failed to save invoice', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to generate invoice',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title order={2} mb="lg">
        New Quick Invoice
      </Title>

      <InvoicePartySection form={form} />

      <Paper p="md" radius="md" withBorder shadow="xs" mb="lg">
        <Title order={5} mb="md" c="dimmed" tt="uppercase" lts={1}>
          Invoice Details
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Date"
              type="date"
              leftSection={<Calendar size={18} strokeWidth={1.5} />}
              {...form.getInputProps('date')}
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Dispatched Through"
              placeholder="e.g. Courier, Transport"
              {...form.getInputProps('dispatchedThrough')}
              size="md"
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <InvoiceItemsTable form={form} />

      <Paper p="md" radius="md" withBorder shadow="xs" mb={100}>
        <Title order={5} mb="md" c="dimmed" tt="uppercase" lts={1}>
          Calculations & Totals
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <NumberInput
                label="Discount (%)"
                min={0}
                max={100}
                size="md"
                {...form.getInputProps('discountPercentage')}
              />
              <NumberInput
                label="Tax (%)"
                min={0}
                max={100}
                size="md"
                {...form.getInputProps('taxPercentage')}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              withBorder
              style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}
              p="lg"
              radius="md"
              mt={{ base: 'md', md: 0 }}
            >
              <Stack gap="sm">
                <Flex justify="space-between">
                  <Text size="md">Subtotal:</Text>
                  <Text size="md" fw={500}>
                    ₹{totals.subtotal.toFixed(2)}
                  </Text>
                </Flex>
                <Flex justify="space-between" c="red.7">
                  <Text size="md">Discount ({form.values.discountPercentage}%):</Text>
                  <Text size="md" fw={500}>
                    -₹{totals.discountAmount.toFixed(2)}
                  </Text>
                </Flex>
                <Flex justify="space-between" c="blue.7">
                  <Text size="md">Tax ({form.values.taxPercentage}%):</Text>
                  <Text size="md" fw={500}>
                    +₹{totals.taxAmount.toFixed(2)}
                  </Text>
                </Flex>
                <Divider my="sm" />
                <Flex justify="space-between" align="center">
                  <Text size="lg" fw={700}>
                    Grand Total:
                  </Text>
                  <Text size="xl" fw={800} c="blue.6">
                    ₹{totals.grandTotal.toFixed(2)}
                  </Text>
                </Flex>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      <Box
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        p="md"
        bg="var(--mantine-color-body)"
        style={{
          borderTop: '1px solid var(--mantine-color-default-border)',
          zIndex: 100,
          boxShadow: 'var(--mantine-shadow-sm)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        }}
      >
        <Box maw={1200} mx="auto">
          {/* Mobile Footer */}
          <Stack gap="xs" hiddenFrom="sm" w="100%">
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={1}>
                Total Due
              </Text>
              <Title order={4} c="blue.7">
                ₹{totals.grandTotal.toFixed(2)}
              </Title>
            </Group>
            <Button
              type="submit"
              size="md"
              fullWidth
              radius="md"
              leftSection={<Save size={18} />}
              loading={isSaving}
            >
              Save & Download PDF
            </Button>
          </Stack>

          <Group justify="space-between" align="center" visibleFrom="sm" w="100%">
            <Text fw={600} size="xl">
              Total Due:{' '}
              <Text span c="blue.6" fw={700}>
                ₹{totals.grandTotal.toFixed(2)}
              </Text>
            </Text>
            <Button
              type="submit"
              size="lg"
              radius="md"
              leftSection={<Save size={20} />}
              loading={isSaving}
            >
              Save & Download PDF
            </Button>
          </Group>
        </Box>
      </Box>
    </form>
  );
};
