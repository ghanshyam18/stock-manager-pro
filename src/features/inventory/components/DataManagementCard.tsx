'use client';

import {
  Button,
  FileButton,
  LoadingOverlay,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Download, Upload } from 'lucide-react';
import { useState } from 'react';

import { DataManagement } from '@/shared/utils/dataManagement';

/**
 * DataManagementCard provides import/export database functions with premium aesthetics.
 */
export function DataManagementCard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsProcessing(true);
    setProgress(0);
    await DataManagement.exportToJSON((p) => setProgress(p));
    setIsProcessing(false);
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    await DataManagement.importFromJSON(file, (p) => setProgress(p));
    setIsProcessing(false);
  };

  return (
    <Paper
      p="lg"
      radius="24px"
      shadow="md"
      withBorder
      bg="white"
      mt="md"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <LoadingOverlay
        visible={isProcessing}
        overlayProps={{ blur: 2 }}
        loaderProps={{
          children: (
            <Stack align="center" gap="xs">
              <Text fw={700} size="md">
                Processing Data...
              </Text>
              <Progress value={progress} w={200} size="xl" radius="xl" animated />
              <Text size="sm" c="dimmed">
                {progress}% complete
              </Text>
            </Stack>
          ),
        }}
      />

      <Stack gap="xs" mb="md">
        <Title order={3} fw={900} size="h4">
          Data Backup & Portability
        </Title>
        <Text size="xs" c="dimmed" lh="1.4">
          Safely export your inventory transaction records and design assets into a JSON backup
          file, or restore them from an existing backup.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Button
          variant="light"
          color="blue"
          fullWidth
          size="md"
          leftSection={<Download size={18} />}
          radius="xl"
          onClick={handleExport}
          data-testid="export-db-button"
        >
          Export Backup (JSON)
        </Button>

        <FileButton onChange={handleImport} accept="application/json">
          {(props) => (
            <Button
              {...props}
              variant="light"
              color="teal"
              fullWidth
              size="md"
              leftSection={<Upload size={18} />}
              radius="xl"
              data-testid="import-db-button"
            >
              Import Backup (JSON)
            </Button>
          )}
        </FileButton>
      </Stack>

      <Text size="xs" c="dimmed" style={{ textAlign: 'center' }} mt="md" px="xs" lh="1.3">
        * Restoring will completely overwrite the local database with backup records.
      </Text>
    </Paper>
  );
}
