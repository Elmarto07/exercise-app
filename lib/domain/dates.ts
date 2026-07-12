/**
 * Formats a Date as YYYY-MM-DD in the device's local timezone (AD-2).
 * Never use toISOString().slice(0, 10) — that uses UTC and causes off-by-one bugs.
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns today's date as YYYY-MM-DD in local timezone. */
export function todayLocalDate(): string {
  return formatLocalDate(new Date());
}

function parseLocalDateString(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Spanish long date for history list rows (e.g. "sábado, 12 de julio"). */
export function formatHistoryListDate(date: string): string {
  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parseLocalDateString(date));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
