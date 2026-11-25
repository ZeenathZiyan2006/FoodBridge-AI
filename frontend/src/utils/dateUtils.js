/**
 * Parse a backend timestamp string as UTC when it lacks an explicit timezone offset.
 */
export function parseUtcDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const str = String(value).trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(str);
  return new Date(hasTimezone ? str : `${str}Z`);
}

/**
 * Determine whether an active (uncompleted) food donation has passed its consumption deadline.
 * Completed, Collected, and Cancelled records are preserved as historical entries.
 */
export function isDonationExpired(donation) {
  if (!donation) return true;
  if (donation.status === 'Expired' || donation.urgency_level === 'Expired') {
    return true;
  }
  if (['Completed', 'Collected', 'Cancelled'].includes(donation.status)) {
    return false;
  }
  if (donation.consumption_deadline) {
    const deadlineDate = parseUtcDate(donation.consumption_deadline);
    if (deadlineDate && !Number.isNaN(deadlineDate.getTime())) {
      return deadlineDate.getTime() <= Date.now();
    }
    return true;
  }
  if (donation.hours_left !== undefined && donation.hours_left !== null && donation.hours_left <= 0) {
    return true;
  }
  return true;
}

/**
 * Compute live remaining hours until consumption_deadline (minimum 0.1 while unexpired).
 */
export function getRemainingHours(donation) {
  if (!donation || donation.status === 'Expired') return 0;
  if (donation.consumption_deadline) {
    const deadlineDate = parseUtcDate(donation.consumption_deadline);
    if (deadlineDate && !Number.isNaN(deadlineDate.getTime())) {
      const diffMs = deadlineDate.getTime() - Date.now();
      if (diffMs <= 0) return 0;
      return Math.max(0.1, Math.round((diffMs / 3600000) * 10) / 10);
    }
  }
  return donation.hours_left ?? 0;
}

/**
 * Format remaining time from actual expiry timestamp:
 * - > 24 hours: days and hours (e.g. "2 days 4 hrs remaining")
 * - < 24 hours & >= 1 hour: hours and minutes (e.g. "5 hrs 24 mins remaining")
 * - < 1 hour: minutes (e.g. "42 mins remaining")
 * - Expired: "Expired"
 */
export function formatRemainingTime(donation, suffix = 'remaining') {
  if (!donation || donation.status === 'Expired') return 'Expired';
  if (donation.consumption_deadline) {
    const deadlineDate = parseUtcDate(donation.consumption_deadline);
    if (deadlineDate && !Number.isNaN(deadlineDate.getTime())) {
      const diffMs = deadlineDate.getTime() - Date.now();
      if (diffMs <= 0) return 'Expired';

      const totalMinutes = Math.ceil(diffMs / 60000);
      if (totalMinutes < 60) {
        return `${totalMinutes} ${totalMinutes === 1 ? 'min' : 'mins'} ${suffix}`;
      }

      const totalHours = Math.floor(diffMs / 3600000);
      if (totalHours >= 24) {
        const days = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        const dayLabel = `${days} ${days === 1 ? 'day' : 'days'}`;
        return remHours > 0
          ? `${dayLabel} ${remHours} ${remHours === 1 ? 'hr' : 'hrs'} ${suffix}`
          : `${dayLabel} ${suffix}`;
      }

      const remMins = Math.floor((diffMs % 3600000) / 60000);
      const hrLabel = `${totalHours} ${totalHours === 1 ? 'hr' : 'hrs'}`;
      return remMins > 0
        ? `${hrLabel} ${remMins} ${remMins === 1 ? 'min' : 'mins'} ${suffix}`
        : `${hrLabel} ${suffix}`;
    }
  }
  const hrs = getRemainingHours(donation);
  return hrs > 0 ? `${hrs} hrs ${suffix}` : 'Expired';
}
