import { ActionIcon, Autocomplete, Group, Indicator, Paper } from '@mantine/core';
import { Filter, Search } from 'lucide-react';

interface InventorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  designSuggestions: string[];
  isFilterActive: boolean;
  onFilterClick: () => void;
}

export function InventorySearch({
  search,
  onSearchChange,
  designSuggestions,
  isFilterActive,
  onFilterClick,
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
      <Group gap="xs" wrap="nowrap">
        <Autocomplete
          placeholder="Search designs..."
          leftSection={<Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />}
          value={search}
          onChange={onSearchChange}
          data={designSuggestions}
          style={{ flex: 1 }}
          size="md"
          radius="xl"
          variant="filled"
          maxDropdownHeight={250}
          data-testid="inventory-search-input"
        />
        <Indicator disabled={!isFilterActive} color="blue" size={12} offset={4} processing>
          <ActionIcon
            size="44px"
            variant={isFilterActive ? 'filled' : 'light'}
            radius="xl"
            onClick={onFilterClick}
            color="blue"
            data-testid="open-filters-button"
          >
            <Filter size={20} strokeWidth={2} />
          </ActionIcon>
        </Indicator>
      </Group>
    </Paper>
  );
}
