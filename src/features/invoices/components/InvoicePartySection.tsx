import { Autocomplete, Paper, SimpleGrid, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React, { useEffect, useState } from 'react';

import { Party } from '../../inventory/services/db';
import { invoiceService } from '../services/invoiceService';
import { QuickInvoiceFormValues } from './QuickInvoiceForm';

interface InvoicePartySectionProps {
  form: UseFormReturnType<QuickInvoiceFormValues>;
}

export const InvoicePartySection: React.FC<InvoicePartySectionProps> = ({ form }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [partyNames, setPartyNames] = useState<string[]>([]);

  useEffect(() => {
    invoiceService.searchParties('').then((data) => {
      setParties(data);
      setPartyNames(data.map((p) => p.name));
    });
  }, []);

  const handleOptionSubmit = async (val: string) => {
    const existing = parties.find((p) => p.name === val);
    if (existing) {
      form.setValues({
        partyId: existing.id,
        partyName: existing.name,
        partyAddress: existing.address || '',
        partyContact: existing.contact || '',
      });
    }
  };

  const handleSearchChange = async (val: string) => {
    form.setFieldValue('partyName', val);
    if (val.length > 1) {
      const results = await invoiceService.searchParties(val);
      setParties(results);
      setPartyNames(results.map((p) => p.name));
    }
  };

  return (
    <Paper p="md" radius="md" withBorder shadow="xs" mb="lg">
      <Title order={5} mb="md" c="dimmed" tt="uppercase" lts={1}>
        Party Details
      </Title>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        <Autocomplete
          label="Party Name"
          placeholder="Search or enter new party"
          data={partyNames}
          {...form.getInputProps('partyName')}
          onChange={handleSearchChange}
          onOptionSubmit={handleOptionSubmit}
          required
          data-autofocus
        />
        <TextInput
          label="Address"
          placeholder="Party Address"
          {...form.getInputProps('partyAddress')}
        />
        <TextInput
          label="Contact Number"
          placeholder="Phone or Mobile"
          {...form.getInputProps('partyContact')}
        />
      </SimpleGrid>
    </Paper>
  );
};
