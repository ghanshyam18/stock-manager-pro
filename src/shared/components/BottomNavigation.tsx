'use client';

import { Box, Flex, Paper, Text, UnstyledButton } from '@mantine/core';
import { FileText, PackageSearch, PlusCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { useActiveTab, useSetActiveTab } from '@/shared/store/useUIStore';

/**
 * BottomNavigation handles the primary app-level tab switching.
 * Optimized for high-standard visual stability:
 * - Uses solid background to prevent transparency flickering.
 * - Hardware accelerated for smooth scrolling.
 * - Precision-aligned to the bottom edge.
 * - Unified across home and billing routes.
 */
export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();

  const tabs = [
    { id: 'inventory', icon: PackageSearch, label: 'Inventory' },
    { id: 'add', icon: PlusCircle, label: 'Add Stock' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
  ] as const;

  // Determine active tab visually based on current route and Zustand state
  const getActiveTab = () => {
    if (pathname?.startsWith('/invoices')) {
      return 'invoices';
    }
    return activeTab;
  };

  const currentActiveTab = getActiveTab();

  const handleTabClick = (tabId: 'inventory' | 'add' | 'invoices') => {
    if (tabId === 'invoices') {
      router.push('/invoices');
    } else {
      setActiveTab(tabId);
      if (pathname !== '/') {
        router.push('/');
      }
    }
  };

  return (
    <Paper
      component="nav"
      shadow="xl"
      radius={0} // Ensure no default bottom radius
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      className="accelerated"
      style={{
        zIndex: 100,
        borderRadius: 'var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0',
        borderTop: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-body)', // Theme-compliant solid background
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        paddingTop: '8px',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.05)',
      }}
      data-testid="bottom-navigation"
    >
      <Flex justify="space-around" align="center" px="md">
        {tabs.map((tab) => {
          const isActive = currentActiveTab === tab.id;
          const Icon = tab.icon;

          return (
            <UnstyledButton
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              data-testid={`nav-tab-${tab.id}`}
              aria-label={`Switch to ${tab.label}`}
            >
              <Box
                style={{
                  color: isActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-4)',
                  transform: isActive ? 'translateY(-2px) scale(1.1)' : 'translateY(0) scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--mantine-radius-md)',
                  backgroundColor: isActive ? 'var(--mantine-color-blue-light)' : 'transparent',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </Box>
              <Text
                size="xs"
                fw={isActive ? 800 : 600}
                tt="uppercase"
                lts={0.5}
                style={{
                  color: isActive ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-5)',
                  marginTop: 4,
                  transition: 'color 0.2s ease',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {tab.label}
              </Text>

              {isActive && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: -4,
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
