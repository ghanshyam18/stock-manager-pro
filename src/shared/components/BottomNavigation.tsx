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
      shadow="xl"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        borderRadius: '28px 28px 0 0',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        backgroundColor: 'var(--mantine-color-white)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        paddingTop: '12px',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Flex justify="space-around" align="center" px="md">
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
            >
              <Box
                style={{
                  color: isActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-4)',
                  transform: isActive ? 'translateY(-4px) scale(1.15)' : 'translateY(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  backgroundColor: isActive ? 'var(--mantine-color-blue-0)' : 'transparent',
                }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Box>
              <Text
                size="10px"
                fw={isActive ? 800 : 600}
                tt="uppercase"
                lts={0.5}
                style={{
                  color: isActive ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-5)',
                  marginTop: 6,
                  transition: 'color 0.3s ease',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {tab.label}
              </Text>

              {isActive && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-blue-6)',
                  }}
                />
              )}
            </UnstyledButton>
          );
        })}
      </Flex>
    </Paper>
  );
}
