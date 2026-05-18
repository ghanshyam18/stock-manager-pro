'use client';

import { Box, Container, Group, Paper, Text, Title, Transition } from '@mantine/core';

import { AddStockForm } from '@/features/inventory/components/AddStockForm';
import { DataManagementCard } from '@/features/inventory/components/DataManagementCard';
import { InventoryView } from '@/features/inventory/components/InventoryView';
import { BottomNavigation } from '@/shared/components/BottomNavigation';
import { useNativeBack } from '@/shared/hooks/useNativeBack';
import { usePreventExit } from '@/shared/hooks/usePreventExit';
import { useUIStore } from '@/shared/store/useUIStore';

/**
 * Main Entry Point.
 * High-Class Refactor: Uses a flex-column layout to ensure the main content
 * can precisely fill the viewport for stable virtualization.
 */
export default function Home() {
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);

  // Prevent accidental exit
  usePreventExit(true);

  // Native back button tab navigation
  // If user is on 'add' tab, back button takes them to 'inventory'
  useNativeBack(activeTab === 'add', () => setActiveTab('inventory'), 'tab-navigation');

  return (
    <Box
      bg="var(--mantine-color-body)"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent double scrollbars
      }}
    >
      <Paper component="header" radius={0} py="xs" px="md" withBorder style={{ zIndex: 100 }}>
        <Container size="sm">
          <Group justify="space-between" align="center">
            <Text
              component="h1"
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              style={{ letterSpacing: '-0.5px' }}
            >
              Stockly
            </Text>
          </Group>
        </Container>
      </Paper>

      <Box component="main" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <Container
          size="sm"
          px="xs"
          py="md"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Inventory View (Unified Dashboard + Listing) */}
          {activeTab === 'inventory' && (
            <Transition mounted={activeTab === 'inventory'} transition="fade" duration={300}>
              {(styles) => (
                <Box
                  style={{ ...styles, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <InventoryView />
                </Box>
              )}
            </Transition>
          )}

          {/* Add Stock View */}
          {activeTab === 'add' && (
            <Transition mounted={activeTab === 'add'} transition="fade" duration={300}>
              {(styles) => (
                <Box style={{ ...styles, flexGrow: 1, overflowY: 'auto', paddingBottom: '80px' }}>
                  <Paper p="lg" radius="lg" shadow="md" withBorder bg="var(--mantine-color-body)">
                    <Title order={2} mb="xl" px="xs" fw={900}>
                      Add New Stock
                    </Title>
                    <AddStockForm onClear={() => setActiveTab('inventory')} />
                  </Paper>

                  <DataManagementCard />
                </Box>
              )}
            </Transition>
          )}
        </Container>
      </Box>

      <BottomNavigation />
    </Box>
  );
}
