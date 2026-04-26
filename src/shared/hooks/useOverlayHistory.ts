import { useEffect, useRef } from 'react';

/**
 * Hook to handle mobile/browser back button for overlays (modals, drawers, etc.)
 * @param opened Whether the overlay is currently open
 * @param onClose Callback to close the overlay
 * @param id Unique identifier for the overlay state in history
 */
export function useOverlayHistory(opened: boolean, onClose: () => void, id: string) {
  const isPopStateChange = useRef(false);

  useEffect(() => {
    if (opened) {
      // Push state when opened
      window.history.pushState({ overlayId: id }, '');

      const handlePopState = (_event: PopStateEvent) => {
        // If the popped state doesn't match our ID, or is null, we close
        // This handles the browser back button
        isPopStateChange.current = true;
        onClose();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);

        // If we are closing NOT via popstate (e.g. clicking a close button),
        // we need to remove the state we pushed to keep history clean.
        if (!isPopStateChange.current && window.history.state?.overlayId === id) {
          window.history.back();
        }

        isPopStateChange.current = false;
      };
    }
  }, [opened, onClose, id]);
}
