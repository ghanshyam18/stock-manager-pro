'use client';

import { Box, Container, Paper, Text, Title, Transition } from '@mantine/core';

import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { AddStockForm } from '@/features/inventory/components/AddStockForm';
import { InventoryListing } from '@/features/inventory/components/InventoryListing';
import { BottomNavigation } from '@/shared/components/BottomNavigation';
import { useUIStore } from '@/shared/store/useUIStore';

export default function Home() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <Box mih="100vh" bg="gray.0">
      <header
        style={{
          padding: '16px',
          backgroundColor: 'var(--mantine-color-white)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Container size="sm">
          <Text
            component="h1"
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Stockly
          </Text>
        </Container>
      </header>

      <main style={{ paddingBottom: '80px' }}>
        <Container size="sm" px="xs" py="md">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <Transition mounted={activeTab === 'dashboard'} transition="fade" duration={200}>
              {(styles) => (
                <Box style={styles}>
                  <Dashboard />
                </Box>
              )}
            </Transition>
          )}

          {/* Add Stock View */}
          {activeTab === 'add' && (
            <Transition mounted={activeTab === 'add'} transition="fade" duration={200}>
              {(styles) => (
                <Box style={styles}>
                  <Paper p="md" radius="lg" shadow="sm" withBorder>
                    <Title order={2} mb="lg" px="md">
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
            <Transition mounted={activeTab === 'listing'} transition="fade" duration={200}>
              {(styles) => (
                <Box style={styles}>
                  <Title order={2} mb="md" px="md">
                    Inventory History
                  </Title>
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
