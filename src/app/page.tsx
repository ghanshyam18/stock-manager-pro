'use client';

import { Box, Container, Paper, Text, Title, Transition } from '@mantine/core';

import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { AddStockForm } from '@/features/inventory/components/AddStockForm';
import { InventoryListing } from '@/features/inventory/components/InventoryListing';
import { BottomNavigation } from '@/shared/components/BottomNavigation';
import { usePreventExit } from '@/shared/hooks/usePreventExit';
import { useUIStore } from '@/shared/store/useUIStore';

export default function Home() {
  const { activeTab, setActiveTab } = useUIStore();

  // Prevent accidental exit
  usePreventExit(true);

  return (
    <Box mih="100vh" bg="gray.1">
      <header
        style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          position: 'sticky',
          top: 0,
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

      <main style={{ paddingBottom: '100px' }}>
        <Container size="sm" px="xs" py="md">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <Transition mounted={activeTab === 'dashboard'} transition="fade" duration={300}>
              {(styles) => (
                <Box style={styles}>
                  <Dashboard />
                </Box>
              )}
            </Transition>
          )}

          {/* Add Stock View */}
          {activeTab === 'add' && (
            <Transition mounted={activeTab === 'add'} transition="fade" duration={300}>
              {(styles) => (
                <Box style={styles}>
                  <Paper p="lg" radius="24px" shadow="md" withBorder bg="white">
                    <Title order={2} mb="xl" px="xs" fw={900}>
                      Add New Stock
                    </Title>
                    <AddStockForm onClear={() => setActiveTab('listing')} />
                  </Paper>
                </Box>
              )}
            </Transition>
          )}

          {/* Inventory Listing View */}
          {activeTab === 'listing' && (
            <Transition mounted={activeTab === 'listing'} transition="fade" duration={300}>
              {(styles) => (
                <Box style={styles}>
                  <Box mb="md" px="xs">
                    <Title order={1} fw={900} size="h2">
                      Inventory History
                    </Title>
                    <Text color="dimmed" size="sm" fw={500}>
                      Track all stock changes and entries
                    </Text>
                  </Box>
                  <InventoryListing />
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

// Add Group import to Mantine components above
import { Group } from '@mantine/core';
