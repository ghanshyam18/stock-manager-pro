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

interface StatsData {
  totalQty: number;
  totalValue: number;
  uniqueDesigns: number;
  totalCount: number;
}

interface InventoryStatsProps {
  stats: StatsData | null;
}

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
      value: `₹${stats?.totalValue.toLocaleString()}`,
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
    <Box px="xs">
      <UnstyledButton
        onClick={toggleStats}
        w="100%"
        p="xs"
        style={{
          backgroundColor: 'var(--mantine-color-body)',
          borderRadius: 'var(--mantine-radius-md)',
          border: '1px solid var(--mantine-color-default-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            transition: 'transform 0.3s ease',
            transform: statsOpened ? 'rotate(180deg)' : 'none',
          }}
        />
      </UnstyledButton>

      <Collapse expanded={statsOpened} mt="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {statsConfig.map((stat) => (
            <Paper
              key={stat.label}
              p="md"
              radius="lg"
              withBorder
              shadow="sm"
              bg="var(--mantine-color-body)"
              data-testid={`stat-card-${stat.label.toLowerCase().replace(' ', '-')}`}
            >
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={2} style={{ flex: 1 }}>
                  <Text size="xs" color="dimmed" fw={800} tt="uppercase" lts={1}>
                    {stat.label}
                  </Text>
                  <Group gap={4} align="baseline">
                    {isLoading ? (
                      <Skeleton h={24} w="60%" radius="sm" animate />
                    ) : (
                      <>
                        <Text size="20px" fw={900}>
                          {stat.value}
                        </Text>
                        <Text size="xs" fw={700} color="dimmed">
                          {stat.suffix}
                        </Text>
                      </>
                    )}
                  </Group>
                </Stack>
                <Box
                  p="xs"
                  style={{
                    backgroundColor: `var(--mantine-color-${stat.color}-light)`,
                    borderRadius: '12px',
                  }}
                >
                  <stat.icon
                    size={20}
                    color={`var(--mantine-color-${stat.color}-light-color)`}
                    strokeWidth={2.5}
                  />
                </Box>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
}
