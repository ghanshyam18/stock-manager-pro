/**
 * Formats a date string (YYYY-MM-DD) or Date object to DD-MM-YYYY
 */
export function formatDate(dateStr: string | Date | number): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Formats a timestamp or Date object to HH:MM AM/PM
 */
export function formatTime(dateVal: string | number | Date): string {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Helper to get current date in YYYY-MM-DD for input[type="date"]
 */
export function getTodayISODate(): string {
  return new Date().toISOString().split('T')[0];
}
