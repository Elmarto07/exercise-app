/** Format countdown seconds as m:ss for Stretch Player display. */
export function formatStretchCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Wall-clock remaining seconds from an absolute end timestamp. */
export function remainingFromEndsAt(
  endsAtMs: number,
  nowMs: number = Date.now(),
): number {
  return Math.max(0, Math.ceil((endsAtMs - nowMs) / 1000));
}
