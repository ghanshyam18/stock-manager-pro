'use client';

import { Box, Container, Group, Paper, Text, Transition } from '@mantine/core';

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
      h="100dvh"
      className="accelerated"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent double scrollbars
      }}
    >
      <Paper component="header" radius={0} py="sm" px="md" withBorder style={{ zIndex: 100 }}>
        <Group justify="space-between" align="center">
          <Text
            component="h1"
            size="lg"
            fw={900}
            variant="gradient"
            gradient={{ from: 'brand.6', to: 'brand.8' }}
          >
            Stockly
          </Text>
        </Group>
      </Paper>

      <Box component="main" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <Container
          size="sm"
          px="md"
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
                <Box style={{ ...styles, flexGrow: 1, overflowY: 'auto', paddingBottom: '90px' }}>
                  <Paper p="lg" radius="lg" withBorder bg="var(--mantine-color-body)">
                    <Text component="h2" size="xl" fw={900} mb="lg" px="xs">
                      Add New Stock
                    </Text>
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
