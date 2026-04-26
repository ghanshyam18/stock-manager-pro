'use client';

import { useEffect } from 'react';

/**
 * Hook to prevent accidental tab closure by showing a native confirmation dialog.
 */
export function usePreventExit(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to trigger the native confirmation dialog
      e.preventDefault();
      // Most browsers require returnValue to be set
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
