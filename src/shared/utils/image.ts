import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and returns a Blob.
 * Storing as Blob in IndexedDB is significantly more memory-efficient than Base64.
 */
export async function compressImage(file: File): Promise<Blob> {
  const options = {
    maxSizeMB: 0.2, // 200KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
}
