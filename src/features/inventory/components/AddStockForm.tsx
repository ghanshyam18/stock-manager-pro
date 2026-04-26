'use client';

import {
  Autocomplete,
  Box,
  Button,
  FileInput,
  Image,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Save, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getTodayISODate } from '@/shared/utils/date';
import { compressImage } from '@/shared/utils/image';

import { db } from '../services/db';

interface FormValues {
  designNo: string;
  quantity: number;
  price: number;
  date: string;
  image: string;
}

export function AddStockForm({ onClear }: { onClear?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [designOptions, setDesignOptions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      designNo: '',
      quantity: 1,
      price: 0,
      date: getTodayISODate(),
      image: '',
    },
    validate: {
      designNo: (value) => (value.length < 1 ? 'Design No is required' : null),
      quantity: (value) => (value < 1 ? 'Quantity must be at least 1' : null),
      image: (value) => (!value ? 'Image is required' : null),
    },
  });

  useEffect(() => {
    const fetchDesigns = async () => {
      const items = await db.inventory.toArray();
      const designs = Array.from(new Set(items.map((i) => i.designNo)));
      setDesignOptions(designs);
    };
    fetchDesigns();
  }, []);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setLoading(true);
      const base64 = await compressImage(file);
      setImagePreview(base64);
      form.setFieldValue('image', base64);
      notifications.show({
        title: 'Success',
        message: 'Image compressed and ready',
        color: 'teal',
      });
    } catch (_error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to process image',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await db.inventory.add({
        ...values,
        createdAt: Date.now(),
      });

      notifications.show({
        title: 'Success',
        message: 'Stock item added successfully',
        color: 'blue',
      });

      form.reset();
      setImagePreview(null);
      if (onClear) onClear();
    } catch (_error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save item',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack p="md">
        <Autocomplete
          label="Design No"
          placeholder="e.g. D-101"
          data={designOptions}
          required
          {...form.getInputProps('designNo')}
        />

        <FileInput
          label="Item Photo"
          placeholder="Upload image"
          leftSection={<Upload size={16} />}
          accept="image/*"
          required
          onChange={handleImageUpload}
          error={form.errors.image}
        />

        {imagePreview && (
          <Box style={{ position: 'relative', width: '100%', height: 200 }}>
            <Image src={imagePreview} alt="Preview" fit="contain" h={200} radius="md" />
            <Button
              variant="filled"
              color="red"
              size="xs"
              style={{ position: 'absolute', top: 5, right: 5 }}
              onClick={() => {
                setImagePreview(null);
                form.setFieldValue('image', '');
              }}
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
        />

        <NumberInput
          label="Price (₹)"
          placeholder="Enter price"
          min={0}
          required
          {...form.getInputProps('price')}
        />

        <TextInput label="Date" type="date" required {...form.getInputProps('date')} />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          leftSection={<Save size={18} />}
          size="md"
          mt="md"
        >
          Save Stock Item
        </Button>
      </Stack>
    </form>
  );
}
