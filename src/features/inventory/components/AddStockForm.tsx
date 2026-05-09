'use client';

import {
  Autocomplete,
  Box,
  Button,
  FileInput,
  NumberInput,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { Save, Upload, X } from 'lucide-react';

import { SafeImage } from '@/shared/components/SafeImage';

import { useAddStock } from '../hooks/useAddStock';

interface AddStockFormProps {
  onClear?: () => void;
}

/**
 * AddStockForm handles the input of new inventory items.
 * It uses the useAddStock hook for logic, image processing, and conditional UX.
 */
export function AddStockForm({ onClear }: AddStockFormProps) {
  const {
    form,
    loading,
    designOptions,
    imagePreview,
    isNewDesign,
    existingDesign,
    updateImageToggle,
    setUpdateImageToggle,
    handleImageUpload,
    clearImage,
    handleSubmit,
  } = useAddStock(onClear);

  const showUpload = !existingDesign || updateImageToggle;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} data-testid="add-stock-form">
      <Stack p="md" gap="md">
        <Autocomplete
          label="Design No"
          placeholder="e.g. D-101"
          data={designOptions}
          required
          {...form.getInputProps('designNo')}
          data-testid="input-design-no"
        />

        {existingDesign && (
          <Stack
            gap="xs"
            p="sm"
            style={{
              border: '1px solid var(--mantine-color-gray-2)',
              borderRadius: '16px',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
              Existing Design Image
            </Text>
            {existingDesign.image ? (
              <Box
                style={{ position: 'relative', width: '100%', height: 160 }}
                data-testid="existing-image-container"
              >
                <SafeImage
                  src={existingDesign.image}
                  alt="Existing"
                  fit="contain"
                  h={160}
                  radius="md"
                />
              </Box>
            ) : (
              <Text size="sm" c="dimmed" fs="italic">
                No image uploaded for this design yet.
              </Text>
            )}
            <Switch
              label="Update primary image for this design"
              checked={updateImageToggle}
              onChange={(event) => setUpdateImageToggle(event.currentTarget.checked)}
              data-testid="toggle-update-image"
              fw={600}
              size="sm"
              mt="xs"
            />
          </Stack>
        )}

        {showUpload && (
          <FileInput
            label={existingDesign ? 'New Primary Image' : 'Item Photo'}
            placeholder="Upload image"
            leftSection={<Upload size={16} />}
            accept="image/*"
            required={isNewDesign || !existingDesign}
            onChange={handleImageUpload}
            error={form.errors.image}
            data-testid="input-image"
          />
        )}

        {imagePreview && showUpload && (
          <Box
            style={{ position: 'relative', width: '100%', height: 200 }}
            data-testid="image-preview-container"
          >
            <SafeImage src={imagePreview} alt="Preview" fit="contain" h={200} radius="md" />
            <Button
              variant="filled"
              color="red"
              size="xs"
              style={{ position: 'absolute', top: 5, right: 5 }}
              onClick={clearImage}
              data-testid="clear-image-button"
            >
              <X size={14} />
            </Button>
          </Box>
        )}

        <NumberInput
          label="Quantity"
          placeholder="Enter quantity"
          min={1}
          required
          {...form.getInputProps('quantity')}
          data-testid="input-quantity"
        />

        <NumberInput
          label="Price (₹)"
          placeholder="Enter price"
          min={0}
          required
          {...form.getInputProps('price')}
          data-testid="input-price"
        />

        <TextInput
          label="Date"
          type="date"
          required
          {...form.getInputProps('date')}
          data-testid="input-date"
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          leftSection={<Save size={18} />}
          size="md"
          mt="md"
          color="blue"
          data-testid="submit-stock-button"
        >
          Save Stock Item
        </Button>
      </Stack>
    </form>
  );
}
