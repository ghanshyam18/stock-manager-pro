import { Accordion, Box, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { Building2, Phone, Pin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface BusinessProfile {
  name: string;
  address: string;
  contact: string;
}

export const BusinessProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    address: '',
    contact: '',
  });

  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stockly_business_profile');
      if (stored) {
        const parsed = JSON.parse(stored) as BusinessProfile;
        setProfile(parsed);
        // If name is blank, open accordion by default, else keep collapsed
        if (!parsed.name || parsed.name.trim() === '') {
          setAccordionValue('business-profile');
        }
      } else {
        // No profile exists, open by default
        setAccordionValue('business-profile');
      }
    } catch (e) {
      console.error('Failed to parse business profile from localStorage:', e);
      setAccordionValue('business-profile');
    }
  }, []);

  const handleFieldChange = (field: keyof BusinessProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    try {
      localStorage.setItem('stockly_business_profile', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save business profile to localStorage:', e);
    }
  };

  const getSummaryText = () => {
    if (!profile.name) {
      return 'Not configured — please add details';
    }
    const parts = [profile.name];
    if (profile.contact) {
      parts.push(profile.contact);
    }
    return parts.join(' • ');
  };

  return (
    <Paper radius="lg" withBorder shadow="xs" style={{ overflow: 'hidden' }}>
      <Accordion
        value={accordionValue}
        onChange={setAccordionValue}
        variant="filled"
        styles={{
          item: { border: 'none' },
          control: {
            padding: '12px 16px',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-default-hover)',
            },
          },
          panel: {
            backgroundColor: 'var(--mantine-color-default-hover)',
            borderTop: '1px solid var(--mantine-color-default-border)',
          },
        }}
      >
        <Accordion.Item value="business-profile">
          <Accordion.Control>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" style={{ flexGrow: 1, minWidth: 0 }}>
                <Box
                  p="xs"
                  style={{
                    backgroundColor: 'var(--mantine-color-blue-light)',
                    borderRadius: 'var(--mantine-radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={18} color="var(--mantine-color-blue-light-color)" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={800} style={{ letterSpacing: '-0.2px' }}>
                    Billing From (Your Business Details)
                  </Text>
                  <Text size="xs" c={profile.name ? 'dimmed' : 'red.7'} fw={700} truncate>
                    {getSummaryText()}
                  </Text>
                </Box>
              </Group>
            </Group>
          </Accordion.Control>

          <Accordion.Panel>
            <Stack gap="xs" mt="xs">
              <TextInput
                label="Your Business Name"
                placeholder="e.g. Acme Textiles"
                value={profile.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
                size="md"
              />
              <TextInput
                label="Business Address"
                placeholder="e.g. 123 Textile Lane, Gujarat, India"
                leftSection={<Pin size={18} strokeWidth={1.5} />}
                value={profile.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                size="md"
              />
              <TextInput
                label="Contact Phone / Email"
                placeholder="e.g. +91 98765 43210 or sales@acme.com"
                leftSection={<Phone size={18} strokeWidth={1.5} />}
                value={profile.contact}
                onChange={(e) => handleFieldChange('contact', e.target.value)}
                size="md"
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};
