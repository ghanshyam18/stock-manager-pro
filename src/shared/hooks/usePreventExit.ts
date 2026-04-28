'use client';

import { useEffect } from 'react';

import { useIsSafeToExit } from '../store/useUIStore';

/**
 * Hook to prevent accidental tab closure by showing a native confirmation dialog.
 * Enhanced: Respects a global "Safe To Exit" flag for legitimate reloads/exports.
 */
export function usePreventExit(enabled: boolean = true) {
  const isSafeToExit = useIsSafeToExit();

  useEffect(() => {
    if (!enabled || isSafeToExit) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to trigger the native confirmation dialog
      e.preventDefault();
      // Most browsers require returnValue to be set
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, isSafeToExit]);
}
