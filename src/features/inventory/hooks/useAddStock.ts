import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

import { getTodayISODate } from '@/shared/utils/date';
import { compressImage } from '@/shared/utils/image';

import { db, type DesignItem } from '../services/db';
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
  const [allDesignKeys, setAllDesignKeys] = useState<string[]>([]);
  const [designOptions, setDesignOptions] = useState<
    Array<{ value: string; image: Blob | string | null }>
  >([]);
  const [imagePreview, setImagePreview] = useState<Blob | string | null>(null);

  const [existingDesign, setExistingDesign] = useState<DesignItem | null>(null);
  const [updateImageToggle, setUpdateImageToggle] = useState(false);
  const [isNewDesign, setIsNewDesign] = useState(false);

  const form = useForm<AddStockFormValues>({
    initialValues: {
      designNo: '',
      quantity: 1,
      price: 0,
      date: getTodayISODate(),
      image: '',
    },
    validate: {
      designNo: (value) => (value.trim().length < 1 ? 'Design No is required' : null),
      quantity: (value) => (value < 1 ? 'Quantity must be at least 1' : null),
      image: (value) => {
        if (isNewDesign && !value) {
          return 'Image is required';
        }
        if (existingDesign && updateImageToggle && !value) {
          return 'Please upload a new image or disable the update toggle';
        }
        return null;
      },
    },
  });

  // Tier 1: Fetch lightweight design keys into memory
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await db.designs.orderBy('designNo').keys();
        setAllDesignKeys(keys.map(String));
      } catch (error) {
        console.error('Failed to fetch design keys:', error);
      }
    };
    fetchKeys();
  }, []);

  // Tier 2: Dynamically resolve top 10 matches with full object blobs
  useEffect(() => {
    const resolveOptions = async () => {
      try {
        const searchVal = form.values.designNo?.trim().toLowerCase() || '';
        const matchingKeys = allDesignKeys
          .filter((k) => k.toLowerCase().includes(searchVal))
          .slice(0, 10);

        const fullDesigns = await Promise.all(matchingKeys.map((k) => db.designs.get(k)));

        setDesignOptions(
          fullDesigns.filter(Boolean).map((d) => ({
            value: d!.designNo,
            image: d!.image || null,
          }))
        );
      } catch (error) {
        console.error('Failed to resolve design options:', error);
      }
    };

    if (allDesignKeys.length > 0) {
      resolveOptions();
    }
  }, [form.values.designNo, allDesignKeys]);

  // Reactive Design Lookup
  useEffect(() => {
    const checkDesign = async () => {
      const val = form.values.designNo?.trim();
      if (!val) {
        setExistingDesign(null);
        setIsNewDesign(false);
        setImagePreview(null);
        return;
      }
      const design = await db.designs.get(val);
      if (design) {
        setExistingDesign(design);
        setIsNewDesign(false);
        setImagePreview(design.image);
        // Pre-populate image to pass validation if updating is not toggled
        form.setFieldValue('image', design.image || '');
        form.clearFieldError('image');
      } else {
        setExistingDesign(null);
        setIsNewDesign(true);
        setUpdateImageToggle(false);
        // Clear preview if it was pre-populated from an existing design
        if (typeof form.values.image === 'string' && !form.values.image.startsWith('data:')) {
          setImagePreview(null);
          form.setFieldValue('image', '');
        }
      }
    };
    checkDesign();
  }, [form.values.designNo]);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setLoading(true);
      const blob = await compressImage(file);
      setImagePreview(blob);
      form.setFieldValue('image', blob);
      form.clearFieldError('image');
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
    const submissionValues = { ...values };

    // Strip image if the design is existing and they didn't toggle updating it
    if (existingDesign && !updateImageToggle) {
      delete (submissionValues as Partial<AddStockFormValues>).image;
    }

    const success = await inventoryService.addStock(submissionValues);
    setLoading(false);

    if (success) {
      form.reset();
      setImagePreview(null);
      setUpdateImageToggle(false);
      setExistingDesign(null);
      setIsNewDesign(false);
      if (onClear) onClear();
    }
  };

  return {
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
  };
}
