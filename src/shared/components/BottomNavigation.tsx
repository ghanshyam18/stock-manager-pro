'use client';

import { Box, Flex, Paper, Text, UnstyledButton } from '@mantine/core';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';

import { useUIStore } from '@/shared/store/useUIStore';

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add', icon: PlusCircle, label: 'Add Stock' },
    { id: 'listing', icon: List, label: 'Inventory' },
  ] as const;

  return (
    <Paper
      component="nav"
      shadow="md"
      p="xs"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderRadius: '20px 20px 0 0',
        border: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-white)',
      }}
    >
      <Flex justify="space-around" align="center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <UnstyledButton
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                padding: '8px 0',
                transition: 'all 0.2s ease',
              }}
            >
              <Box
                style={{
                  color: isActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-5)',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Box>
              <Text
                size="xs"
                fw={isActive ? 700 : 500}
                style={{
                  color: isActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-6)',
                  marginTop: 4,
                }}
              >
                {tab.label}
              </Text>
            </UnstyledButton>
          );
        })}
      </Flex>
    </Paper>
  );
}
