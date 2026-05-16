import { Autocomplete, Avatar, Group, Paper, Text } from '@mantine/core';
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
      <Autocomplete
        placeholder="Search designs..."
        leftSection={<Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />}
        value={search}
        onChange={onSearchChange}
        data={designSuggestions.map((opt) => opt.value)}
        renderOption={({ option }) => {
          const richOption = designSuggestions.find((opt) => opt.value === option.value);
          return (
            <Group gap="sm">
              {richOption?.image ? (
                <SafeImage src={richOption.image} w={32} h={32} radius="sm" fit="cover" />
              ) : (
                <Avatar size={32} radius="sm" color="blue">
                  <Package size={16} />
                </Avatar>
              )}
              <Text size="sm" fw={500}>
                {option.value}
              </Text>
            </Group>
          );
        }}
        style={{ width: '100%' }}
        size="md"
        radius="xl"
        variant="filled"
        maxDropdownHeight={250}
        data-testid="inventory-search-input"
      />
    </Paper>
  );
}
