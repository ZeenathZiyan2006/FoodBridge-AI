import { useEffect, useRef, useState } from 'react';
import { isDonationExpired } from '../utils/dateUtils';

/**
 * Watches a list of donations (or wrapper items via `getDonation`).
 * When an active item expires:
 * - If `preserveExpired` is false (default), immediately removes it from UI state.
 * - Calls `onExpireRefresh` to sync status transitions with the backend.
 * Also re-renders periodically so live countdown displays stay accurate, and
 * refreshes when the browser tab regains focus.
 */
export function useExpiryWatcher(
  items,
  setItems,
  onExpireRefresh,
  getDonation = (item) => item,
  intervalMs = 5000,
  preserveExpired = false
) {
  const itemsRef = useRef(items);
  const refreshRef = useRef(onExpireRefresh);
  const getDonationRef = useRef(getDonation);
  const [, setTick] = useState(0);

  itemsRef.current = items;
  refreshRef.current = onExpireRefresh;
  getDonationRef.current = getDonation;

  useEffect(() => {
    const checkExpiry = () => {
      const current = itemsRef.current || [];
      const hasNewlyExpired = current.some((item) => {
        const d = getDonationRef.current(item);
        return d && d.status !== 'Expired' && isDonationExpired(d);
      });

      if (hasNewlyExpired) {
        if (!preserveExpired) {
          setItems((prev) => prev.filter((item) => !isDonationExpired(getDonationRef.current(item))));
        }
        if (refreshRef.current) {
          refreshRef.current();
        }
      } else {
        setTick((t) => (t + 1) % 1000000);
      }
    };

    const id = setInterval(checkExpiry, intervalMs);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && refreshRef.current) {
        refreshRef.current();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [setItems, intervalMs, preserveExpired]);
}
