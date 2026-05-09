import { Autocomplete, Paper } from '@mantine/core';
import { Search } from 'lucide-react';

interface InventorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  designSuggestions: string[];
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
        data={designSuggestions}
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
