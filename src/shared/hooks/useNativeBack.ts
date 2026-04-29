import { useEffect, useLayoutEffect, useRef } from 'react';

// Safe isomorphic layout effect to prevent SSR warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Global registry for history transactions.
 * Ensures the "Back" button always affects the top-most active UI element.
 */
let globalHistoryTransaction = 0;

/**
 * useNativeBack - A high-performance, universal hook for native-like back navigation.
 * Designed for Modals, Tabs, and Drawers in React 19 / Next.js 16 environments.
 */
export function useNativeBack(active: boolean, onBack: () => void, id: string) {
  const onBackRef = useRef(onBack);

  useIsomorphicLayoutEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useIsomorphicLayoutEffect(() => {
    if (!active) return;

    // Claim a unique transaction ID for this active state
    const myId = ++globalHistoryTransaction;
    const stateKey = `native-back-${id}-${myId}`;

    // Push a professional state object
    window.history.pushState({ nativeBackId: stateKey }, '');

    const handlePopState = (event: PopStateEvent) => {
      // If the browser moved away from our unique stateKey, trigger back action
      if (event.state?.nativeBackId !== stateKey) {
        onBackRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Clean up history only if we are the current top-most element
      // and we are closing via UI action (not via popstate).
      if (globalHistoryTransaction === myId && window.history.state?.nativeBackId === stateKey) {
        window.history.back();
      }
    };
  }, [active, id]);
}
