'use client';

import { Autocomplete, Box, Button, FileInput, NumberInput, Stack, TextInput } from '@mantine/core';
import { Save, Upload, X } from 'lucide-react';

import { SafeImage } from '@/shared/components/SafeImage';

import { useAddStock } from '../hooks/useAddStock';

interface AddStockFormProps {
  onClear?: () => void;
}

/**
 * AddStockForm handles the input of new inventory items.
 * It uses the useAddStock hook for logic and image processing.
 */
export function AddStockForm({ onClear }: AddStockFormProps) {
  const {
    form,
    loading,
    designOptions,
    imagePreview,
    handleImageUpload,
    clearImage,
    handleSubmit,
  } = useAddStock(onClear);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} data-testid="add-stock-form">
      <Stack p="md">
        <Autocomplete
          label="Design No"
          placeholder="e.g. D-101"
          data={designOptions}
          required
          {...form.getInputProps('designNo')}
          data-testid="input-design-no"
        />

        <FileInput
          label="Item Photo"
          placeholder="Upload image"
          leftSection={<Upload size={16} />}
          accept="image/*"
          required
          onChange={handleImageUpload}
          error={form.errors.image}
          data-testid="input-image"
        />

        {imagePreview && (
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
          data-testid="submit-stock-button"
        >
          Save Stock Item
        </Button>
      </Stack>
    </form>
  );
}
