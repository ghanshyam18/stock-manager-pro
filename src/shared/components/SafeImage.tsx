'use client';

import { Image, ImageProps, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: Blob | string | null | undefined;
  alt?: string;
  onClick?: () => void;
}

/**
 * SafeImage handles the lifecycle of Blob URLs.
 * It automatically creates an object URL when the component mounts and
 * revokes it when the component unmounts to prevent memory leaks.
 */
export function SafeImage({ src, ...props }: SafeImageProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setUrl(null);
      return;
    }

    if (src instanceof Blob) {
      const objectUrl = URL.createObjectURL(src);
      setUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    // If it's already a string (Base64 or external URL)
    setUrl(src);
  }, [src]);

  if (!url) {
    return <Skeleton h={props.h} w={props.w} radius={props.radius as string | number} />;
  }

  return <Image src={url} {...props} />;
}
