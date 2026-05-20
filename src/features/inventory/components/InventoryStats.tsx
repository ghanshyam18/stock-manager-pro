import {
  Box,
  Collapse,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, IndianRupee, Package, TrendingUp } from 'lucide-react';
import { memo } from 'react';

import { type StatsData } from '@/types/shared.types';

interface InventoryStatsProps {
  stats: StatsData | null;
}

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  suffix: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  isLoading: boolean;
}

const StatCard = memo(({ label, value, suffix, icon: Icon, color, isLoading }: StatCardProps) => {
  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      shadow="xs"
      bg="var(--mantine-color-body)"
      data-testid={`stat-card-${label.toLowerCase().replace(' ', '-')}`}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" fw={800} tt="uppercase" lts={1}>
            {label}
          </Text>
          <Group gap="xs" align="baseline">
            {isLoading ? (
              <Skeleton h={24} w="60%" radius="sm" animate />
            ) : (
              <>
                <Text size="xl" fw={900}>
                  {value}
                </Text>
                <Text size="xs" fw={700} c="dimmed">
                  {suffix}
                </Text>
              </>
            )}
          </Group>
        </Stack>
        <Box
          p="xs"
          style={{
            backgroundColor: `var(--mantine-color-${color}-light)`,
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Icon size={18} color={`var(--mantine-color-${color}-light-color)`} strokeWidth={2.5} />
        </Box>
      </Group>
    </Paper>
  );
});

StatCard.displayName = 'StatCard';

export function InventoryStats({ stats }: InventoryStatsProps) {
  const [statsOpened, { toggle: toggleStats }] = useDisclosure(false);

  const isLoading = !stats;

  const statsConfig = [
    {
      label: 'Total Stock',
      value: stats?.totalQty.toLocaleString(),
      icon: Package,
      color: 'blue',
      suffix: ' Pcs',
    },
    {
      label: 'Total Value',
      value: stats?.totalValue ? `₹${stats.totalValue.toLocaleString()}` : undefined,
      icon: IndianRupee,
      color: 'green',
      suffix: '',
    },
    {
      label: 'Unique Designs',
      value: stats?.uniqueDesigns,
      icon: TrendingUp,
      color: 'violet',
      suffix: '',
    },
  ] as const;

  return (
    <Box>
      <Paper withBorder radius="md" shadow="xs" style={{ overflow: 'hidden' }}>
        <UnstyledButton
          onClick={toggleStats}
          w="100%"
          p="md"
          aria-label="Toggle statistics dashboard"
          aria-expanded={statsOpened}
          style={{
            backgroundColor: 'var(--mantine-color-body)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left',
          }}
          data-testid="stats-accordion-toggle"
        >
          <Group gap="sm">
            <TrendingUp size={18} color="var(--mantine-color-blue-6)" />
            <Text fw={800} size="sm">
              Current Results Insights
            </Text>
          </Group>
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: statsOpened ? 'rotate(180deg)' : 'none',
              color: 'var(--mantine-color-gray-5)',
            }}
          />
        </UnstyledButton>
      </Paper>

      <Collapse expanded={statsOpened} mt="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {statsConfig.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              color={stat.color}
              isLoading={isLoading}
            />
          ))}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
}
