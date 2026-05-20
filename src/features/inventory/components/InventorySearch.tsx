import { Autocomplete, Avatar, Box, Group, Paper, Text } from '@mantine/core';
import { Package, Search } from 'lucide-react';

import { SafeImage } from '@/shared/components/SafeImage';

interface InventorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  designSuggestions: Array<{ value: string; image?: Blob | string | null }>;
}

export function InventorySearch({
  search,
  onSearchChange,
  designSuggestions,
}: InventorySearchProps) {
  return (
    <Paper
      p="xs"
      radius="md"
      withBorder
      shadow="xs"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-default-border)',
      }}
    >
      <Autocomplete
        placeholder="Search designs..."
        leftSection={<Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />}
        value={search}
        onChange={onSearchChange}
        data={designSuggestions.map((opt) => opt.value)}
        renderOption={({ option }) => {
          const richOption = designSuggestions.find((opt) => opt.value === option.value);
          return (
            <Group gap="sm" wrap="nowrap">
              {richOption?.image ? (
                <Box style={{ flexShrink: 0 }}>
                  <SafeImage src={richOption.image} w={32} h={32} radius="sm" fit="cover" />
                </Box>
              ) : (
                <Avatar size={32} radius="sm" color="blue">
                  <Package size={16} />
                </Avatar>
              )}
              <Text size="sm" fw={700} truncate>
                {option.value}
              </Text>
            </Group>
          );
        }}
        size="md"
        radius="md"
        variant="filled"
        maxDropdownHeight={250}
        data-testid="inventory-search-input"
      />
    </Paper>
  );
}
