import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

import { getTodayISODate } from '@/shared/utils/date';
import { compressImage } from '@/shared/utils/image';

import { db } from '../services/db';
import { inventoryService } from '../services/inventoryService';

export interface AddStockFormValues {
  designNo: string;
  quantity: number;
  price: number;
  date: string;
  image: Blob | string;
}

export function useAddStock(onClear?: () => void) {
  const [loading, setLoading] = useState(false);
  const [designOptions, setDesignOptions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<Blob | string | null>(null);

  const form = useForm<AddStockFormValues>({
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
      try {
        const items = await db.inventory.toArray();
        const designs = Array.from(new Set(items.map((i) => i.designNo)));
        setDesignOptions(designs);
      } catch (error) {
        console.error('Failed to fetch design options:', error);
      }
    };
    fetchDesigns();
  }, []);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setLoading(true);
      const blob = await compressImage(file);
      setImagePreview(blob);
      form.setFieldValue('image', blob);
      notifications.show({
        title: 'Success',
        message: 'Image compressed and ready',
        color: 'teal',
      });
    } catch (error) {
      console.error('Image compression failed:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to process image',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    form.setFieldValue('image', '');
  };

  const handleSubmit = async (values: AddStockFormValues) => {
    setLoading(true);
    const success = await inventoryService.addStock(values);
    setLoading(false);

    if (success) {
      form.reset();
      setImagePreview(null);
      if (onClear) onClear();
    }
  };

  return {
    form,
    loading,
    designOptions,
    imagePreview,
    handleImageUpload,
    clearImage,
    handleSubmit,
  };
}
