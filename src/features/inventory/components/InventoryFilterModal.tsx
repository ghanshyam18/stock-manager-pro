'use client';

import { Button, Divider, FileButton, Group, Stack, Text, TextInput } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { Download, Upload } from 'lucide-react';

import { useNativeBack } from '@/shared/hooks/useNativeBack';

interface InventoryFilterModalProps {
  dateFilter: { start: string; end: string };
  setDateFilter: (filter: { start: string; end: string }) => void;
  onExport: () => void;
  onImport: (file: File | null) => void;
}

/**
 * InventoryFilterModal handles date filtering and data management actions.
 * Refactored as a Context Modal for cleaner architecture.
 * Supports "Back button to close" on mobile.
 */
export function InventoryFilterModal({
  context,
  id,
  innerProps,
}: ContextModalProps<InventoryFilterModalProps>) {
  const { dateFilter, setDateFilter, onExport, onImport } = innerProps;

  // Handle mobile back button
  useNativeBack(true, () => context.closeModal(id), 'inventory-filters');

  return (
    <Stack gap="md" p="md">
      <Stack gap="xs">
        <Text size="xs" fw={800} c="dimmed" lts={1} ml="xs">
          DATE RANGE
        </Text>
        <TextInput
          placeholder="Start Date"
          type="date"
          size="md"
          radius="md"
          value={dateFilter.start}
          onChange={(e) => setDateFilter({ ...dateFilter, start: e.currentTarget.value })}
          data-testid="filter-start-date"
        />
        <TextInput
          placeholder="End Date"
          type="date"
          size="md"
          radius="md"
          value={dateFilter.end}
          onChange={(e) => setDateFilter({ ...dateFilter, end: e.currentTarget.value })}
          data-testid="filter-end-date"
        />
      </Stack>

      <Group grow mt="xs">
        <Button
          variant="subtle"
          radius="xl"
          size="md"
          onClick={() => {
            setDateFilter({ start: '', end: '' });
            context.closeModal(id);
          }}
          data-testid="reset-filters-button"
        >
          Reset
        </Button>
        <Button
          radius="xl"
          size="md"
          onClick={() => context.closeModal(id)}
          color="blue"
          data-testid="apply-filters-button"
        >
          Apply
        </Button>
      </Group>

      <Divider
        my="sm"
        label={
          <Text size="xs" fw={800} c="dimmed" lts={1}>
            DATA MANAGEMENT
          </Text>
        }
        labelPosition="center"
      />

      <Stack gap="sm">
        <Button
          variant="light"
          color="blue"
          fullWidth
          size="md"
          leftSection={<Download size={18} />}
          radius="xl"
          onClick={() => {
            onExport();
            context.closeModal(id);
          }}
        >
          Export Database (JSON)
        </Button>

        <FileButton
          onChange={(file) => {
            onImport(file);
            context.closeModal(id);
          }}
          accept="application/json"
        >
          {(props) => (
            <Button
              {...props}
              variant="light"
              color="teal"
              fullWidth
              size="md"
              leftSection={<Upload size={18} />}
              radius="xl"
            >
              Import Database (JSON)
            </Button>
          )}
        </FileButton>
      </Stack>

      <Text size="xs" c="dimmed" style={{ textAlign: 'center' }} px="xl">
        Importing will merge with existing records. Large datasets are processed in chunks for
        stability.
      </Text>
    </Stack>
  );
}
