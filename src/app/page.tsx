'use client';

import { Box, Container, Group, Paper, Text, Title, Transition } from '@mantine/core';

import { AddStockForm } from '@/features/inventory/components/AddStockForm';
import { InventoryView } from '@/features/inventory/components/InventoryView';
import { BottomNavigation } from '@/shared/components/BottomNavigation';
import { usePreventExit } from '@/shared/hooks/usePreventExit';
import { useUIStore } from '@/shared/store/useUIStore';

/**
 * Main Entry Point.
 * High-Class Refactor: Uses a flex-column layout to ensure the main content
 * can precisely fill the viewport for stable virtualization.
 */
export default function Home() {
  const { activeTab, setActiveTab } = useUIStore();

  // Prevent accidental exit
  usePreventExit(true);

  return (
    <Box
      bg="gray.1"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent double scrollbars
      }}
    >
      <header
        style={{
          padding: '12px 16px',
          backgroundColor: 'white',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          zIndex: 200,
        }}
      >
        <Container size="sm">
          <Group justify="space-between" align="center">
            <Text
              component="h1"
              size="24px"
              fw={900}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              style={{ letterSpacing: '-0.5px' }}
            >
              Stockly
            </Text>
          </Group>
        </Container>
      </header>

      <main style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
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
                  <Paper p="lg" radius="24px" shadow="md" withBorder bg="white">
                    <Title order={2} mb="xl" px="xs" fw={900}>
                      Add New Stock
                    </Title>
                    <AddStockForm onClear={() => setActiveTab('inventory')} />
                  </Paper>
                </Box>
              )}
            </Transition>
          )}
        </Container>
      </main>

      <BottomNavigation />
    </Box>
  );
}
