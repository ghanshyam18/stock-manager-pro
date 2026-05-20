import { Autocomplete, Grid, Paper, Text, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React, { useEffect, useState } from 'react';

import { db } from '../../inventory/services/db';
import { QuickInvoiceFormValues } from './QuickInvoiceForm';

interface InvoicePartySectionProps {
  form: UseFormReturnType<QuickInvoiceFormValues>;
}

export const InvoicePartySection: React.FC<InvoicePartySectionProps> = ({ form }) => {
  const [parties, setParties] = useState<
    Array<{ id: number; name: string; address: string; contact: string }>
  >([]);

  useEffect(() => {
    db.parties
      .toArray()
      .then((arr) => {
        setParties(
          arr.map((p) => ({
            id: p.id!,
            name: p.name,
            address: p.address || '',
            contact: p.contact || '',
          }))
        );
      })
      .catch((err) => {
        console.error('Failed to load parties:', err);
      });
  }, []);

  const handleOptionSubmit = (val: string) => {
    const selected = parties.find((p) => p.name === val);
    if (selected) {
      form.setFieldValue('partyId', selected.id);
      form.setFieldValue('partyName', selected.name);
      form.setFieldValue('partyAddress', selected.address);
      form.setFieldValue('partyContact', selected.contact);
    }
  };

  const handleTextChange = (val: string) => {
    form.setFieldValue('partyName', val);
    // If name doesn't match an existing party, clear the partyId so it creates/updates properly
    const selected = parties.find((p) => p.name === val);
    if (!selected) {
      form.setFieldValue('partyId', undefined);
    }
  };

  return (
    <Paper p="md" radius="lg" withBorder shadow="xs">
      <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1} mb="md">
        Customer Details
      </Text>
      <Grid gap="md">
        <Grid.Col span={12}>
          <Autocomplete
            label="Customer / Party Name"
            placeholder="Search or enter party name"
            data={parties.map((p) => p.name)}
            value={form.values.partyName}
            onChange={handleTextChange}
            onOptionSubmit={handleOptionSubmit}
            required
            size="md"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Party Address"
            placeholder="Enter party address"
            {...form.getInputProps('partyAddress')}
            size="md"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Contact Number"
            placeholder="Enter contact number"
            {...form.getInputProps('partyContact')}
            size="md"
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
